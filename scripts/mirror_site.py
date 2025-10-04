#!/usr/bin/env python3
import os
import re
import sys
import ssl
import urllib.request
import urllib.parse
from pathlib import Path

ROOT = "/workspace/site"
INDEX = os.path.join(ROOT, "index.html")

ASSET_SUBDIR_FOR_EXT = {
    ".css": "assets/css",
    ".js": "assets/js",
    ".mjs": "assets/js",
    ".jpg": "assets/img",
    ".jpeg": "assets/img",
    ".png": "assets/img",
    ".gif": "assets/img",
    ".svg": "assets/img",
    ".webp": "assets/img",
    ".avif": "assets/img",
    ".ico": "assets/img",
    ".json": "assets/json",
    ".mp4": "assets/video",
    ".webm": "assets/video",
    ".ogv": "assets/video",
    ".woff": "assets/fonts",
    ".woff2": "assets/fonts",
    ".ttf": "assets/fonts",
    ".otf": "assets/fonts",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Connection": "keep-alive",
    "Referer": "https://vassiliss-stupendous-site.webflow.io/",
}

ATTR_PATTERN = re.compile(r'(?:href|src|poster|data-src|srcset)=["\']([^"\']+)["\']', re.IGNORECASE)


def expand_srcset(value: str):
    # If this looks like a srcset list, split into individual URLs; else return the single value
    if "," in value and (" 1x" in value or " 2x" in value or " 3x" in value or " 500w" in value or " 800w" in value or " 1080w" in value or " 1920w" in value):
        urls = []
        for part in value.split(","):
            part = part.strip()
            if not part:
                continue
            url_only = part.split()[0]
            urls.append(url_only)
        return urls
    return [value]


def guess_local_path(url: str):
    parsed = urllib.parse.urlparse(url)
    path = parsed.path
    ext = os.path.splitext(path)[1].lower()
    subdir = ASSET_SUBDIR_FOR_EXT.get(ext)
    if not subdir:
        return None, None
    filename = os.path.basename(path) or (parsed.netloc.replace(":", "_") + (ext or ".asset"))
    # Drop query string from filename (keep extension)
    filename = urllib.parse.unquote(filename)
    local_rel = f"{subdir}/{filename}"
    local_abs = os.path.join(ROOT, local_rel)
    return local_rel, local_abs


def download(url: str, dest_abs: str) -> bool:
    try:
        Path(os.path.dirname(dest_abs)).mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(url, headers=HEADERS)
        # Use default SSL context
        with urllib.request.urlopen(req, context=ssl.create_default_context(), timeout=60) as resp:
            data = resp.read()
        with open(dest_abs, "wb") as f:
            f.write(data)
        return True
    except Exception as e:
        print(f"WARN: Failed to download {url} -> {dest_abs}: {e}")
        return False


def main():
    if not os.path.exists(INDEX):
        print(f"ERROR: {INDEX} not found.")
        sys.exit(1)

    with open(INDEX, "r", encoding="utf-8") as f:
        html = f.read()

    # Collect candidate URLs
    raw_values = ATTR_PATTERN.findall(html)
    urls = []
    for val in raw_values:
        for u in expand_srcset(val):
            if u.startswith("http://") or u.startswith("https://"):
                urls.append(u)

    # De-duplicate while preserving order
    seen = set()
    unique_urls = []
    for u in urls:
        if u not in seen:
            unique_urls.append(u)
            seen.add(u)

    url_to_local = {}
    downloaded = 0
    skipped = 0

    for u in unique_urls:
        local_rel, local_abs = guess_local_path(u)
        if not local_rel:
            skipped += 1
            continue
        # Normalize filename to drop query for disk but keep mapping using full URL for replace
        # Ensure we don't overwrite existing successful files unnecessarily
        ok = download(u, local_abs)
        if ok:
            url_to_local[u] = local_rel
            downloaded += 1
        else:
            skipped += 1

    # Rewrite only URLs we successfully downloaded
    rewritten_html = html
    for remote, rel in url_to_local.items():
        rewritten_html = rewritten_html.replace(remote, rel)

    if rewritten_html != html:
        with open(INDEX, "w", encoding="utf-8") as f:
            f.write(rewritten_html)

    print(f"Downloaded: {downloaded}, Skipped/External: {skipped}, Rewritten: {len(url_to_local)}")


if __name__ == "__main__":
    main()
