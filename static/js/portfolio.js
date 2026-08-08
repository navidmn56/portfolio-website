/* ============================================
   PORTFOLIO JAVASCRIPT - Optimized
   Fast & Smooth Performance
   ============================================ */

/**
 * Tab Switching System
 * Switches between Education and Experience tabs with instant response
 */
function switchTab(tab) {
    const eduContent = document.getElementById('education-content');
    const expContent = document.getElementById('experience-content');
    const eduTab = document.getElementById('edu-tab');
    const expTab = document.getElementById('exp-tab');
    const tabIcon = document.getElementById('tab-icon');
    const tabTitle = document.getElementById('tab-title');

    // Validate elements exist
    if (!eduContent || !expContent || !eduTab || !expTab) {
        return;
    }

    // Handle Education tab
    if (tab === 'education') {
        eduContent.classList.add('active');
        expContent.classList.remove('active');
        eduTab.classList.add('active');
        expTab.classList.remove('active');
        
        // Update icon
        if (tabIcon) {
            tabIcon.className = 'fas fa-graduation-cap';
        }
        
        // Update title
        if (tabTitle) {
            tabTitle.textContent = 'Education';
        }
    } 
    // Handle Experience tab
    else {
        expContent.classList.add('active');
        eduContent.classList.remove('active');
        expTab.classList.add('active');
        eduTab.classList.remove('active');
        
        // Update icon
        if (tabIcon) {
            tabIcon.className = 'fas fa-briefcase';
        }
        
        // Update title
        if (tabTitle) {
            tabTitle.textContent = 'Experience';
        }
    }
}

/**
 * Counter Animation for Project Count
 * Creates a smooth counting animation for the project number
 */
function animateProjectCounter() {
    const counter = document.querySelector('.project-count');
    
    // Validate counter exists
    if (!counter) {
        return;
    }

    // Get the current text and extract the number
    const text = counter.textContent.trim();
    const match = text.match(/\d+/);
    
    // If no number found or already animated, skip
    if (!match || counter.dataset.animated === 'true') {
        return;
    }

    // Mark as animated to prevent re-animation
    counter.dataset.animated = 'true';
    
    const targetNumber = parseInt(match[0]);
    const suffix = text.replace(match[0], '');
    
    let currentNumber = 0;
    const steps = 10;
    const increment = Math.ceil(targetNumber / steps);
    const stepTime = 50;

    // Start counting animation
    const timer = setInterval(() => {
        currentNumber += increment;
        
        // Stop when target reached
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        
        // Update counter text
        counter.textContent = `${currentNumber}${suffix}`;
    }, stepTime);
}

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Remove all tooltip elements
    document.querySelectorAll('.tooltip').forEach(function(el) {
        el.remove();
    });

    // Start counter animation after a short delay
    setTimeout(animateProjectCounter, 300);

    // Keyboard shortcuts for tab switching
    document.addEventListener('keydown', function(e) {
        // Ignore if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

        // Check for shortcuts
        switch(e.key.toLowerCase()) {
            case '1':
            case 'e':
                e.preventDefault();
                switchTab('education');
                break;
            case '2':
            case 'x':
                e.preventDefault();
                switchTab('experience');
                break;
        }
    });

    // Smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        });
    });

    // Handle image loading errors - fallback to generated avatar
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const name = e.target.alt || 'User';
            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=00b4d8&color=fff&size=200';
        }
    }, true);

    // Log successful initialization
    console.log('✨ Portfolio loaded successfully');
    console.log('⌨️  Keyboard shortcuts: Press 1/E for Education, 2/X for Experience');
});