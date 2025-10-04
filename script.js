// Bark Studio - Interactive JavaScript

// Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuBtn');
    const menuDropDown = document.getElementById('menuDropDown');
    
    if (menuBtn && menuDropDown) {
        menuBtn.addEventListener('click', function() {
            menuDropDown.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link-parent');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuDropDown.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!menuBtn.contains(event.target) && !menuDropDown.contains(event.target)) {
                menuDropDown.classList.remove('active');
            }
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form Submission Handler
    const form = document.getElementById('email-form');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');

            if (nameInput.value && emailInput.value) {
                // Show success message
                form.style.display = 'none';
                successMessage.style.display = 'block';
                
                // Reset form and hide success message after 3 seconds
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successMessage.style.display = 'none';
                }, 3000);
            } else {
                // Show error message
                errorMessage.style.display = 'block';
                
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 3000);
            }
        });
    }

    // Scroll-based Animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply fade-in animation to scroll text elements
    const scrollTextElements = document.querySelectorAll('.scroll-text');
    scrollTextElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        fadeInObserver.observe(el);
    });

    // Parallax Effect for Images
    let scrollPosition = 0;
    let ticking = false;

    function updateParallax() {
        const imgScroll = document.querySelector('.img-scroll');
        if (imgScroll) {
            const scrollY = window.pageYOffset;
            imgScroll.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        scrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // Animate Profile Cards on Scroll
    const profileCards = document.querySelectorAll('.profile-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = entry.target.style.transform.replace('translateY(50px)', 'translateY(0)');
                }, index * 200);
            }
        });
    }, {
        threshold: 0.2
    });

    profileCards.forEach(card => {
        card.style.opacity = '0';
        const currentTransform = card.style.transform || '';
        card.style.transform = currentTransform + ' translateY(50px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border 0.2s ease';
        cardObserver.observe(card);
    });

    // Service List Item Hover Effects
    const serviceItems = document.querySelectorAll('.services-list-child-left, .services-list-child-right');
    
    serviceItems.forEach(item => {
        const paw = item.querySelector('.paw-left, .paw-right');
        
        item.addEventListener('mouseenter', function() {
            if (paw) {
                if (paw.classList.contains('paw-left')) {
                    paw.style.transform = 'translateX(5rem)';
                } else {
                    paw.style.transform = 'translateX(-5rem)';
                }
            }
        });

        item.addEventListener('mouseleave', function() {
            if (paw) {
                paw.style.transform = 'translateX(0)';
            }
        });
    });

    // Lazy Load Videos
    const lazyVideos = document.querySelectorAll('video.lazy');
    
    if ('IntersectionObserver' in window) {
        const lazyVideoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(video) {
                if (video.isIntersecting) {
                    const sources = video.target.querySelectorAll('source');
                    sources.forEach(source => {
                        if (source.dataset.src) {
                            source.src = source.dataset.src;
                        }
                    });
                    
                    video.target.load();
                    video.target.classList.remove('lazy');
                    lazyVideoObserver.unobserve(video.target);
                }
            });
        });

        lazyVideos.forEach(function(lazyVideo) {
            lazyVideoObserver.observe(lazyVideo);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyVideos.forEach(video => {
            const sources = video.querySelectorAll('source');
            sources.forEach(source => {
                if (source.dataset.src) {
                    source.src = source.dataset.src;
                }
            });
            video.load();
        });
    }

    // Scroll Progress Indicator (Optional Enhancement)
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        
        // You can use this value to create visual effects
        document.body.style.setProperty('--scroll-progress', scrollProgress);
    }

    window.addEventListener('scroll', updateScrollProgress);

    // Animate Text on Scroll (Text Shadow Effect)
    const textEffects = document.querySelectorAll('.text-effect');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset;
        
        textEffects.forEach(text => {
            const rect = text.getBoundingClientRect();
            const elementTop = rect.top;
            const windowHeight = window.innerHeight;
            
            // Calculate the visibility percentage
            if (elementTop < windowHeight && elementTop > -rect.height) {
                const visibilityPercentage = 1 - (elementTop / windowHeight);
                const shadowY = Math.max(0, 1 - visibilityPercentage) * 1;
                text.style.textShadow = `0 ${shadowY}em`;
            }
        });
    });

    // Add Entrance Animations
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Performance: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add hover effect to menu button
    if (menuBtn) {
        menuBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        menuBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Initialize all animations
    console.log('🐕 Bark Studio initialized! Woof woof!');
});

// Page Load Animation
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Prevent scroll restoration on page reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scroll to top on page load
window.addEventListener('load', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
});
