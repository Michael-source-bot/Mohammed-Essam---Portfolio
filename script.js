// Portfolio Website JavaScript
// Author: Mohamed Essam Mahmoud

class PortfolioWebsite {
    constructor() {
        this.currentLanguage = 'en';
        this.currentTheme = 'light';
        this.isMenuOpen = false;
        this.isLanguageChanging = false;
        this.animatedElements = new Set();
        this.currentTestimonial = 0;
        this.testimonialInterval = null;
        this.particles = [];
        this.observers = [];
        this.timers = [];
        this.isInitialized = false;
        this.typingElements = new Set();
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.initializeTheme();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupProjectFiltering();
        this.setupSkillAnimations();
        this.setupContactForm();
        this.setupNavbarScroll();
        this.setupTypingEffect();
        this.setupParallaxEffects();
        this.setupBackToTop();
        this.setupTestimonials();
        this.setupParticleSystem();
        this.setupLazyLoading();
        this.setupEnhancedAnimations();
        
        this.isInitialized = true;
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Remove existing listeners first
        this.removeEventListeners();
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            this.themeToggleHandler = () => this.toggleTheme();
            themeToggle.addEventListener('click', this.themeToggleHandler);
        }

        // Language toggle
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            this.languageToggleHandler = () => this.toggleLanguage();
            languageToggle.addEventListener('click', this.languageToggleHandler);
        }

        // Mobile menu toggle
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        if (hamburger && navMenu) {
            this.hamburgerHandler = () => this.toggleMobileMenu();
            hamburger.addEventListener('click', this.hamburgerHandler);
        }

        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        this.navLinkHandlers = [];
        navLinks.forEach(link => {
            const handler = () => {
                if (this.isMenuOpen) {
                    this.toggleMobileMenu();
                }
            };
            this.navLinkHandlers.push(handler);
            link.addEventListener('click', handler);
        });

        // Close mobile menu when clicking outside
        this.documentClickHandler = (e) => {
            if (this.isMenuOpen && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                this.toggleMobileMenu();
            }
        };
        document.addEventListener('click', this.documentClickHandler);

        // Window resize handler
        this.resizeHandler = () => this.handleResize();
        window.addEventListener('resize', this.resizeHandler);

        // Scroll handler
        this.scrollHandler = () => this.handleScroll();
        window.addEventListener('scroll', this.scrollHandler);
    }

    removeEventListeners() {
        // Remove theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle && this.themeToggleHandler) {
            themeToggle.removeEventListener('click', this.themeToggleHandler);
        }

        // Remove language toggle
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle && this.languageToggleHandler) {
            languageToggle.removeEventListener('click', this.languageToggleHandler);
        }

        // Remove hamburger
        const hamburger = document.getElementById('hamburger');
        if (hamburger && this.hamburgerHandler) {
            hamburger.removeEventListener('click', this.hamburgerHandler);
        }

        // Remove nav links
        const navLinks = document.querySelectorAll('.nav-link');
        if (this.navLinkHandlers) {
            navLinks.forEach((link, index) => {
                if (this.navLinkHandlers[index]) {
                    link.removeEventListener('click', this.navLinkHandlers[index]);
                }
            });
        }

        // Remove document click
        if (this.documentClickHandler) {
            document.removeEventListener('click', this.documentClickHandler);
        }

        // Remove window listeners
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
        }
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
    }

    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        
        // Update theme
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // Language Management
    toggleLanguage() {
        // Prevent multiple rapid clicks
        if (this.isLanguageChanging) return;
        this.isLanguageChanging = true;
        
        const newLanguage = this.currentLanguage === 'en' ? 'ar' : 'en';
        this.setLanguage(newLanguage);
        localStorage.setItem('portfolio-language', newLanguage);
        
        // Reset flag immediately since we're not using animations
        this.isLanguageChanging = false;
    }

    setLanguage(language) {
        this.currentLanguage = language;
        
        // Update HTML attributes immediately
        document.documentElement.lang = language;
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        
        // Get all elements that need translation
        const elements = document.querySelectorAll('[data-en][data-ar]');
        
        // Update all text content immediately
        elements.forEach(element => {
            const text = element.getAttribute(`data-${language}`);
            if (text) {
                element.textContent = text;
            }
        });
        
        // Update language toggle button text immediately
        const langText = document.querySelector('.lang-text');
        if (langText) {
            langText.textContent = language === 'en' ? 'العربية' : 'English';
        }
        
        // Add haptic feedback for mobile devices
        if (navigator.vibrate) {
            navigator.vibrate(30); // Short vibration
        }
    }

    // Mobile Menu Management
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        if (navMenu && hamburger) {
            navMenu.classList.toggle('active', this.isMenuOpen);
            hamburger.classList.toggle('active', this.isMenuOpen);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        }
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        // Clear existing observers
        this.observers.forEach(obs => obs.disconnect());
        this.observers = [];
        this.animatedElements.clear();

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    // Add a small delay to prevent animation conflicts
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                        this.animatedElements.add(entry.target);
                        
                        // Special handling for skill progress bars
                        if (entry.target.classList.contains('skill-progress')) {
                            this.animateSkillBar(entry.target);
                        }
                    }, 50);
                }
            });
        }, observerOptions);

        // Store observer for cleanup
        this.observers.push(observer);

        // Observe elements for animation
        const elementsToAnimate = document.querySelectorAll('.section-header, .about-content, .project-card, .skill-category, .contact-item, .stat-item');
        elementsToAnimate.forEach(element => {
            // Reset animation state
            element.classList.remove('animated', 'animate-in');
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });
    }

    // Navbar Scroll Effects
    setupNavbarScroll() {
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (navbar) {
                // Add/remove scrolled class for styling
                navbar.classList.toggle('scrolled', currentScrollY > 50);
                
                // Hide/show navbar on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Project Filtering
    setupProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const shouldShow = filter === 'all' || category === filter;
                    
                    if (shouldShow) {
                        card.classList.remove('hidden');
                        setTimeout(() => {
                            card.style.display = 'block';
                        }, 50);
                    } else {
                        card.classList.add('hidden');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Skill Bar Animations
    setupSkillAnimations() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            bar.style.width = '0%';
        });
    }

    animateSkillBar(bar) {
        const targetWidth = bar.getAttribute('data-width');
        let currentWidth = 0;
        const increment = targetWidth / 50; // 50 steps for smooth animation
        
        const timer = setInterval(() => {
            currentWidth += increment;
            if (currentWidth >= targetWidth) {
                currentWidth = targetWidth;
                clearInterval(timer);
            }
            bar.style.width = currentWidth + '%';
        }, 20);
    }

    // Contact Form
    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });

            // Add floating label effect
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        input.parentElement.classList.remove('focused');
                    }
                });
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = this.currentLanguage === 'en' ? 'Sending...' : 'جاري الإرسال...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            this.showNotification(
                this.currentLanguage === 'en' 
                    ? 'Message sent successfully!' 
                    : 'تم إرسال الرسالة بنجاح!',
                'success'
            );
            
            // Reset form with animation
            this.resetFormWithAnimation(form);
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }, 2000);
    }

    validateForm(data) {
        const errors = [];
        
        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            errors.push(this.currentLanguage === 'en' ? 'Name must be at least 2 characters' : 'الاسم يجب أن يكون حرفين على الأقل');
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            errors.push(this.currentLanguage === 'en' ? 'Please enter a valid email' : 'يرجى إدخال بريد إلكتروني صحيح');
        }
        
        // Subject validation
        if (!data.subject || data.subject.trim().length < 3) {
            errors.push(this.currentLanguage === 'en' ? 'Subject must be at least 3 characters' : 'الموضوع يجب أن يكون 3 أحرف على الأقل');
        }
        
        // Message validation
        if (!data.message || data.message.trim().length < 10) {
            errors.push(this.currentLanguage === 'en' ? 'Message must be at least 10 characters' : 'الرسالة يجب أن تكون 10 أحرف على الأقل');
        }
        
        if (errors.length > 0) {
            this.showNotification(errors.join(', '), 'error');
            return false;
        }
        
        return true;
    }

    resetFormWithAnimation(form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.style.transform = 'scale(0.95)';
                input.style.opacity = '0.5';
                
                setTimeout(() => {
                    input.value = '';
                    input.style.transform = 'scale(1)';
                    input.style.opacity = '1';
                }, 150);
            }, index * 100);
        });
    }

    // Typing Effect
    setupTypingEffect() {
        const typingElements = document.querySelectorAll('.typing-effect');
        typingElements.forEach(element => {
            if (!this.typingElements.has(element)) {
                this.createTypingEffect(element);
                this.typingElements.add(element);
            }
        });
    }

    createTypingEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const timer = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(timer);
                this.timers = this.timers.filter(t => t !== timer);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
        
        this.timers.push(timer);
    }

    // Parallax Effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.1 + (index * 0.05);
                element.style.transform = `translateY(${rate * speed}px)`;
            });
        });
    }

    // Notification System
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility Methods
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    handleScroll() {
        // Update active navigation link
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Back to Top Button
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Testimonials Slider
    setupTestimonials() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.getElementById('testimonial-prev');
        const nextBtn = document.getElementById('testimonial-next');

        if (testimonialCards.length === 0) return;

        const showTestimonial = (index) => {
            // Hide all cards
            testimonialCards.forEach(card => card.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            // Show current card
            if (testimonialCards[index]) {
                testimonialCards[index].classList.add('active');
            }
            if (dots[index]) {
                dots[index].classList.add('active');
            }

            this.currentTestimonial = index;
        };

        const nextTestimonial = () => {
            const next = (this.currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(next);
        };

        const prevTestimonial = () => {
            const prev = (this.currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(prev);
        };

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
        if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showTestimonial(index));
        });

        // Auto-rotate testimonials
        this.testimonialInterval = setInterval(nextTestimonial, 5000);

        // Pause on hover
        const slider = document.querySelector('.testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => {
                clearInterval(this.testimonialInterval);
            });
            slider.addEventListener('mouseleave', () => {
                this.testimonialInterval = setInterval(nextTestimonial, 5000);
            });
        }
    }

    // Particle System
    setupParticleSystem() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 2-6px
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random horizontal position
            particle.style.left = Math.random() * 100 + '%';
            
            // Random animation duration
            const duration = Math.random() * 10 + 20; // 20-30 seconds
            particle.style.animationDuration = duration + 's';
            
            container.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, duration * 1000);
        };

        // Create particles periodically
        setInterval(createParticle, 2000);
        
        // Create initial particles
        for (let i = 0; i < 5; i++) {
            setTimeout(createParticle, i * 400);
        }
    }

    // Lazy Loading for Images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Enhanced Animations
    setupEnhancedAnimations() {
        // Add interactive classes to elements
        const interactiveElements = document.querySelectorAll('.btn, .nav-link, .project-card, .skill-item, .contact-item, .social-link');
        interactiveElements.forEach(element => {
            if (!element.classList.contains('interactive-element')) {
                element.classList.add('interactive-element');
            }
        });

        // Enhanced scroll animations - only for elements not already handled
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const enhancedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animate-in') && !this.animatedElements.has(entry.target)) {
                    // Add delay to prevent conflicts with main scroll animations
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                        
                        // Special animations for different elements
                        if (entry.target.classList.contains('section-title')) {
                            entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                        } else if (entry.target.classList.contains('project-card')) {
                            entry.target.style.animation = 'scaleIn 0.6s ease-out';
                        } else if (entry.target.classList.contains('stat-item')) {
                            entry.target.style.animation = 'fadeInLeft 0.7s ease-out';
                        }
                    }, 100);
                }
            });
        }, observerOptions);

        // Store observer for cleanup
        this.observers.push(enhancedObserver);

        // Observe elements for enhanced animations - only those not already observed
        const elementsToAnimate = document.querySelectorAll('.section-title, .testimonial-card');
        elementsToAnimate.forEach(element => {
            if (!element.classList.contains('animate-on-scroll')) {
                enhancedObserver.observe(element);
            }
        });
    }


    // Cleanup method
    cleanup() {
        // Remove event listeners
        this.removeEventListeners();
        
        // Clear all intervals
        this.timers.forEach(timer => clearInterval(timer));
        this.timers = [];
        
        // Clear testimonial interval
        if (this.testimonialInterval) {
            clearInterval(this.testimonialInterval);
            this.testimonialInterval = null;
        }
        
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        
        // Reset state
        this.animatedElements.clear();
        this.typingElements.clear();
        this.isInitialized = false;
        
        // Reset handler references
        this.themeToggleHandler = null;
        this.languageToggleHandler = null;
        this.hamburgerHandler = null;
        this.navLinkHandlers = [];
        this.documentClickHandler = null;
        this.resizeHandler = null;
        this.scrollHandler = null;
    }

    // Performance Optimization
    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the portfolio website when DOM is loaded
