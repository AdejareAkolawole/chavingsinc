document.addEventListener('DOMContentLoaded', function() {
    // Helper function to create a 3D scene for the logo
    function create3DScene(canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);

        const geometry = new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16);
        const material = new THREE.MeshPhongMaterial({ color: 0x6A0DAD, shininess: 100 });
        const model = new THREE.Mesh(geometry, material);
        scene.add(model);

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        camera.position.z = 3;

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
    let logoResizeHandler;
    if (logoCanvas && typeof THREE !== 'undefined') {
        try {
            const { scene, camera, renderer, model, onResize } = create3DScene(logoCanvas);
            logoResizeHandler = onResize;

            const animate = function() {
                requestAnimationFrame(animate);
                model.rotation.x += 0.01;
                model.rotation.y += 0.01;
                renderer.render(scene, camera);
            };
            animate();
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
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Sticky header and back-to-top
    const header = document.querySelector('.main-header');
    const backToTop = document.querySelector('.back-to-top');
    let lastScrollTop = 0;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (header) {
            if (scrollTop > 50) {
                header.classList.add('sticky');
                if (scrollTop > lastScrollTop) {
                    header.classList.add('hide');
                } else {
                    header.classList.remove('hide');
                }
            } else {
                header.classList.remove('sticky', 'hide');
            }
        }
        if (backToTop) {
            if (scrollTop > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    window.addEventListener('scroll', handleScroll);

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    // Search form validation and live suggestions
    const searchForm = document.querySelector('.search-box');
    const searchInput = searchForm?.querySelector('input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    const suggestionsList = ['Plumbing', 'Cleaning', 'Tech Services', 'Delivery', 'Home Repairs'];

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (searchInput.value.trim() === '') {
                searchInput.classList.add('error');
                if (!searchInput.nextElementSibling?.classList.contains('error-message')) {
                    const errorMessage = document.createElement('span');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = 'Please enter a search term';
                    searchInput.parentNode.insertBefore(errorMessage, searchSuggestions);
                }
            } else {
                searchInput.classList.remove('error');
                if (searchInput.nextElementSibling?.classList.contains('error-message')) {
                    searchInput.parentNode.removeChild(searchInput.nextElementSibling);
                }
                console.log('Search submitted:', searchInput.value);
            }
        });

        searchInput.addEventListener('focus', function() {
            this.classList.remove('error');
            if (this.nextElementSibling?.classList.contains('error-message')) {
                this.parentNode.removeChild(this.nextElementSibling);
            }
        });

        searchInput.addEventListener('input', function() {
            const value = this.value.toLowerCase().trim();
            searchSuggestions.innerHTML = '';
            if (value) {
                const matches = suggestionsList.filter(s => s.toLowerCase().includes(value));
                matches.forEach(match => {
                    const suggestion = document.createElement('div');
                    suggestion.textContent = match;
                    suggestion.addEventListener('click', () => {
                        searchInput.value = match;
                        searchSuggestions.classList.remove('active');
                        searchForm.dispatchEvent(new Event('submit'));
                    });
                    searchSuggestions.appendChild(suggestion);
                });
                searchSuggestions.classList.toggle('active', matches.length > 0);
            } else {
                searchSuggestions.classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchForm.contains(e.target)) {
                searchSuggestions.classList.remove('active');
            }
        });
    }

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.category-card, .worker-card, .step-card, .benefit-card, .cta-heading, .cta-subheading, .cta-buttons');
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

    // Dynamic Tagline Rotation
    const taglines = [
        "Hire Top Talent in Lagos",
        "Find Expert Plumbers Today",
        "Get Reliable Cleaners Now",
        "Tech Services at Your Fingertips"
    ];
    let currentTaglineIndex = 0;
    const taglineElement = document.querySelector('.dynamic-tagline');

    if (taglineElement) {
        function rotateTagline() {
            taglineElement.style.opacity = 0;
            setTimeout(() => {
                taglineElement.textContent = taglines[currentTaglineIndex];
                taglineElement.style.opacity = 1;
                currentTaglineIndex = (currentTaglineIndex + 1) % taglines.length;
            }, 500);
        }
        setInterval(rotateTagline, 3000);
        rotateTagline();
    }

    // Testimonials slider
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    const testimonialsTrack = document.querySelector('.testimonials-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const arrowLeft = document.querySelector('.slider-arrow-left');
    const arrowRight = document.querySelector('.slider-arrow-right');

    if (testimonialsSlider && testimonialsTrack && testimonialCards.length > 0) {
        let currentIndex = 0;
        let cardsToShow = window.innerWidth <= 768 ? 1 : 2;
        let autoSlideInterval;

        function getCardWidth() {
            return testimonialCards[0].offsetWidth + (window.innerWidth <= 768 ? 16 : 32);
        }

        const updateSlider = () => {
            const cardWidth = getCardWidth();
            testimonialsTrack.style.transition = 'transform 0.5s ease-in-out';
            testimonialsTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        };

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                const totalCards = testimonialCards.length;
                if (currentIndex < totalCards - cardsToShow) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
            }, 5000);
        };

        const stopAutoSlide = () => {
            clearInterval(autoSlideInterval);
        };

        arrowRight.addEventListener('click', () => {
            stopAutoSlide();
            const totalCards = testimonialCards.length;
            if (currentIndex < totalCards - cardsToShow) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
            startAutoSlide();
        });

        arrowLeft.addEventListener('click', () => {
            stopAutoSlide();
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = testimonialCards.length - cardsToShow;
            }
            updateSlider();
            startAutoSlide();
        });

        testimonialsSlider.addEventListener('mouseenter', stopAutoSlide);
        testimonialsSlider.addEventListener('mouseleave', startAutoSlide);

        window.addEventListener('resize', () => {
            const newCardsToShow = window.innerWidth <= 768 ? 1 : 2;
            if (newCardsToShow !== cardsToShow) {
                cardsToShow = newCardsToShow;
                currentIndex = Math.min(currentIndex, testimonialCards.length - cardsToShow);
                updateSlider();
            }
        });

        startAutoSlide();
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
                const offset = (scrollPosition - sectionTop) * 0.3;
                ctaVideo.style.transform = `translateY(${offset}px)`;
            }
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const darkModeIcon = darkModeToggle?.querySelector('i');
    if (darkModeToggle && darkModeIcon) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            darkModeIcon.classList.toggle('fa-moon', savedTheme === 'light');
            darkModeIcon.classList.toggle('fa-sun', savedTheme === 'dark');
        }

        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                darkModeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                darkModeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Category filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter cards
            categoryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || filter === category) {
                    card.classList.remove('hidden');
                    // Reset animation
                    card.classList.remove('animate');
                    void card.offsetWidth; // Trigger reflow
                    card.classList.add('animate');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Cleanup event listeners on page unload
    window.addEventListener('unload', () => {
        window.removeEventListener('scroll', handleScroll);
        if (logoResizeHandler) window.removeEventListener('resize', logoResizeHandler);
    });
});