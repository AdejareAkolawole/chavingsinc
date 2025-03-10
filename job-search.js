document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    mobileToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Pagination functionality
    const pageItems = document.querySelectorAll('.pagination-item');
    pageItems.forEach(item => {
        item.addEventListener('click', function () {
            if (!this.querySelector('i')) {
                pageItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Budget slider sync with text inputs
    const budgetSlider = document.getElementById('budgetSlider');
    const minBudget = document.getElementById('minBudget');
    const maxBudget = document.getElementById('maxBudget');
    
    // Update text inputs when slider changes
    budgetSlider.addEventListener('input', function() {
        maxBudget.value = this.value;
    });
    
    // Update slider when max budget changes
    maxBudget.addEventListener('input', function() {
        budgetSlider.value = this.value;
    });

    // Job post form validation
    const jobPostForm = document.getElementById('jobPostForm');
    if (jobPostForm) {
        jobPostForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Basic validation
            const title = document.getElementById('jobTitle').value;
            const category = document.getElementById('jobCategory').value;
            const budget = document.getElementById('jobBudget').value;
            const description = document.getElementById('jobDescription').value;
            
            if (!title || !category || !budget || !description) {
                alert('Please fill all required fields');
                return;
            }
            
            // Form submission would go here
            alert('Job posted successfully!');
            this.reset();
        });
    }

    // Save draft functionality
    const saveDraftBtn = document.querySelector('button.btn-outline');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function() {
            const formData = {
                title: document.getElementById('jobTitle').value,
                category: document.getElementById('jobCategory').value,
                budgetType: document.getElementById('budgetType').value,
                budget: document.getElementById('jobBudget').value,
                description: document.getElementById('jobDescription').value
            };
            
            // Save to localStorage
            localStorage.setItem('jobDraft', JSON.stringify(formData));
            alert('Draft saved successfully!');
        });
        
        // Load draft if exists
        const savedDraft = localStorage.getItem('jobDraft');
        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            document.getElementById('jobTitle').value = draft.title || '';
            document.getElementById('jobCategory').value = draft.category || '';
            document.getElementById('budgetType').value = draft.budgetType || 'fixed';
            document.getElementById('jobBudget').value = draft.budget || '';
            document.getElementById('jobDescription').value = draft.description || '';
        }
    }
    
    // Filter functionality
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('remoteLocation').addEventListener('change', applyFilters);
    document.getElementById('onsiteLocation').addEventListener('change', applyFilters);
    document.getElementById('hybridLocation').addEventListener('change', applyFilters);
    document.getElementById('budgetSlider').addEventListener('input', applyFilters);
    document.getElementById('minBudget').addEventListener('input', applyFilters);
    document.getElementById('maxBudget').addEventListener('input', applyFilters);
    document.getElementById('sortBy').addEventListener('change', applyFilters);
});

// Tab switching function
function switchTab(tabId) {
    document.querySelectorAll('#postJobTab, #searchJobsTab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.getElementById(tabId === 'postJobTab' ? 'postTabToggle' : 'searchTabToggle').classList.add('active');
}

// Clear all filters function
function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('remoteLocation').checked = true;
    document.getElementById('onsiteLocation').checked = false;
    document.getElementById('hybridLocation').checked = false;
    document.getElementById('minBudget').value = '';
    document.getElementById('maxBudget').value = '';
    document.getElementById('budgetSlider').value = 5000;
    
    // After clearing, apply filters to update the UI
    applyFilters();
}

// Filter application function
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const remote = document.getElementById('remoteLocation').checked;
    const onsite = document.getElementById('onsiteLocation').checked;
    const hybrid = document.getElementById('hybridLocation').checked;
    const minBudget = document.getElementById('minBudget').value || 0;
    const maxBudget = document.getElementById('maxBudget').value || 10000;
    const sortOrder = document.getElementById('sortBy').value;
    
    // Get all job cards
    const jobCards = document.querySelectorAll('.job-card');
    let visibleCount = 0;
    
    // Simple filter logic for demonstration
    jobCards.forEach(card => {
        const cardCategory = card.querySelector('.job-category').textContent.toLowerCase();
        const cardLocation = card.querySelector('.job-location').textContent.toLowerCase();
        
        // Parse budget from the card (simplified example)
        let cardBudget = card.querySelector('.job-budget').textContent;
        cardBudget = parseInt(cardBudget.replace(/[^0-9]/g, ''));
        
        // Check if card passes all filters
        const categoryMatch = !category || cardCategory.includes(category.toLowerCase());
        const locationMatch = 
            (remote && cardLocation.includes('remote')) || 
            (onsite && cardLocation.includes('on-site')) || 
            (hybrid && cardLocation.includes('hybrid')) ||
            (!remote && !onsite && !hybrid); // If none selected, show all
        const budgetMatch = cardBudget >= minBudget && cardBudget <= maxBudget;
        
        // Show or hide based on filter criteria
        if (categoryMatch && locationMatch && budgetMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update results count
    document.querySelector('.results-count span').textContent = visibleCount;
    
    // Sorting would be more complex in a real implementation,
    // This is just a placeholder for demonstration
    if (sortOrder === 'budget-high' || sortOrder === 'budget-low') {
        alert('Sorting functionality would be implemented here');
    }
}