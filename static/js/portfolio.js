/* ============================================
   PORTFOLIO JAVASCRIPT - Optimized
   Fast & Smooth Performance
   ============================================ */

/**
 * Tab Switching System
 * Switches between Education and Experience tabs with instant response
 */
function switchTab(tab) {
    var eduContent = document.getElementById('education-content');
    var expContent = document.getElementById('experience-content');
    var eduTab = document.getElementById('edu-tab');
    var expTab = document.getElementById('exp-tab');
    var tabIcon = document.getElementById('tab-icon');
    var tabTitle = document.getElementById('tab-title');

    if (!eduContent || !expContent || !eduTab || !expTab) {
        return;
    }

    if (tab === 'education') {
        eduContent.classList.add('active');
        expContent.classList.remove('active');
        eduTab.classList.add('active');
        expTab.classList.remove('active');
        
        if (tabIcon) {
            tabIcon.className = 'fas fa-graduation-cap';
        }
        
        if (tabTitle) {
            tabTitle.textContent = 'Education';
        }
    } else {
        expContent.classList.add('active');
        eduContent.classList.remove('active');
        expTab.classList.add('active');
        eduTab.classList.remove('active');
        
        if (tabIcon) {
            tabIcon.className = 'fas fa-briefcase';
        }
        
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
    var counter = document.querySelector('.project-count');
    
    if (!counter) {
        return;
    }

    var text = counter.textContent.trim();
    var match = text.match(/\d+/);
    
    if (!match || counter.dataset.animated === 'true') {
        return;
    }

    counter.dataset.animated = 'true';
    
    var targetNumber = parseInt(match[0]);
    var suffix = text.replace(match[0], '');
    
    var currentNumber = 0;
    var steps = 10;
    var increment = Math.ceil(targetNumber / steps);
    var stepTime = 50;

    var timer = setInterval(function() {
        currentNumber += increment;
        
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        
        counter.textContent = currentNumber + suffix;
    }, stepTime);
}

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelectorAll('.tooltip').forEach(function(el) {
        el.remove();
    });

    setTimeout(animateProjectCounter, 300);

    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }

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

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            var targetId = this.getAttribute('href');
            var target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        });
    });

    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            var name = e.target.alt || 'User';
            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=00b4d8&color=fff&size=200';
        }
    }, true);

    console.log('✨ Portfolio loaded successfully');
    console.log('⌨️  Keyboard shortcuts: Press 1/E for Education, 2/X for Experience');
});