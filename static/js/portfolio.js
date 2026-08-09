/* ============================================
   PORTFOLIO JAVASCRIPT - Optimized
   Fast & Smooth Performance • Minimal Design
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
 * 3D Profile Image Tilt Effect
 * Creates subtle rotation towards mouse position
 */
function initProfileTilt() {
    const profileWrapper = document.querySelector('.profile-image-wrapper');
    const profileImage = document.querySelector('.profile-image');
    
    if (!profileWrapper || !profileImage) return;
    
    // Don't apply on touch devices
    if ('ontouchstart' in window) return;
    
    // Maximum rotation in degrees (subtle effect)
    const maxTilt = 8;
    
    profileWrapper.addEventListener('mousemove', function(e) {
        const rect = profileWrapper.getBoundingClientRect();
        
        // Calculate mouse position relative to center (in percentage)
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate offset from center (-1 to 1)
        const offsetX = (e.clientX - centerX) / (rect.width / 2);
        const offsetY = (e.clientY - centerY) / (rect.height / 2);
        
        // Calculate rotation (clamped between -maxTilt and maxTilt)
        const rotateY = offsetX * maxTilt;
        const rotateX = -offsetY * maxTilt;
        
        // Apply transform
        profileImage.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        
        // Add subtle shadow shift
        const shadowX = -offsetX * 5;
        const shadowY = offsetY * 5;
        profileImage.style.boxShadow = `
            ${shadowX}px ${shadowY}px 20px rgba(0, 0, 0, 0.4),
            0 0 0 5px rgba(255, 255, 255, 0.02)
        `;
    });
    
    profileWrapper.addEventListener('mouseleave', function() {
        // Smooth reset to original position
        profileImage.style.transform = 'rotateY(0deg) rotateX(0deg)';
        profileImage.style.boxShadow = `
            0 8px 25px rgba(0, 0, 0, 0.35),
            0 0 0 5px rgba(255, 255, 255, 0.02)
        `;
    });
    
    // Reset on window blur (when user switches tabs)
    window.addEventListener('blur', function() {
        profileImage.style.transform = 'rotateY(0deg) rotateX(0deg)';
        profileImage.style.boxShadow = `
            0 8px 25px rgba(0, 0, 0, 0.35),
            0 0 0 5px rgba(255, 255, 255, 0.02)
        `;
    });
}

/**
 * Add ripple effect to icon-only contact buttons
 */
function initContactRipple() {
    const contactButtons = document.querySelectorAll('.contact-item-icon-only');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple element
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
            
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Add hover tooltip to contact buttons (shows on desktop)
 */
function initContactTooltips() {
    // Only add tooltips on non-touch devices
    if (!('ontouchstart' in window)) {
        const contactButtons = document.querySelectorAll('.contact-item-icon-only');
        
        contactButtons.forEach(button => {
            const tooltipText = button.getAttribute('title');
            if (!tooltipText) return;
            
            button.addEventListener('mouseenter', function() {
                // Remove existing tooltip
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
                
                button.style.position = button.style.position || 'relative';
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
}

/**
 * Add copy-to-clipboard for email on long press (mobile)
 */
function initLongPressCopy() {
    const emailButton = document.querySelector('.contact-item-icon-only[aria-label="Email"]');
    
    if (!emailButton) return;
    
    let pressTimer;
    const emailAddress = emailButton.getAttribute('href')?.replace('mailto:', '') || '';
    
    if (!emailAddress) return;
    
    // Touch events for mobile
    emailButton.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(() => {
            navigator.clipboard.writeText(emailAddress).then(() => {
                // Show brief feedback
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
            }).catch(() => {
                // Silent fail
            });
        }, 800);
    });
    
    emailButton.addEventListener('touchend', function() {
        clearTimeout(pressTimer);
    });
    
    emailButton.addEventListener('touchmove', function() {
        clearTimeout(pressTimer);
    });
    
    // Click events for desktop (right-click to copy)
    emailButton.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        navigator.clipboard.writeText(emailAddress).then(() => {
            // Visual feedback on button
            emailButton.style.background = 'rgba(88, 214, 141, 0.15)';
            emailButton.style.borderColor = 'rgba(88, 214, 141, 0.3)';
            setTimeout(() => {
                emailButton.style.background = '';
                emailButton.style.borderColor = '';
            }, 800);
        }).catch(() => {
            // Silent fail
        });
    });
}

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Remove all tooltip elements (old tooltips)
    document.querySelectorAll('.tooltip').forEach(function(el) {
        el.remove();
    });

    // Initialize 3D tilt effect on profile image
    initProfileTilt();

    // Start counter animation after a short delay
    setTimeout(animateProjectCounter, 300);

    // Initialize contact button effects
    initContactRipple();
    initContactTooltips();
    initLongPressCopy();

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

    // Log successful initialization with style
    console.log('%c✨ Portfolio Loaded Successfully %c| %cNavid · AI Engineer',
        'color: #79d8ed; font-size: 14px; font-weight: bold;',
        'color: #6b7280;',
        'color: #8ddced; font-weight: 500;'
    );
    console.log('%c⌨️  Keyboard Shortcuts:%c Press %c1/E %cfor Education, %c2/X %cfor Experience',
        'color: #79d8ed;',
        'color: #aeb8c6;',
        'color: #fff; font-weight: bold;',
        'color: #aeb8c6;',
        'color: #fff; font-weight: bold;',
        'color: #aeb8c6;'
    );
    console.log('%c📧 Right-click email icon to copy %c| %c📱 Long-press on mobile to copy',
        'color: #79d8ed;',
        'color: #6b7280;',
        'color: #8ddced;'
    );
    console.log('%c🖱️  Profile image tilts towards mouse cursor',
        'color: #79d8ed;',
        'color: #aeb8c6;'
    );
});

// Add CSS for dynamic elements
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes contactRipple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2.5);
            opacity: 0;
        }
    }
    
    @keyframes fadeInTooltip {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(5px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUpFadeIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUpFadeOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
        }
    }
    
    .contact-item-icon-only {
        position: relative;
        overflow: hidden;
    }
    
    .contact-tooltip-dynamic {
        transition: opacity 0.2s ease;
    }
`;
document.head.appendChild(dynamicStyles);