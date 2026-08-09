/* ============================================================
   PORTFOLIO JAVASCRIPT
   Optimized • Fast • Smooth Performance
   Profile Image 3D Mouse Tilt
   ============================================================ */


/* ============================================================
   TAB SWITCHING SYSTEM
   ============================================================ */

function switchTab(tab) {

    const eduContent = document.getElementById('education-content');
    const expContent = document.getElementById('experience-content');

    const eduTab = document.getElementById('edu-tab');
    const expTab = document.getElementById('exp-tab');

    const tabIcon = document.getElementById('tab-icon');
    const tabTitle = document.getElementById('tab-title');

    // Validate elements
    if (!eduContent || !expContent || !eduTab || !expTab) {
        return;
    }

    /* ---------------- Education ---------------- */

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
    }

    /* ---------------- Experience ---------------- */

    else {

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


/* ============================================================
   PROJECT COUNTER ANIMATION
   ============================================================ */

function animateProjectCounter() {

    const counter = document.querySelector('.project-count');

    if (!counter) {
        return;
    }

    const text = counter.textContent.trim();
    const match = text.match(/\d+/);

    if (!match || counter.dataset.animated === 'true') {
        return;
    }

    counter.dataset.animated = 'true';

    const targetNumber = parseInt(match[0], 10);
    const suffix = text.replace(match[0], '');

    let currentNumber = 0;

    const steps = 10;
    const increment = Math.ceil(targetNumber / steps);
    const stepTime = 50;

    const timer = setInterval(() => {

        currentNumber += increment;

        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }

        counter.textContent = `${currentNumber}${suffix}`;

    }, stepTime);
}


/* ============================================================
   CONTACT RIPPLE EFFECT
   ============================================================ */

function initContactRipple() {

    const contactButtons =
        document.querySelectorAll('.contact-item-icon-only');

    if (!contactButtons.length) {
        return;
    }

    contactButtons.forEach(button => {

        button.addEventListener('click', function (e) {

            const ripple = document.createElement('span');

            const rect = button.getBoundingClientRect();

            const size = Math.max(
                rect.width,
                rect.height
            );

            const x =
                e.clientX -
                rect.left -
                size / 2;

            const y =
                e.clientY -
                rect.top -
                size / 2;

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

            setTimeout(() => {
                ripple.remove();
            }, 600);

        });

    });
}


/* ============================================================
   CONTACT TOOLTIPS
   Desktop Only
   ============================================================ */

function initContactTooltips() {

    if ('ontouchstart' in window) {
        return;
    }

    const contactButtons =
        document.querySelectorAll('.contact-item-icon-only');

    if (!contactButtons.length) {
        return;
    }

    contactButtons.forEach(button => {

        const tooltipText =
            button.getAttribute('title');

        if (!tooltipText) {
            return;
        }

        button.addEventListener('mouseenter', function () {

            const existingTooltip =
                document.querySelector('.contact-tooltip-dynamic');

            if (existingTooltip) {
                existingTooltip.remove();
            }

            const tooltip =
                document.createElement('div');

            tooltip.className =
                'contact-tooltip-dynamic';

            tooltip.textContent =
                tooltipText;

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

            button.style.position =
                button.style.position || 'relative';

            button.appendChild(tooltip);

        });

        button.addEventListener('mouseleave', function () {

            const tooltip =
                button.querySelector('.contact-tooltip-dynamic');

            if (tooltip) {

                tooltip.style.opacity = '0';

                setTimeout(() => {

                    if (tooltip.parentNode) {
                        tooltip.remove();
                    }

                }, 200);
            }

        });

    });
}


/* ============================================================
   EMAIL LONG-PRESS COPY
   ============================================================ */

