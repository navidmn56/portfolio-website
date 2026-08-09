/* ============================================
   PORTFOLIO JAVASCRIPT - Final Version
   3D Tilt Effect + All Features
   ============================================ */

/**
 * Tab Switching System
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
        if (tabIcon) tabIcon.className = 'fas fa-graduation-cap';
        if (tabTitle) tabTitle.textContent = 'Education';
    } else {
        expContent.classList.add('active');
        eduContent.classList.remove('active');
        expTab.classList.add('active');
        eduTab.classList.remove('active');
        if (tabIcon) tabIcon.className = 'fas fa-briefcase';
        if (tabTitle) tabTitle.textContent = 'Experience';
    }
}

/**
 * Counter Animation
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
 * 3D Profile Image Tilt Effect
 */
function initProfileTilt() {
    const wrapper = document.querySelector('.profile-image-wrapper');
    const image = document.querySelector('.profile-image');
    
    if (!wrapper || !image) {
        console.warn('3D Tilt: Elements not found');
        return;
    }
    
    // Skip on touch devices
    if ('ontouchstart' in window) {
        console.log('3D Tilt: Disabled on touch device');
        return;
    }
    
    const maxTilt = 8;
    
    wrapper.addEventListener('mousemove', function(e) {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        image.style.transform = `rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt * 2}deg)`;
        
        image.style.boxShadow = `
            ${-x * 10}px ${y * 10}px 25px rgba(0, 0, 0, 0.4),
            0 0 0 8px rgba(0, 180, 216, 0.05),
            0 0 0 5px rgba(255, 255, 255, 0.02)
        `;
    });
    
    wrapper.addEventListener('mouseleave', function() {
        image.style.transform = 'rotateY(0deg) rotateX(0deg)';
        image.style.boxShadow = `
            0 8px 25px rgba(0, 0, 0, 0.35),
            0 0 0 8px rgba(0, 180, 216, 0.05),
            0 0 0 5px rgba(255, 255, 255, 0.02)
        `;
    });
}

/**
 * Contact Ripple Effect
 */
function initContactRipple() {
    const buttons = document.querySelectorAll('.contact-inline-icon');
    if (!buttons.length) return;
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                border-radius: 50%;
                background: rgba(110, 211, 235, 0.2);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/**
 * Copy Email on Right Click
 */
function initEmailCopy() {
    const emailBtn = document.querySelector('.contact-inline-icon[aria-label="Email"]');
    if (!emailBtn) return;
    
    const email = emailBtn.getAttribute('href')?.replace('mailto:', '') || '';
    if (!email) return;
    
    emailBtn.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        navigator.clipboard.writeText(email).then(() => {
            emailBtn.style.background = 'rgba(88, 214, 141, 0.15)';
            emailBtn.style.borderColor = 'rgba(88, 214, 141, 0.3)';
            setTimeout(() => {
                emailBtn.style.background = '';
                emailBtn.style.borderColor = '';
            }, 800);
        });
    });
}

/**
 * Initialize Everything
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize 3D tilt
    initProfileTilt();
    
    // Counter animation
    setTimeout(animateProjectCounter, 300);
    
    // Contact effects
    initContactRipple();
    initEmailCopy();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.key === '1' || e.key.toLowerCase() === 'e') {
            e.preventDefault();
            switchTab('education');
        } else if (e.key === '2' || e.key.toLowerCase() === 'x') {
            e.preventDefault();
            switchTab('experience');
        }
    });
    
    // Image error fallback
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(e.target.alt || 'User') + '&background=00b4d8&color=fff&size=200';
        }
    }, true);
    
    console.log('✅ Portfolio Ready - 3D Tilt Active');
});

// Dynamic styles
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        from { transform: scale(0); opacity: 1; }
        to { transform: scale(2.5); opacity: 0; }
    }
`;
document.head.appendChild(style);