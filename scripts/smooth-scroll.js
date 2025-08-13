class SmoothScroll {
    constructor() {
        this.init();
        this.setupScrollIndicator();
        this.setupIntersectionObserver();
    }
    
    init() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scrollToElement(target);
                    this.updateActiveNavLink(anchor.getAttribute('href'));
                }
            });
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateScrollIndicator();
            this.updateActiveNavLinkOnScroll();
        });
    }
    
    scrollToElement(element) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = element.offsetTop - offset;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
    
    setupScrollIndicator() {
        const scrollIndicator = document.getElementById('scroll-indicator');
        if (!scrollIndicator) return;
        
        window.addEventListener('scroll', () => {
            this.updateScrollIndicator();
        });
    }
    
    updateScrollIndicator() {
        const scrollIndicator = document.getElementById('scroll-indicator');
        if (!scrollIndicator) return;
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        scrollIndicator.style.width = scrolled + '%';
    }
    
    updateActiveNavLink(href) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current nav link
        const activeLink = document.querySelector(`.nav-link[href="${href}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    updateActiveNavLinkOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.updateActiveNavLink(`#${sectionId}`);
            }
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Animate skill bars when about section is visible
                    if (entry.target.id === 'about') {
                        this.animateSkillBars();
                    }
                    
                    // Stagger animate project cards
                    if (entry.target.classList.contains('projects-grid')) {
                        this.staggerAnimate(entry.target.children);
                    }
                    
                    // Animate timeline items
                    if (entry.target.classList.contains('timeline')) {
                        this.staggerAnimate(entry.target.children);
                    }
                }
            });
        }, observerOptions);
        
        // Observe sections and elements
        document.querySelectorAll('section, .animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
        
        // Observe specific elements for stagger animation
        document.querySelectorAll('.projects-grid, .timeline').forEach(element => {
            observer.observe(element);
        });
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * 200);
        });
    }
    
    staggerAnimate(elements) {
        Array.from(elements).forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animated');
            }, index * 200);
        });
    }
}

// Parallax effect for hero section
class ParallaxEffect {
    constructor() {
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
    }
    
    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Hero section parallax effect
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const yPos = scrolled * 0.5;
            heroSection.style.transform = `translateY(${yPos}px)`;
        }
    }
}

// Initialize smooth scroll and parallax
document.addEventListener('DOMContentLoaded', () => {
    new SmoothScroll();
    new ParallaxEffect();
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Add scroll-based animations
function addScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', addScrollAnimations);