/* ============================================
   PORTFOLIO JAVASCRIPT - Final Version
   3D Tilt Effect + All Features
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

    if (!eduContent || !expContent || !eduTab || !expTab) return;

    if (tab === 'education') {
        eduContent.classList.add('active');
        expContent.classList.remove('active');
        eduTab.classList.add('active');
        expTab.classList.remove('active');
        eduTab.setAttribute('aria-pressed', 'true');
        expTab.setAttribute('aria-pressed', 'false');
        if (tabIcon) tabIcon.className = 'fas fa-graduation-cap';
        if (tabTitle) tabTitle.textContent = 'Education';
    } else {
        expContent.classList.add('active');
        eduContent.classList.remove('active');
        expTab.classList.add('active');
        eduTab.classList.remove('active');
        expTab.setAttribute('aria-pressed', 'true');
        eduTab.setAttribute('aria-pressed', 'false');
        if (tabIcon) tabIcon.className = 'fas fa-briefcase';
        if (tabTitle) tabTitle.textContent = 'Experience';
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
 * 3D Profile Image Tilt Effect
 * Creates subtle rotation towards mouse position
 */
function initProfileTilt() {
    const wrapper = document.querySelector('.profile-image-wrapper');
    const image = document.querySelector('.profile-image');
    
    if (!wrapper || !image) {
        console.warn('⚠️ 3D Tilt: Profile image elements not found');
        return;
    }
    
    // Skip on touch devices
    if ('ontouchstart' in window) {
        console.log('📱 3D Tilt: Disabled on touch device');
        return;
    }
    
    // Maximum rotation in degrees
    const maxTilt = 8;
    
    console.log('✅ 3D Tilt: Initialized successfully');
    
    wrapper.addEventListener('mousemove', function(e) {
        const rect = wrapper.getBoundingClientRect();
        
        // Calculate mouse position relative to center (-0.5 to 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        // Apply rotation
        const rotateY = x * (maxTilt * 2);
        const rotateX = -y * (maxTilt * 2);
        
        image.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        
        // Dynamic shadow based on mouse position
        const shadowX = -x * 10;
        const shadowY = y * 10;
        image.style.boxShadow = `
            ${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.4),
            0 0 0 8px rgba(0, 180, 216, 0.05),
            0 0 0 5px rgba(255, 255, 255, 0.02)
        `;
    });
    
    wrapper.addEventListener('mouseleave', function() {
        // Reset to original position
        image.style.transform = 'rotateY(0deg) rotateX(0deg)';
        image.style.boxShadow = `
            0 8px 25px rgba(0, 0, 0, 0.35),
            0 0 0 8px rgba(0, 180, 216, 0.05),
            0 0 0 5px rgba(255, 255, 255, 0.02)
        `;
    });
    
    // Reset on window blur
    window.addEventListener('blur', function() {
        if (image) {
            image.style.transform = 'rotateY(0deg) rotateX(0deg)';
            image.style.boxShadow = `
                0 8px 25px rgba(0, 0, 0, 0.35),
                0 0 0 8px rgba(0, 180, 216, 0.05),
                0 0 0 5px rgba(255, 255, 255, 0.02)
            `;
        }
    });
}

/**
 * Add ripple effect to contact buttons
 */