let portfolioInstance = null;
let isInitializing = false;

document.addEventListener('DOMContentLoaded', () => {
    if (isInitializing) return;
    isInitializing = true;
    
    // Clean up existing instance if any
    if (portfolioInstance) {
        portfolioInstance.cleanup();
        portfolioInstance = null;
    }
    
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
        portfolioInstance = new PortfolioWebsite();
        isInitializing = false;
    }, 100);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (portfolioInstance) {
        portfolioInstance.cleanup();
        portfolioInstance = null;
    }
});

// Prevent multiple initializations
window.addEventListener('load', () => {
    if (!portfolioInstance && !isInitializing) {
        portfolioInstance = new PortfolioWebsite();
    }
});

// Additional utility functions
const utils = {
    // Smooth reveal animation for elements
    revealOnScroll: () => {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    },

    // Preload images for better performance
    preloadImages: (imageUrls) => {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    },

    // Format date for different locales
    formatDate: (date, locale = 'en-US') => {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },

    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    }
};

// Note: Scroll animations are now handled by the PortfolioWebsite class

// Preload critical images
utils.preloadImages([
    'Pictures/Me.png'
]);

// Add loading animation
window.addEventListener('load', () => {
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
        document.body.classList.add('loaded');
        
        // Remove loading screen if exists
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                }
            }, 500);
        }
    }, 100);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioWebsite, utils };
}
