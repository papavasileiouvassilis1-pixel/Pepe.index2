// Initialize Lenis smooth scrolling
const lenis = new Lenis({
    lerp: 0,
    wheelMultiplier: 0.8,
    infinite: false,
    gestureOrientation: "vertical",
    normalizeWheel: false,
    smoothTouch: false
});

// Lenis animation loop
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Scroll to top on load
setTimeout(() => {
    lenis.scrollTo(0, { immediate: true });
}, 1);

// Handle page show (back/forward navigation)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        lenis.scrollTo(0, { immediate: true });
    }
});

// Lenis controls
$("[data-lenis-start]").on("click", function () {
    lenis.start();
});

$("[data-lenis-stop]").on("click", function () {
    lenis.stop();
});

$("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
        lenis.stop();
    } else {
        lenis.start();
    }
});

// GSAP and ScrollTrigger setup
gsap.registerPlugin(ScrollTrigger);

// Animation utilities
function animateOnScroll() {
    // Hero animations
    gsap.from(".sub-title", {
        duration: 1,
        y: 30,
        opacity: 0,
        delay: 0.5,
        ease: "power2.out"
    });

    gsap.from(".hero .intro-title", {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 1,
        ease: "power2.out"
    });

    gsap.from(".tag-intro", {
        duration: 1,
        y: 30,
        opacity: 0,
        delay: 1.5,
        ease: "power2.out"
    });

    // Scroll-triggered animations
    gsap.utils.toArray('.text-effect').forEach((element, index) => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out"
        });
    });

    // Profile cards animation
    gsap.from(".profile-card", {
        scrollTrigger: {
            trigger: "#the-pack",
            start: "top 60%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out"
    });

    // Services animation
    gsap.from(".services-list-child-left, .services-list-child-right", {
        scrollTrigger: {
            trigger: "#treats-and-tricks",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        x: (index) => (index % 2 === 0 ? -50 : 50),
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Contact form animation
    gsap.from(".cta-parent", {
        scrollTrigger: {
            trigger: ".cta-parent",
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });

    // Parallax effects
    gsap.to(".bone-child", {
        scrollTrigger: {
            trigger: "#our-tail",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        y: (index) => [0, -20, 20][index] || 0,
        ease: "none"
    });

    // Circle pop hover effect
    gsap.utils.toArray('.circle-pop, .circle-pop-two').forEach(circle => {
        circle.addEventListener('mouseenter', () => {
            gsap.to(circle.querySelector('img'), {
                scale: 1.1,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        circle.addEventListener('mouseleave', () => {
            gsap.to(circle.querySelector('img'), {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// Lazy load videos
function lazyLoadVideos() {
    let lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

    if ("IntersectionObserver" in window) {
        let lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(video) {
                if (video.isIntersecting) {
                    for (let source in video.target.children) {
                        let videoSource = video.target.children[source];
                        if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                            videoSource.src = videoSource.dataset.src;
                        }
                    }

                    video.target.load();
                    video.target.classList.remove("lazy");
                    lazyVideoObserver.unobserve(video.target);
                }
            });
        });

        lazyVideos.forEach(function(lazyVideo) {
            lazyVideoObserver.observe(lazyVideo);
        });
    }
}

// Navigation menu functionality
function initNavigation() {
    const menuBtn = document.querySelector('.menu-btn');
    const menuDropdown = document.querySelector('.menu-drop-down');

    if (menuBtn && menuDropdown) {
        menuBtn.addEventListener('click', () => {
            menuDropdown.style.opacity = menuDropdown.style.opacity === '1' ? '0' : '1';
            menuDropdown.style.visibility = menuDropdown.style.visibility === 'visible' ? 'hidden' : 'visible';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuDropdown.style.opacity = '0';
                menuDropdown.style.visibility = 'hidden';
            }
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-link-parent').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    lenis.scrollTo(targetElement);
                    menuDropdown.style.opacity = '0';
                    menuDropdown.style.visibility = 'hidden';
                }
            });
        });
    }
}

// Form handling
function initForm() {
    const form = document.querySelector('.form-block');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show success message (in a real app, you'd submit to a server)
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            // Reset form
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        });
    }
}

// Text effect animations
function initTextEffects() {
    const textEffects = document.querySelectorAll('.text-effect');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.8s ease ${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1}s forwards`;
            }
        });
    }, { threshold: 0.1 });

    textEffects.forEach(effect => observer.observe(effect));
}

// Floating animation for bones
function initFloatingAnimation() {
    gsap.to(".bone-child.one", {
        y: -10,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });

    gsap.to(".bone-child.two", {
        y: 10,
        duration: 3,
        delay: 0.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });

    gsap.to(".bone-child.three", {
        y: -5,
        duration: 3,
        delay: 1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize features
    lazyLoadVideos();
    initNavigation();
    initForm();
    initTextEffects();
    initFloatingAnimation();

    // Start animations
    animateOnScroll();

    // Add scroll-triggered animations for specific elements
    ScrollTrigger.create({
        trigger: ".grump-cat-one",
        start: "top 80%",
        onEnter: () => {
            gsap.from(".grump-cat-one", {
                x: -100,
                opacity: 0,
                duration: 1,
                ease: "power2.out"
            });
        }
    });

    // Profile card interactions
    document.querySelectorAll('.profile-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Service items hover effects
    document.querySelectorAll('.services-list-child-left, .services-list-child-right').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// Add loading class removal for smooth animations
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});