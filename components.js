document.addEventListener('DOMContentLoaded', function() {
    // Search tabs functionality
    initSearchTabs();
    
    // Category cards hover effects
    initCategoryCards();
    
    // Worker cards interaction
    initWorkerCards();
    
    // Job cards interaction
    initJobCards();
    
    // Testimonials carousel if exists
    initTestimonialsCarousel();
});

/**
 * Initialize search tabs functionality
 */
function initSearchTabs() {
    const searchTabs = document.querySelectorAll('.search-tabs .tab');
    
    if (searchTabs.length > 0) {
        searchTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                searchTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Change search placeholder based on tab
                const searchInput = document.querySelector('.search-group input');
                if (searchInput) {
                    if (this.dataset.tab === 'find-worker') {
                        searchInput.placeholder = 'What service do you need?';
                    } else if (this.dataset.tab === 'find-job') {
                        searchInput.placeholder = 'What job are you looking for?';
                    }
                }
                
                // Update search button text
                const searchButton = document.querySelector('.btn-search');
                if (searchButton) {
                    searchButton.textContent = this.dataset.tab === 'find-worker' ? 'Find Workers' : 'Find Jobs';
                }
            });
        });
    }
}

/**
 * Initialize category cards interactions
 */
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            // Randomize the slight animation delay
            card.style.transitionDelay = (Math.random() * 0.3) + 's';
            
            // Add click handler
            card.addEventListener('click', function() {
                const categoryName = this.querySelector('h3').textContent;
                // In a real application, this would navigate to a category page
                // For demo, just show alert
                // window.location.href = 'category.html?name=' + encodeURIComponent(categoryName);
                alert(`You selected the ${categoryName} category!`);
            });
        });
    }
}

/**
 * Initialize worker cards interactions
 */
function initWorkerCards() {
    const workerCards = document.querySelectorAll('.worker-card');
    
    if (workerCards.length > 0) {
        workerCards.forEach(card => {
            // Add a slight hover animation
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            // For view profile buttons
            const viewProfileBtn = card.querySelector('.btn-outline');
            if (viewProfileBtn) {
                viewProfileBtn.addEventListener('mouseenter', function(e) {
                    e.stopPropagation(); // Prevent triggering the card's mouseenter
                });
                
                viewProfileBtn.addEventListener('click', function(e) {
                    const workerName = card.querySelector('h3').textContent;
                    console.log(`Viewing profile of ${workerName}`);
                });
            }
        });
    }
}

/**
 * Initialize job cards interactions
 */
function initJobCards() {
    const jobCards = document.querySelectorAll('.job-card');
    
    if (jobCards.length > 0) {
        jobCards.forEach(card => {
            // Show full description on hover
            const description = card.querySelector('.job-description');
            
            if (description) {
                card.addEventListener('mouseenter', function() {
                    description.style.webkitLineClamp = 'unset';
                    description.style.maxHeight = '200px';
                    description.style.overflow = 'auto';
                });
                
                card.addEventListener('mouseleave', function() {
                    description.style.webkitLineClamp = '3';
                    description.style.maxHeight = '';
                    description.style.overflow = 'hidden';
                });
            }
            
            // For view details buttons
            const viewDetailsBtn = card.querySelector('.btn-outline');
            if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', function(e) {
                    const jobTitle = card.querySelector('.job-title').textContent;
                    console.log(`Viewing details of job: ${jobTitle}`);
                });
            }
        });
    }
}

/**
 * Initialize testimonials carousel if it exists
 */
function initTestimonialsCarousel() {
    const testimonialsContainer = document.querySelector('.testimonials-container');
    
    if (testimonialsContainer) {
        const testimonials = testimonialsContainer.querySelectorAll('.testimonial');
        const nextButton = testimonialsContainer.querySelector('.carousel-next');
        const prevButton = testimonialsContainer.querySelector('.carousel-prev');
        let currentIndex = 0;
        
        // Function to show testimonial at current index
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        }
        
        // Initialize
        if (testimonials.length > 0) {
            showTestimonial(currentIndex);
            
            // Next button handler
            if (nextButton) {
                nextButton.addEventListener('click', function() {
                    currentIndex = (currentIndex + 1) % testimonials.length;
                    showTestimonial(currentIndex);
                });
            }
            
            // Previous button handler
            if (prevButton) {
                prevButton.addEventListener('click', function() {
                    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                    showTestimonial(currentIndex);
                });
            }
            
            // Auto-rotate every 5 seconds
            setInterval(function() {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            }, 5000);
        }
    }
}

/**
 * Lazy load images
 */
function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
        });
    }
}

// Call lazy load function
lazyLoadImages();

/**
 * Rating component functionality
 */
function initRatings() {
    const ratingContainers = document.querySelectorAll('.rating-input');
    
    if (ratingContainers.length > 0) {
        ratingContainers.forEach(container => {
            const stars = container.querySelectorAll('.star');
            const ratingInput = container.querySelector('input[type="hidden"]');
            
            stars.forEach((star, index) => {
                // Hover effect
                star.addEventListener('mouseenter', function() {
                    // Fill this star and all previous stars
                    for (let i = 0; i <= index; i++) {
                        stars[i].classList.add('active');
                    }
                    
                    // Remove fill from all following stars
                    for (let i = index + 1; i < stars.length; i++) {
                        stars[i].classList.remove('active');
                    }
                });
                
                // Click to set rating
                star.addEventListener('click', function() {
                    const rating = index + 1;
                    if (ratingInput) {
                        ratingInput.value = rating;
                    }
                    
                    // Set the persistentRating data attribute for hover out
                    container.dataset.rating = rating;
                    
                    // Trigger change event
                    const event = new Event('change');
                    container.dispatchEvent(event);
                });
            });
            
            // Handle mouse leaving the rating container
            container.addEventListener('mouseleave', function() {
                const persistentRating = parseInt(container.dataset.rating) || 0;
                
                stars.forEach((star, index) => {
                    if (index < persistentRating) {
                        star.classList.add('active');
                    } else {
                        star.classList.remove('active');
                    }
                });
            });
        });
    }
}

// Initialize rating components if they exist
initRatings();