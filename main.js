document.addEventListener('DOMContentLoaded', function() {
    // Helper function to create a 3D scene for the logo
    function create3DScene(canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        // Create the 3D logo (torus knot)
        const geometry = new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0x6A0DAD, shininess: 100 });
        const model = new THREE.Mesh(geometry, material);
        scene.add(model);

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        camera.position.z = 3;

        // Resize handler
        const onResize = () => {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', onResize);

        return { scene, camera, renderer, model, onResize };
    }

    // 3D Logo in Header
    const logoCanvas = document.getElementById('logoCanvas');
    const logoFallback = document.querySelector('.logo-fallback');
    if (logoCanvas && typeof THREE !== 'undefined') {
        try {
            const { scene, camera, renderer, model, onResize } = create3DScene(logoCanvas);

            const animate = function () {
                requestAnimationFrame(animate);
                model.rotation.x += 0.01;
                model.rotation.y += 0.01;
                renderer.render(scene, camera);
            };
            animate();

            window.addEventListener('resize', onResize);
        } catch (error) {
            console.error('Failed to initialize 3D logo:', error);
            logoCanvas.style.display = 'none';
            if (logoFallback) logoFallback.style.display = 'block';
        }
    } else {
        if (logoCanvas) logoCanvas.style.display = 'none';
        if (logoFallback) logoFallback.style.display = 'block';
    }

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
    const animateElements = document.querySelectorAll('.category-card, .worker-card, .step-card, .cta-heading, .cta-subheading, .cta-buttons');

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
        let cardsToShow = window.innerWidth <= 768 ? 1 : 2;
        let autoSlideInterval;

        const firstClone = testimonialCards[0].cloneNode(true);
        const lastClone = testimonialCards[totalCards - 1].cloneNode(true);
        testimonialsTrack.appendChild(firstClone);
        testimonialsTrack.insertBefore(lastClone, testimonialCards[0]);

        const allCards = document.querySelectorAll('.testimonial-card');
        const cardWidth = allCards[0].offsetWidth + (window.innerWidth <= 768 ? 16 : 32);

        testimonialsTrack.style.transform = `translateX(-${cardWidth * (cardsToShow + 1)}px)`;

        const updateSlider = (direction) => {
            if (direction === 'next') {
                currentIndex++;
            } else if (direction === 'prev') {
                currentIndex--;
            }

            testimonialsTrack.style.transition = 'transform 0.5s ease-in-out';
            testimonialsTrack.style.transform = `translateX(-${cardWidth * (currentIndex + 1)}px)`;

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

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                updateSlider('next');
            }, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

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

        testimonialsSlider.addEventListener('mouseenter', stopAutoSlide);
        testimonialsSlider.addEventListener('mouseleave', startAutoSlide);

        startAutoSlide();

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

    // Parallax effect for CTA section
    const ctaSection = document.querySelector('.cta-section');
    const ctaVideo = document.querySelector('.cta-video');

    if (ctaSection && ctaVideo) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            const sectionTop = ctaSection.offsetTop;
            const sectionHeight = ctaSection.offsetHeight;
            const windowHeight = window.innerHeight;

            if (scrollPosition + windowHeight > sectionTop && scrollPosition < sectionTop + sectionHeight) {
                const offset = (scrollPosition - sectionTop) * 0.3; // Adjust parallax speed
                ctaVideo.style.transform = `translateY(${offset}px)`;
            }
        });
    }
});