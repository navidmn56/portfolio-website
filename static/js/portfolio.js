/* ============================================
   PORTFOLIO JAVASCRIPT - Optimized
   Fast & Smooth Performance
   ============================================ */

/**
 * Tab Switching System - Instant response
 */
function switchTab(tab) {
    const eduContent = document.getElementById('education-content');
    const expContent = document.getElementById('experience-content');
    const eduTab = document.getElementById('edu-tab');
    const expTab = document.getElementById('exp-tab');
    const tabIcon = document.getElementById('tab-icon');
    const tabTitle = document.getElementById('tab-title');

    if (!eduContent || !expContent || !eduTab || !expTab) return;

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
 */
function animateProjectCounter() {
    const counter = document.querySelector('.project-count');
    if (!counter) return;

    const text = counter.textContent.trim();
    const match = text.match(/\d+/);
    if (!match || counter.dataset.animated === 'true') return;

    counter.dataset.animated = 'true';
    const targetNumber = parseInt(match[0]);
    const suffix = text.replace(match[0], '');
    let currentNumber = 0;
    const steps = 10;
    const increment = Math.ceil(targetNumber / steps);

    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        counter.textContent = `${currentNumber}${suffix}`;
    }, 50);
}

/**
 * Initialize Everything
 */
document.addEventListener('DOMContentLoaded', function() {
    // Remove all tooltips
    document.querySelectorAll('.tooltip').forEach(el => el.remove());

    // Animate counter with delay
    setTimeout(animateProjectCounter, 300);

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

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

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Handle image loading errors
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const name = e.target.alt || 'User';
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00b4d8&color=fff&size=200`;
        }
    }, true);

    console.log('✨ Portfolio loaded');
});