function initLongPressCopy() {

    const emailButton =
        document.querySelector(
            '.contact-item-icon-only[aria-label="Email"]'
        );

    if (!emailButton) {
        return;
    }

    let pressTimer;

    const emailAddress =
        emailButton
            .getAttribute('href')
            ?.replace('mailto:', '') || '';

    if (!emailAddress) {
        return;
    }


    /* ---------------- Mobile Long Press ---------------- */

    emailButton.addEventListener('touchstart', function () {

        pressTimer = setTimeout(() => {

            if (!navigator.clipboard) {
                return;
            }

            navigator.clipboard
                .writeText(emailAddress)
                .then(() => {

                    const feedback =
                        document.createElement('div');

                    feedback.textContent =
                        'Email copied!';

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
                        animation:
                            slideUpFadeIn 0.3s ease,
                            slideUpFadeOut 0.3s ease 1.5s forwards;
                    `;

                    document.body.appendChild(feedback);

                    setTimeout(() => {
                        feedback.remove();
                    }, 2000);

                })
                .catch(() => {
                    // Clipboard unavailable
                });

        }, 800);

    }, {
        passive: true
    });


    emailButton.addEventListener('touchend', function () {
        clearTimeout(pressTimer);
    });

    emailButton.addEventListener('touchmove', function () {
        clearTimeout(pressTimer);
    });


    /* ---------------- Desktop Right Click ---------------- */

    emailButton.addEventListener('contextmenu', function (e) {

        e.preventDefault();

        if (!navigator.clipboard) {
            return;
        }

        navigator.clipboard
            .writeText(emailAddress)
            .then(() => {

                emailButton.style.background =
                    'rgba(88, 214, 141, 0.15)';

                emailButton.style.borderColor =
                    'rgba(88, 214, 141, 0.3)';

                setTimeout(() => {

                    emailButton.style.background = '';
                    emailButton.style.borderColor = '';

                }, 800);

            })
            .catch(() => {
                // Clipboard unavailable
            });

    });
}




/* ============================================================
   PROFILE IMAGE 3D MOUSE TILT
   (Rotates the image inside, not the wrapper)
   ============================================================ */

function initProfileTilt() {

    const supportsHover =
        window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!supportsHover) return;

    const wrapper = document.querySelector('.profile-image-wrapper');
    const image = document.querySelector('.profile-image');

    if (!wrapper || !image) return;

    const MAX_TILT = 10;

    /* ========================================================
       MOUSE MOVE - فقط rotate، بدون translateZ
       ======================================================== */

    wrapper.addEventListener('mousemove', function (e) {

        const rect = wrapper.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const rotateY = x * (MAX_TILT * 2);
        const rotateX = -y * (MAX_TILT * 2);

        // فقط rotate، بدون translateZ
        image.style.transform = `
        translateZ(8px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        `;

        // سایه پویا
        const shadowX = -x * 10;
        const shadowY = y * 10;
        image.style.boxShadow = `
            ${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(125, 211, 232, 0.22),
            0 0 35px rgba(0, 180, 216, 0.12)
        `;

        // نور reflection
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        wrapper.style.setProperty('--mouse-x', mx + '%');
        wrapper.style.setProperty('--mouse-y', my + '%');
    });

    /* ========================================================
       MOUSE LEAVE - برگشت به حالت عادی
       ======================================================== */

    wrapper.addEventListener('mouseleave', function () {

        image.style.transform = `
        translateZ(8px)
        rotateX(0deg)
        rotateY(0deg)
        `;

        image.style.boxShadow = `
            0 10px 30px rgba(0, 0, 0, 0.40),
            0 0 0 1px rgba(125, 211, 232, 0.18),
            0 0 30px rgba(0, 180, 216, 0.10)
        `;

        wrapper.style.setProperty('--mouse-x', '50%');
        wrapper.style.setProperty('--mouse-y', '50%');
    });
}


/* ============================================================
   KEYBOARD TAB SHORTCUTS
   ============================================================ */

function initKeyboardShortcuts() {

    document.addEventListener('keydown', function (e) {

        /*
         * Ignore inputs
         */

        if (
            e.target.tagName === 'INPUT' ||
            e.target.tagName === 'TEXTAREA' ||
            e.target.isContentEditable
        ) {
            return;
        }


        switch (e.key.toLowerCase()) {

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
}


/* ============================================================
   SMOOTH ANCHOR SCROLL
   ============================================================ */

function initSmoothScroll() {

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(function (anchor) {

            anchor.addEventListener(
                'click',
                function (e) {

                    e.preventDefault();

                    const targetId =
                        this.getAttribute('href');

                    if (!targetId || targetId === '#') {
                        return;
                    }

                    const target =
                        document.querySelector(targetId);

                    if (!target) {
                        return;
                    }

                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });

                }
            );

        });
}


/* ============================================================
   IMAGE ERROR FALLBACK
   ============================================================ */

function initImageFallback() {

    window.addEventListener(
        'error',
        function (e) {

            if (
                !e.target ||
                e.target.tagName !== 'IMG'
            ) {
                return;
            }


            /*
             * Prevent infinite error loop
             */

            if (
                e.target.dataset.fallbackApplied === 'true'
            ) {
                return;
            }

            e.target.dataset.fallbackApplied =
                'true';


            const name =
                e.target.alt || 'User';


            e.target.src =
                'https://ui-avatars.com/api/?name=' +
                encodeURIComponent(name) +
                '&background=00b4d8&color=fff&size=200';

        },
        true
    );
}


/* ============================================================
   REMOVE OLD TOOLTIPS
   ============================================================ */

function removeOldTooltips() {

    document
        .querySelectorAll('.tooltip')
        .forEach(function (element) {

            element.remove();

        });
}


/* ============================================================
   DYNAMIC CSS
   ============================================================ */

function injectDynamicStyles() {

    /*
     * Prevent duplicate style injection
     */

    if (document.getElementById('portfolio-dynamic-styles')) {
        return;
    }


    const dynamicStyles =
        document.createElement('style');

    dynamicStyles.id =
        'portfolio-dynamic-styles';


    dynamicStyles.textContent = `

        /* ================================================
           CONTACT RIPPLE
           ================================================ */

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


        /* ================================================
           CONTACT TOOLTIP
           ================================================ */

        @keyframes fadeInTooltip {

            from {
                opacity: 0;
                transform:
                    translateX(-50%)
                    translateY(5px);
            }

            to {
                opacity: 1;
                transform:
                    translateX(-50%)
                    translateY(0);
            }

        }


        /* ================================================
           EMAIL COPY FEEDBACK
           ================================================ */

        @keyframes slideUpFadeIn {

            from {
                opacity: 0;
                transform:
                    translateX(-50%)
                    translateY(10px);
            }

            to {
                opacity: 1;
                transform:
                    translateX(-50%)
                    translateY(0);
            }

        }


        @keyframes slideUpFadeOut {

            from {
                opacity: 1;
                transform:
                    translateX(-50%)
                    translateY(0);
            }

            to {
                opacity: 0;
                transform:
                    translateX(-50%)
                    translateY(-10px);
            }

        }


        /* ================================================
           CONTACT BUTTON
           ================================================ */

        .contact-item-icon-only {
            position: relative;
            overflow: hidden;
        }


        .contact-tooltip-dynamic {
            transition:
                opacity 0.2s ease;
        }


        /* ================================================
           PROFILE IMAGE 3D
           ================================================ */

        .profile-image-wrapper {
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }


        .profile-image-wrapper .profile-image {
            transform: translateZ(8px);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }


        /* ================================================
           REDUCED MOTION
           ================================================ */

        @media (prefers-reduced-motion: reduce) {

            .profile-image-wrapper {
                transform: none !important;
                transition: none !important;
            }

            .profile-image-wrapper .profile-image {
                transform: none !important;
            }

        }

    `;


    document.head.appendChild(dynamicStyles);
}


/* ============================================================
   INITIALIZE EVERYTHING
   ============================================================ */

document.addEventListener(
    'DOMContentLoaded',
    function () {

        /*
         * Remove old tooltip elements
         */

        removeOldTooltips();


        /*
         * Inject dynamic styles
         */

        injectDynamicStyles();


        /*
         * Project counter
         */

        setTimeout(
            animateProjectCounter,
            300
        );


        /*
         * Contact functionality
         */

        initContactRipple();

        initContactTooltips();

        initLongPressCopy();


        /*
         * Profile 3D Mouse Tilt
         */

        initProfileTilt();


        /*
         * Keyboard shortcuts
         */

        initKeyboardShortcuts();


        /*
         * Smooth scrolling
         */

        initSmoothScroll();


        /*
         * Image fallback
         */

        initImageFallback();


        /* ================================================
           Console Information
           ================================================ */

        console.log(
            '%cPortfolio Loaded Successfully %c| %cNavid · AI Engineer',
            'color: #79d8ed; font-size: 14px; font-weight: bold;',
            'color: #6b7280;',
            'color: #8ddced; font-weight: 500;'
        );


        console.log(
            '%cKeyboard Shortcuts:%c Press %c1/E %cfor Education, %c2/X %cfor Experience',
            'color: #79d8ed;',
            'color: #aeb8c6;',
            'color: #fff; font-weight: bold;',
            'color: #aeb8c6;',
            'color: #fff; font-weight: bold;',
            'color: #aeb8c6;'
        );


        console.log(
            '%cEmail:%c Right-click on desktop or long-press on mobile to copy',
            'color: #79d8ed;',
            'color: #aeb8c6;'
        );


        console.log(
            '%c3D Profile Tilt:%c Enabled',
            'color: #79d8ed;',
            'color: #8ddced;'
        );

    }
);