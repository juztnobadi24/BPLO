// Business Website Main JavaScript
// Interactive features and animations

class BusinessWebsite {
    constructor() {
        this.currentStep = 1;
        this.formData = {};
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initTypewriter();
        this.initServiceCards();
        this.initRegistrationForm();
        this.initCounters();
        this.initCarousels();
        this.initParticleBackground();
        this.initPricingCalculator();
    }

    // Scroll-triggered animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Typewriter effect for hero text
    initTypewriter() {
        if (typeof Typed !== 'undefined' && document.getElementById('hero-text')) {
            new Typed('#hero-text', {
                strings: [
                    'New Business Establishment',
                    'Renewal of Business Permit',
                    'Motorized Tricycle Operators Permit',
                    'Certification'
                ],
                typeSpeed: 80,
                backSpeed: 50,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    // Service card interactions
    initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: card,
                        scale: 1.05,
                        rotateY: 5,
                        rotateX: 5,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: card,
                        scale: 1,
                        rotateY: 0,
                        rotateX: 0,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            });

            // Selection for registration
            card.addEventListener('click', () => {
                card.classList.toggle('selected');
                this.updateServiceSelection();
            });
        });
    }

    // Multi-step registration form
    initRegistrationForm() {
        const nextButtons = document.querySelectorAll('.next-step');
        const prevButtons = document.querySelectorAll('.prev-step');
        const submitButton = document.querySelector('.submit-registration');

        nextButtons.forEach(button => {
            button.addEventListener('click', () => this.nextStep());
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', () => this.prevStep());
        });

        if (submitButton) {
            submitButton.addEventListener('click', () => this.submitForm());
        }

        // Form validation
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.saveFormData());
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.updateFormStep();
        }
    }

    prevStep() {
        this.currentStep--;
        this.updateFormStep();
    }

    updateFormStep() {
        const steps = document.querySelectorAll('.form-step');
        const progressBar = document.querySelector('.progress-bar');
        
        steps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });

        if (progressBar) {
            const progress = (this.currentStep / steps.length) * 100;
            if (typeof anime !== 'undefined') {
                anime({
                    targets: progressBar,
                    width: `${progress}%`,
                    duration: 500,
                    easing: 'easeOutCubic'
                });
            }
        }
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step:nth-child(${this.currentStep})`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = value.length > 0;
        
        field.classList.toggle('invalid', !isValid);
        field.classList.toggle('valid', isValid);
        
        return isValid;
    }

    saveFormData() {
        const form = document.querySelector('.registration-form');
        const formData = new FormData(form);
        
        for (let [key, value] of formData.entries()) {
            this.formData[key] = value;
        }
        
        // Store in localStorage for persistence
        localStorage.setItem('registrationData', JSON.stringify(this.formData));
    }

    updateServiceSelection() {
        const selectedServices = document.querySelectorAll('.service-card.selected');
        const serviceInput = document.querySelector('#selected-services');
        
        if (serviceInput) {
            const services = Array.from(selectedServices).map(card => 
                card.querySelector('h3').textContent
            );
            serviceInput.value = services.join(', ');
        }
    }

    submitForm() {
        if (this.validateCurrentStep()) {
            // Show success animation
            const successModal = document.createElement('div');
            successModal.className = 'success-modal';
            successModal.innerHTML = `
                <div class="success-content">
                    <div class="success-icon">✓</div>
                    <h2>Registration Successful!</h2>
                    <p>Thank you for registering. We'll contact you within 24 hours.</p>
                    <button onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            `;
            
            document.body.appendChild(successModal);
            
            if (typeof anime !== 'undefined') {
                anime({
                    targets: successModal,
                    opacity: [0, 1],
                    scale: [0.8, 1],
                    duration: 500,
                    easing: 'easeOutCubic'
                });
            }
            
            // Clear form data
            localStorage.removeItem('registrationData');
        }
    }

    // Animated counters for statistics
    initCounters() {
        const counters = document.querySelectorAll('.counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: { value: 0 },
                value: target,
                duration: duration,
                easing: 'easeOutCubic',
                update: function(anim) {
                    element.textContent = Math.floor(anim.animatables[0].target.value);
                }
            });
        } else {
            element.textContent = target;
        }
    }

    // Initialize carousels
    initCarousels() {
        if (typeof Splide !== 'undefined') {
            // Testimonials carousel
            const testimonialSlider = document.querySelector('.testimonial-slider');
            if (testimonialSlider) {
                new Splide(testimonialSlider, {
                    type: 'loop',
                    autoplay: true,
                    interval: 5000,
                    pauseOnHover: true,
                    arrows: false,
                    pagination: true,
                    gap: '2rem'
                }).mount();
            }

            // Services carousel
            const serviceSlider = document.querySelector('.service-slider');
            if (serviceSlider) {
                new Splide(serviceSlider, {
                    type: 'loop',
                    autoplay: true,
                    interval: 4000,
                    perPage: 3,
                    perMove: 1,
                    gap: '2rem',
                    breakpoints: {
                        768: { perPage: 1 },
                        1024: { perPage: 2 }
                    }
                }).mount();
            }
        }
    }

    // Particle background with p5.js
    initParticleBackground() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        // Simple particle system
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Pricing calculator
    initPricingCalculator() {
        const sliders = document.querySelectorAll('.pricing-slider');
        const totalElement = document.querySelector('.pricing-total');

        if (sliders.length > 0 && totalElement) {
            sliders.forEach(slider => {
                slider.addEventListener('input', () => this.updatePricing());
            });
            
            this.updatePricing();
        }
    }

    updatePricing() {
        const sliders = document.querySelectorAll('.pricing-slider');
        const totalElement = document.querySelector('.pricing-total');
        let total = 0;

        sliders.forEach(slider => {
            const value = parseInt(slider.value);
            const price = parseInt(slider.dataset.price);
            total += value * price;
        });

        if (typeof anime !== 'undefined') {
            anime({
                targets: { value: parseInt(totalElement.textContent.replace(/[^0-9]/g, '')) || 0 },
                value: total,
                duration: 500,
                easing: 'easeOutCubic',
                update: function(anim) {
                    totalElement.textContent = '$' + Math.floor(anim.animatables[0].target.value).toLocaleString();
                }
            });
        } else {
            totalElement.textContent = '$' + total.toLocaleString();
        }
    }

    // Utility functions
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: notification,
                translateX: [300, 0],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutCubic'
            });
            
            setTimeout(() => {
                anime({
                    targets: notification,
                    translateX: 300,
                    opacity: 0,
                    duration: 300,
                    easing: 'easeInCubic',
                    complete: () => notification.remove()
                });
            }, 3000);
        } else {
            setTimeout(() => notification.remove(), 3000);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BusinessWebsite();
});

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
}