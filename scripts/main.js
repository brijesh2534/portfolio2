// Main JavaScript file for portfolio functionality

class Portfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initTheme();
        this.setupMobileMenu();
        this.setupContactForm();
        this.setupProjectModals();
        this.setupLazyLoading();
    }
    
    init() {
        // Add initial animations
        this.addScrollClasses();
        
        // Initialize AOS (Animate On Scroll) alternative
        this.initScrollAnimations();
        
        // Setup typing effect for hero section
        this.setupTypingEffect();
    }
    
    setupEventListeners() {
        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }
    
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
        
        themeToggle?.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            this.updateThemeIcon(newTheme);
            
            // Add transition effect
            document.body.classList.add('theme-transition');
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        });
    }
    
    updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle?.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
    
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        let errorMessage = '';
        
        if (!value) {
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        } else if (fieldName === 'email' && !this.isValidEmail(value)) {
            errorMessage = 'Please enter a valid email address';
        } else if (fieldName === 'message' && value.length < 10) {
            errorMessage = 'Message must be at least 10 characters long';
        }
        
        if (errorMessage && errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            field.classList.add('error');
        } else if (errorElement) {
            errorElement.classList.remove('show');
            field.classList.remove('error');
        }
        
        return !errorMessage;
    }
    
    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
            field.classList.remove('error');
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showNotification('Message sent successfully!', 'success');
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    setupProjectModals() {
        const projectCards = document.querySelectorAll('.project-card');
        const modal = document.getElementById('project-modal');
        const modalClose = document.getElementById('modal-close');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal) return;
        
        const projectDetails = {
            'socket-chat': {
                title: 'Real-Time Chat Application',
                description: 'A comprehensive chat platform built with Socket.IO, featuring real-time messaging, file sharing, user authentication, and room management. The application supports multiple concurrent users and provides a seamless communication experience.',
                challenges: 'Implemented efficient message broadcasting, handled connection drops gracefully, and optimized for high concurrent users.',
                tech: ['Socket.IO', 'Node.js', 'React', 'MongoDB', 'JWT Authentication'],
                features: ['Real-time messaging', 'File sharing', 'User presence indicators', 'Message history', 'Room management'],
                liveUrl: 'https://demo-chat.example.com',
                githubUrl: 'https://github.com/brijesh-tankariya/socket-chat'
            },
            'ecommerce': {
                title: 'E-commerce Platform',
                description: 'A full-featured online store with product catalog, shopping cart, payment integration, and admin dashboard. Built with Laravel and featuring modern UI/UX design.',
                challenges: 'Integrated multiple payment gateways, implemented inventory management, and ensured secure transaction processing.',
                tech: ['Laravel', 'PHP', 'MySQL', 'Stripe API', 'Vue.js'],
                features: ['Product catalog', 'Shopping cart', 'Payment processing', 'Order management', 'Admin dashboard'],
                liveUrl: 'https://demo-store.example.com',
                githubUrl: 'https://github.com/brijesh-tankariya/ecommerce'
            }
            // Add more project details as needed
        };
        
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                const project = projectDetails[projectId];
                
                if (project) {
                    this.showProjectModal(project, modal, modalBody);
                }
            });
        });
        
        modalClose?.addEventListener('click', () => {
            this.hideModal(modal);
        });
        
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal(modal);
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                this.hideModal(modal);
            }
        });
    }
    
    showProjectModal(project, modal, modalBody) {
        const modalContent = `
            <h2>${project.title}</h2>
            <p class="project-modal-description">${project.description}</p>
            
            <h3>Key Features</h3>
            <ul class="feature-list">
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            
            <h3>Technologies Used</h3>
            <div class="tech-stack">
                ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            
            <h3>Challenges & Solutions</h3>
            <p>${project.challenges}</p>
            
            <div class="project-links">
                <a href="${project.liveUrl}" class="btn btn-primary" target="_blank" rel="noopener">View Live Demo</a>
                <a href="${project.githubUrl}" class="btn btn-outline" target="_blank" rel="noopener">View on GitHub</a>
            </div>
        `;
        
        modalBody.innerHTML = modalContent;
        modal.style.display = 'block';
        modal.classList.add('show');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    hideModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src || img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    addScrollClasses() {
        const elements = document.querySelectorAll('.section-title, .section-subtitle, .project-card, .timeline-item, .contact-item');
        elements.forEach(element => {
            element.classList.add('animate-on-scroll');
        });
    }
    
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }
    
    setupTypingEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;
        
        const text = subtitle.textContent;
        subtitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        // Start typing effect after initial animations
        setTimeout(typeWriter, 1000);
    }
    
    handleScroll() {
        // Add any scroll-based functionality here
        this.updateScrollProgress();
    }
    
    updateScrollProgress() {
        const scrollProgress = document.querySelector('.scroll-indicator');
        if (!scrollProgress) return;
        
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    }
    
    handleResize() {
        // Handle responsive functionality
    }
    
    handleKeyboardNavigation(e) {
        // Handle keyboard navigation for accessibility
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Utility functions
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
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or reduce activity
    } else {
        // Resume normal activity
    }
});

// Add styles for notifications
const notificationStyles = `
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    color: white;
    font-weight: 500;
    z-index: 2000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    background: linear-gradient(135deg, #4CAF50, #45a049);
}

.notification-error {
    background: linear-gradient(135deg, #f44336, #da190b);
}

.notification-info {
    background: linear-gradient(135deg, #2196F3, #0b7dda);
}

.theme-transition * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
}

.keyboard-navigation *:focus {
    outline: 2px solid var(--primary-color) !important;
    outline-offset: 2px;
}

/* Modal Styles */
.project-modal-description {
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    color: var(--text-secondary);
}

.feature-list {
    list-style: none;
    padding: 0;
    margin-bottom: 2rem;
}

.feature-list li {
    padding: 0.5rem 0;
    padding-left: 1.5rem;
    position: relative;
    color: var(--text-secondary);
}

.feature-list li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-weight: bold;
}

.tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

.project-links {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .project-links {
        flex-direction: column;
    }
    
    .notification {
        top: 10px;
        right: 10px;
        left: 10px;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
}
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);