function initContactRipple() {
    const contactButtons = document.querySelectorAll('.contact-inline-icon');
    
    if (contactButtons.length === 0) return;
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                border-radius: 50%;
                background: rgba(110, 211, 235, 0.2);
                transform: scale(0);
                animation: contactRipple 0.6s ease-out;
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
 * Add hover tooltip to contact buttons (desktop only)
 */
function initContactTooltips() {
    if ('ontouchstart' in window) return;
    
    const contactButtons = document.querySelectorAll('.contact-inline-icon');
    if (contactButtons.length === 0) return;
    
    contactButtons.forEach(button => {
        const tooltipText = button.getAttribute('title');
        if (!tooltipText) return;
        
        button.addEventListener('mouseenter', function() {
            const existingTooltip = document.querySelector('.contact-tooltip-dynamic');
            if (existingTooltip) existingTooltip.remove();
            
            const tooltip = document.createElement('div');
            tooltip.className = 'contact-tooltip-dynamic';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(15, 18, 28, 0.95);
                color: #e8edf3;
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 0.65rem;
                white-space: nowrap;
                border: 1px solid rgba(110, 211, 235, 0.2);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                z-index: 999;
                pointer-events: none;
                animation: fadeInTooltip 0.2s ease;
            `;
            
            button.style.position = 'relative';
            button.appendChild(tooltip);
        });
        
        button.addEventListener('mouseleave', function() {
            const tooltip = button.querySelector('.contact-tooltip-dynamic');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 200);
            }
        });
    });
}

/**
 * Add copy-to-clipboard for email (mobile: long press, desktop: right click)
 */
function initLongPressCopy() {
    const emailButton = document.querySelector('.contact-inline-icon[aria-label="Email"]');
    if (!emailButton) return;
    
    let pressTimer;
    const emailAddress = emailButton.getAttribute('href')?.replace('mailto:', '') || '';
    if (!emailAddress) return;
    
    // Mobile: long press to copy
    emailButton.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
            navigator.clipboard.writeText(emailAddress).then(() => {
                const feedback = document.createElement('div');
                feedback.textContent = 'Email copied!';
                feedback.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(88, 214, 141, 0.95);
                    color: #111;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    z-index: 9999;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                    animation: slideUpFadeIn 0.3s ease, slideUpFadeOut 0.3s ease 1.5s forwards;
                `;
                document.body.appendChild(feedback);
                setTimeout(() => feedback.remove(), 2000);
            }).catch(() => {});
        }, 800);
    });
    
    emailButton.addEventListener('touchend', () => clearTimeout(pressTimer));
    emailButton.addEventListener('touchmove', () => clearTimeout(pressTimer));
    
    // Desktop: right click to copy
    emailButton.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        navigator.clipboard.writeText(emailAddress).then(() => {
            emailButton.style.background = 'rgba(88, 214, 141, 0.15)';
            emailButton.style.borderColor = 'rgba(88, 214, 141, 0.3)';
            setTimeout(() => {
                emailButton.style.background = '';
                emailButton.style.borderColor = '';
            }, 800);
        }).catch(() => {});
    });
}

/**
 * Initialize everything when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('%c🚀 Portfolio Initializing...', 'color: #79d8ed; font-size: 14px; font-weight: bold;');
    
    // Remove old tooltips
    document.querySelectorAll('.tooltip').forEach(el => el.remove());
    
    // Initialize 3D tilt effect
    initProfileTilt();
    
    // Initialize counter animation
    setTimeout(animateProjectCounter, 300);
    
    // Initialize contact button effects
    initContactRipple();
    initContactTooltips();
    initLongPressCopy();
    
    // Keyboard shortcuts for tab switching
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
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        });
    });
    
    // Handle image loading errors
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            const name = e.target.alt || 'User';
            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=00b4d8&color=fff&size=200';
        }
    }, true);
    
    // Success messages
    console.log('%c✨ Portfolio Ready %c| %c3D Tilt Active',
        'color: #79d8ed; font-size: 14px; font-weight: bold;',
        'color: #6b7280;',
        'color: #8ddced; font-weight: 500;'
    );
    console.log('%c⌨️  Shortcuts:%c 1/E=Education %c2/X=Experience',
        'color: #79d8ed;',
        'color: #aeb8c6;',
        'color: #aeb8c6;'
    );
    console.log('%c🖱️  Hover over profile image for 3D effect',
        'color: #79d8ed;'
    );
});

// Add dynamic CSS animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes contactRipple {
        from { transform: scale(0); opacity: 1; }
        to { transform: scale(2.5); opacity: 0; }
    }
    
    @keyframes fadeInTooltip {
        from { opacity: 0; transform: translateX(-50%) translateY(5px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @keyframes slideUpFadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @keyframes slideUpFadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    }
`;
document.head.appendChild(dynamicStyles);