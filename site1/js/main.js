/**
 * RAIDO Logistics - Main JavaScript
 * Professional Logistics Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    Preloader.init();
    Navigation.init();
    LanguageSwitcher.init();
    ScrollEffects.init();
    CounterAnimation.init();
    ContactForm.updateYear();
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

/**
 * Preloader Module
 */
const Preloader = {
    init: function() {
        const preloader = document.getElementById('preloader');
        
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hidden');
                document.body.style.overflow = 'visible';
            }, 1500);
        });
    }
};

/**
 * Navigation Module
 */
const Navigation = {
    init: function() {
        this.navbar = document.getElementById('navbar');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.bindEvents();
        this.handleScroll();
    },
    
    bindEvents: function() {
        const self = this;
        
        // Hamburger menu toggle
        this.hamburger.addEventListener('click', function() {
            self.toggleMobileMenu();
        });
        
        // Close menu on link click
        this.navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                self.closeMobileMenu();
                self.setActiveLink(this);
            });
        });
        
        // Scroll event
        window.addEventListener('scroll', function() {
            self.handleScroll();
            self.updateActiveLink();
        });
        
        // Close menu on outside click
        document.addEventListener('click', function(e) {
            if (!self.navbar.contains(e.target) && self.navMenu.classList.contains('active')) {
                self.closeMobileMenu();
            }
        });
    },
    
    toggleMobileMenu: function() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    },
    
    closeMobileMenu: function() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    handleScroll: function() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    },
    
    setActiveLink: function(clickedLink) {
        this.navLinks.forEach(function(link) {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
    },
    
    updateActiveLink: function() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
};

/**
 * Language Switcher Module
 */
const LanguageSwitcher = {
    currentLang: 'pl',
    
    init: function() {
        this.langBtns = document.querySelectorAll('.lang-btn');
        this.translatableElements = document.querySelectorAll('[data-pl], [data-en]');
        
        this.bindEvents();
        this.loadSavedLanguage();
    },
    
    bindEvents: function() {
        const self = this;
        
        this.langBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                self.switchLanguage(lang);
            });
        });
    },
    
    switchLanguage: function(lang) {
        this.currentLang = lang;
        
        // Update active button
        this.langBtns.forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        
        // Translate all elements
        this.translatableElements.forEach(function(el) {
            const translation = el.getAttribute('data-' + lang);
            if (translation) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Save preference
        localStorage.setItem('raido-language', lang);
    },
    
    loadSavedLanguage: function() {
        const savedLang = localStorage.getItem('raido-language');
        if (savedLang && savedLang !== this.currentLang) {
            this.switchLanguage(savedLang);
        }
    }
};

/**
 * Scroll Effects Module
 */
const ScrollEffects = {
    init: function() {
        this.backToTop = document.getElementById('backToTop');
        this.bindEvents();
    },
    
    bindEvents: function() {
        const self = this;
        
        // Back to top visibility
        window.addEventListener('scroll', function() {
            self.toggleBackToTop();
        });
        
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    toggleBackToTop: function() {
        if (window.scrollY > 500) {
            this.backToTop.classList.add('visible');
        } else {
            this.backToTop.classList.remove('visible');
        }
    }
};

/**
 * Counter Animation Module
 */
const CounterAnimation = {
    init: function() {
        this.counters = document.querySelectorAll('.stat-number');
        this.animated = false;
        this.bindEvents();
    },
    
    bindEvents: function() {
        const self = this;
        
        window.addEventListener('scroll', function() {
            self.checkVisibility();
        });
        
        // Initial check
        this.checkVisibility();
    },
    
    checkVisibility: function() {
        if (this.animated) return;
        
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            this.animateCounters();
            this.animated = true;
        }
    },
    
    animateCounters: function() {
        this.counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const updateCounter = function() {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
};

/**
 * Contact Form Module
 */
const ContactForm = {
    updateYear: function() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
};

/**
 * Utility Functions
 */
const Utils = {
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    },
    
    debounce: function(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }
};

/**
 * Parallax Effect (optional enhancement)
 */
const Parallax = {
    init: function() {
        this.hero = document.querySelector('.hero-bg');
        if (this.hero) {
            this.bindEvents();
        }
    },
    
    bindEvents: function() {
        const self = this;
        window.addEventListener('scroll', Utils.throttle(function() {
            self.updateParallax();
        }, 16));
    },
    
    updateParallax: function() {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        this.hero.style.transform = 'translateY(' + rate + 'px)';
    }
};

// Initialize parallax on load
window.addEventListener('load', function() {
    Parallax.init();
});