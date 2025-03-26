document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
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

    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 50) {
                header.classList.add('sticky');
                if (scrollTop > lastScrollTop) {
                    header.classList.add('hide');
                } else {
                    header.classList.remove('hide');
                }
            } else {
                header.classList.remove('sticky');
                header.classList.remove('hide');
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

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

                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Form validation for search fields
    const searchForm = document.querySelector('.search-box');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = this.querySelector('input');
            if (input.value.trim() === '') {
                input.classList.add('error');
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('span');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = 'Please enter a search term';
                    input.parentNode.appendChild(errorMessage);
                }
            } else {
                input.classList.remove('error');
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                    input.parentNode.removeChild(input.nextElementSibling);
                }
                alert('Search submitted! Redirecting to results in a real app.');
            }
        });

        searchForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.remove('error');
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                    this.parentNode.removeChild(this.nextElementSibling);
                }
            });
        });
    }

    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.category-card, .worker-card, .step-card');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animateElements.forEach(element => observer.observe(element));
    } else {
        animateElements.forEach(element => element.classList.add('animate'));
    }

    // Testimonials slider
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const arrowLeft = document.querySelector('.slider-arrow-left');
    const arrowRight = document.querySelector('.slider-arrow-right');

    if (testimonialsSlider && testimonialsTrack && testimonialCards.length > 0) {
        let currentIndex = 0;
        const totalCards = testimonialCards.length;
        let cardsToShow = window.innerWidth <= 768 ? 1 : 2; // 1 card on mobile, 2 on desktop
        let autoSlideInterval;

        // Clone first and last cards for infinite loop effect
        const firstClone = testimonialCards[0].cloneNode(true);
        const lastClone = testimonialCards[totalCards - 1].cloneNode(true);
        testimonialsTrack.appendChild(firstClone);
        testimonialsTrack.insertBefore(lastClone, testimonialCards[0]);

        const allCards = document.querySelectorAll('.testimonial-card'); // Including clones
        const cardWidth = allCards[0].offsetWidth + (window.innerWidth <= 768 ? 16 : 32); // Including margin

        // Set initial position
        testimonialsTrack.style.transform = `translateX(-${cardWidth * (cardsToShow + 1)}px)`;

        const updateSlider = (direction) => {
            if (direction === 'next') {
                currentIndex++;
            } else if (direction === 'prev') {
                currentIndex--;
            }

            testimonialsTrack.style.transition = 'transform 0.5s ease-in-out';
            testimonialsTrack.style.transform = `translateX(-${cardWidth * (currentIndex + 1)}px)`;

            // Handle infinite loop
            if (currentIndex === totalCards) {
                setTimeout(() => {
                    testimonialsTrack.style.transition = 'none';
                    currentIndex = 0;
                    testimonialsTrack.style.transform = `translateX(-${cardWidth * (currentIndex + 1)}px)`;
                }, 500);
            } else if (currentIndex === -1) {
                setTimeout(() => {
                    testimonialsTrack.style.transition = 'none';
                    currentIndex = totalCards - 1;
                    testimonialsTrack.style.transform = `translateX(-${cardWidth * (currentIndex + 1)}px)`;
                }, 500);
            }
        };

        // Auto-slide every 5 seconds
        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                updateSlider('next');
            }, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        // Manual navigation
        arrowRight.addEventListener('click', () => {
            stopAutoSlide();
            updateSlider('next');
            startAutoSlide();
        });

        arrowLeft.addEventListener('click', () => {
            stopAutoSlide();
            updateSlider('prev');
            startAutoSlide();
        });

        // Pause on hover
        testimonialsSlider.addEventListener('mouseenter', stopAutoSlide);
        testimonialsSlider.addEventListener('mouseleave', startAutoSlide);

        // Start auto-slide on load
        startAutoSlide();

        // Update cardsToShow on window resize
        window.addEventListener('resize', () => {
            const newCardsToShow = window.innerWidth <= 768 ? 1 : 2;
            if (newCardsToShow !== cardsToShow) {
                cardsToShow = newCardsToShow;
                const newCardWidth = allCards[0].offsetWidth + (window.innerWidth <= 768 ? 16 : 32);
                testimonialsTrack.style.transition = 'none';
                testimonialsTrack.style.transform = `translateX(-${newCardWidth * (currentIndex + 1)}px)`;
            }
        });
    }
});