document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            // Toggle between hamburger and close icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Sticky header on scroll
    const header = document.querySelector('.main-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('sticky');
            
            // Hide header on scroll down, show on scroll up
            if (scrollTop > lastScrollTop) {
                header.classList.add('hide');
            } else {
                header.classList.remove('hide');
            }
        } else {
            header.classList.remove('sticky');
            header.classList.remove('hide');
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Form validation for search fields
    const searchForm = document.querySelector('.search-box');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const inputs = this.querySelectorAll('input');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.value.trim() === '') {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Add error message if not already present
                    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                        const errorMessage = document.createElement('span');
                        errorMessage.classList.add('error-message');
                        errorMessage.textContent = 'This field is required';
                        input.parentNode.appendChild(errorMessage);
                    }
                } else {
                    input.classList.remove('error');
                    
                    // Remove error message if exists
                    if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                        input.parentNode.removeChild(input.nextElementSibling);
                    }
                }
            });
            
            if (isValid) {
                // Simulate form submission
                alert('Search submitted! This would navigate to search results in a real application.');
                // this.submit();
            }
        });
        
        // Clear error styling on input focus
        searchForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.remove('error');
                
                // Remove error message if exists
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                    this.parentNode.removeChild(this.nextElementSibling);
                }
            });
        });
    }

    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.category-card, .worker-card, .job-card, .step-card, .trust-feature');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animateElements.forEach(element => {
            element.classList.add('animate');
        });
    }
});