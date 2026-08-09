(function() {
    "use strict";

    // ============================================================
    // 1. TAB SWITCHING
    // ============================================================
    window.switchTab = function(tab) {
        var eduContent = document.getElementById("education-content");
        var expContent = document.getElementById("experience-content");
        var eduTab = document.getElementById("edu-tab");
        var expTab = document.getElementById("exp-tab");
        var tabIcon = document.getElementById("tab-icon");
        var tabTitle = document.getElementById("tab-title");

        if (!eduContent || !expContent || !eduTab || !expTab) return;

        var isEducation = tab === "education";
        eduContent.classList.toggle("active", isEducation);
        expContent.classList.toggle("active", !isEducation);
        eduTab.classList.toggle("active", isEducation);
        expTab.classList.toggle("active", !isEducation);

        if (tabIcon) tabIcon.className = isEducation ? "fas fa-graduation-cap" : "fas fa-briefcase";
        if (tabTitle) tabTitle.textContent = isEducation ? "Education" : "Experience";
    };

    // ============================================================
    // 2. ANIMATE PROJECT COUNTER
    // ============================================================
    function animateProjectCounter() {
        var counter = document.querySelector(".project-count");
        if (!counter || counter.dataset.animated === "true") return;
        counter.dataset.animated = "true";

        var text = counter.textContent.trim();
        var match = text.match(/\d+/);
        if (!match) return;

        var target = parseInt(match[0], 10);
        var suffix = text.replace(match[0], "");
        var current = 0;

        var timer = setInterval(function() {
            current += Math.ceil(target / 10);
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = current + suffix;
        }, 50);
    }

    // ============================================================
    // 3. PROFILE 3D TILT - OPTIMIZED
    // ============================================================
    function initProfileTilt() {
        var wrapper = document.querySelector(".profile-image-wrapper");
        var image = document.querySelector(".profile-image");
        if (!wrapper || !image) return;

        var isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        var isMobile = window.innerWidth < 768;
        var isSamsung = navigator.userAgent.indexOf('SamsungBrowser') > -1;

        // در موبایل و سامسونگ غیرفعال
        if (isTouchDevice || isMobile || isSamsung) {
            image.style.transform = 'none';
            image.style.webkitTransform = 'none';
            image.style.border = '2.5px solid rgba(125, 211, 232, 0.4)';
            wrapper.style.perspective = 'none';
            wrapper.style.webkitPerspective = 'none';
            return;
        }

        var MAX_TILT = 12;
        var MAX_TRANSLATE = 6;
        var targetX = 0, targetY = 0, targetRotX = 0, targetRotY = 0;
        var currentX = 0, currentY = 0, currentRotX = 0, currentRotY = 0;
        var rafId = null;
        var isHovering = false;

        function animate() {
            var speed = 0.1;
            currentRotY += (targetRotY - currentRotY) * speed;
            currentRotX += (targetRotX - currentRotX) * speed;
            currentX += (targetX - currentX) * speed;
            currentY += (targetY - currentY) * speed;

            if (image) {
                var transform = 'translate3d(' + currentX + 'px, ' + currentY + 'px, 10px) ' +
                    'rotateX(' + currentRotX + 'deg) ' +
                    'rotateY(' + currentRotY + 'deg)';
                
                image.style.transform = transform;
                image.style.webkitTransform = transform;
                
                var shadowX = currentRotY * -0.8;
                var shadowY = currentRotX * 0.8;
                image.style.boxShadow = 
                    shadowX + 'px ' + shadowY + 'px 35px rgba(0,0,0,0.5), ' +
                    '0 0 0 1px rgba(125,211,232,0.15), ' +
                    '0 0 50px rgba(0,180,216,' + (0.08 + Math.abs(currentRotX) * 0.005) + ')';
            }
            
            if (isHovering) {
                rafId = requestAnimationFrame(animate);
            }
        }

        wrapper.addEventListener("mouseenter", function() {
            isHovering = true;
            if (!rafId) rafId = requestAnimationFrame(animate);
        });

        wrapper.addEventListener("mousemove", function(e) {
            var rect = wrapper.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            var mx = (e.clientX - rect.left) / rect.width;
            var my = (e.clientY - rect.top) / rect.height;
            
            var nx = Math.max(-0.5, Math.min(0.5, mx - 0.5));
            var ny = Math.max(-0.5, Math.min(0.5, my - 0.5));

            targetRotY = nx * MAX_TILT;
            targetRotX = -ny * MAX_TILT;
            targetX = nx * MAX_TRANSLATE;
            targetY = ny * MAX_TRANSLATE;
        });

        wrapper.addEventListener("mouseleave", function() {
            isHovering = false;
            targetRotX = 0;
            targetRotY = 0;
            targetX = 0;
            targetY = 0;
            
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            
            animateSmoothReturn();
        });

        function animateSmoothReturn() {
            var startRotX = currentRotX;
            var startRotY = currentRotY;
            var startX = currentX;
            var startY = currentY;
            var startTime = Date.now();
            var duration = 400;

            function returnAnim() {
                var elapsed = Date.now() - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var ease = 1 - Math.pow(1 - progress, 3);

                currentRotX = startRotX * (1 - ease);
                currentRotY = startRotY * (1 - ease);
                currentX = startX * (1 - ease);
                currentY = startY * (1 - ease);

                if (image) {
                    var transform = 'translate3d(' + currentX + 'px, ' + currentY + 'px, 10px) ' +
                        'rotateX(' + currentRotX + 'deg) ' +
                        'rotateY(' + currentRotY + 'deg)';
                    image.style.transform = transform;
                    image.style.webkitTransform = transform;
                    
                    image.style.boxShadow = 
                        currentRotY * -0.8 + 'px ' + currentRotX * 0.8 + 'px 35px rgba(0,0,0,0.5), ' +
                        '0 0 0 1px rgba(125,211,232,0.15), ' +
                        '0 0 50px rgba(0,180,216,' + (0.08 + Math.abs(currentRotX) * 0.005) + ')';
                }

                if (progress < 1) {
                    requestAnimationFrame(returnAnim);
                }
            }
            returnAnim();
        }
    }

    // ============================================================
    // 4. CONTACT RIPPLE
    // ============================================================
    function initContactRipple() {
        if (!document.getElementById("ripple-keyframes")) {
            var style = document.createElement("style");
            style.id = "ripple-keyframes";
            style.textContent = 
                '@keyframes contactRipple {' +
                'from { transform: scale(0); opacity: 1; } ' +
                'to { transform: scale(2.5); opacity: 0; } ' +
                '}';
            document.head.appendChild(style);
        }

        var icons = document.querySelectorAll(".contact-inline-icon");
        for (var i = 0; i < icons.length; i++) {
            (function(btn) {
                btn.addEventListener("click", function(e) {
                    var rect = btn.getBoundingClientRect();
                    var size = Math.max(rect.width, rect.height);
                    var ripple = document.createElement("span");
                    ripple.style.cssText = 
                        'position: absolute; ' +
                        'width: ' + size + 'px; ' +
                        'height: ' + size + 'px; ' +
                        'left: ' + (e.clientX - rect.left - size/2) + 'px; ' +
                        'top: ' + (e.clientY - rect.top - size/2) + 'px; ' +
                        'border-radius: 50%; ' +
                        'background: rgba(110, 211, 235, 0.3); ' +
                        'transform: scale(0); ' +
                        'animation: contactRipple 0.6s ease-out; ' +
                        'pointer-events: none;';
                    btn.style.position = "relative";
                    btn.style.overflow = "hidden";
                    btn.appendChild(ripple);
                    setTimeout(function() { ripple.remove(); }, 600);
                });
            })(icons[i]);
        }
    }

    // ============================================================
    // 5. EMAIL COPY
    // ============================================================
    function initEmailCopy() {
        var btn = document.querySelector('.contact-inline-icon[aria-label="Email"]');
        if (!btn) return;

        var email = (btn.getAttribute("href") || "").replace("mailto:", "");
        if (!email) return;

        btn.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(function() {
                    btn.style.background = "rgba(88,214,141,0.25)";
                    btn.style.borderColor = "rgba(88,214,141,0.5)";
                    btn.style.color = "#58d68d";
                    setTimeout(function() {
                        btn.style.background = "";
                        btn.style.borderColor = "";
                        btn.style.color = "";
                    }, 800);
                }).catch(function() {});
            }
        });
    }

    // ============================================================
    // 6. IMAGE FALLBACK
    // ============================================================
    function initImageFallback() {
        window.addEventListener("error", function(e) {
            if (e.target.tagName === "IMG") {
                var name = encodeURIComponent(e.target.alt || "User");
                e.target.src = 'https://ui-avatars.com/api/?name=' + name + 
                    '&background=00b4d8&color=fff&size=200&bold=true';
            }
        }, true);
    }

    // ============================================================
    // 7. KEYBOARD NAVIGATION
    // ============================================================
    function initKeyboardNav() {
        document.addEventListener("keydown", function(e) {
            if (e.target.tagName === "INPUT" || 
                e.target.tagName === "TEXTAREA" || 
                e.target.isContentEditable) return;

            if (e.key === "1" || e.key.toLowerCase() === "e") {
                e.preventDefault();
                window.switchTab("education");
            } else if (e.key === "2" || e.key.toLowerCase() === "x") {
                e.preventDefault();
                window.switchTab("experience");
            }
        });
    }

    // ============================================================
    // 8. RESIZE HANDLER
    // ============================================================
    function initResizeHandler() {
        var resizeTimer;
        window.addEventListener("resize", function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                var wrapper = document.querySelector(".profile-image-wrapper");
                var image = document.querySelector(".profile-image");
                var isMobile = window.innerWidth < 768;
                var isTouch = window.matchMedia("(pointer: coarse)").matches;
                var isSamsung = navigator.userAgent.indexOf('SamsungBrowser') > -1;

                if ((isMobile || isTouch || isSamsung) && wrapper && image) {
                    image.style.transform = 'none';
                    image.style.webkitTransform = 'none';
                    image.style.border = '2.5px solid rgba(125, 211, 232, 0.4)';
                    wrapper.style.perspective = 'none';
                    wrapper.style.webkitPerspective = 'none';
                }
            }, 300);
        });
    }

    // ============================================================
    // 9. PROJECT CARDS - PREVENT EMPTY LINKS
    // ============================================================
    function initProjectCards() {
        var cards = document.querySelectorAll('.project-card');
        for (var i = 0; i < cards.length; i++) {
            (function(card) {
                card.addEventListener('click', function(e) {
                    if (!card.getAttribute('href') || 
                        card.getAttribute('href') === '#' ||
                        card.getAttribute('href') === '') {
                        e.preventDefault();
                    }
                });
            })(cards[i]);
        }
    }

    // ============================================================
    // 10. SAMSUNG BROWSER DETECTION
    // ============================================================
    function detectSamsungBrowser() {
        if (navigator.userAgent.indexOf('SamsungBrowser') > -1) {
            document.body.classList.add('samsung-browser');
        }
    }

    // ============================================================
    // 11. INIT
    // ============================================================
    function init() {
        detectSamsungBrowser();
        initProfileTilt();
        setTimeout(animateProjectCounter, 400);
        initContactRipple();
        initEmailCopy();
        initImageFallback();
        initKeyboardNav();
        initResizeHandler();
        initProjectCards();

        console.log('%c🚀 Portfolio Ready', 'color:#79d8ed;font-size:18px;font-weight:bold;');
        console.log('%c✨ 3D Tilt Active • Premium Dark Theme', 'color:#8ddced;font-size:12px;');
    }

    // ============================================================
    // 12. DOM READY
    // ============================================================
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();