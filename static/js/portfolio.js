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
    // 3. PROFILE 3D TILT - فقط دسکتاپ
    // ============================================================
    function initProfileTilt() {
        var wrapper = document.querySelector(".profile-image-wrapper");
        var image = document.querySelector(".profile-image");
        if (!wrapper || !image) return;

        var isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        var isMobile = window.innerWidth < 600;

        // تشخیص مرورگر سامسونگ
        var isSamsung = navigator.userAgent.indexOf('SamsungBrowser') > -1;

        if (isTouchDevice || isMobile || isSamsung) {
            // غیرفعال کردن کامل تیلت
            image.style.transform = 'none';
            image.style.webkitTransform = 'none';
            image.style.border = '2.5px solid rgba(125, 211, 232, 0.4)';
            wrapper.style.perspective = 'none';
            wrapper.style.webkitPerspective = 'none';
            wrapper.style.transform = 'none';
            wrapper.style.webkitTransform = 'none';
            return;
        }

        var MAX_TILT = 12;
        var MAX_TRANSLATE = 6;
        var targetX = 0,
            targetY = 0,
            targetRotX = 0,
            targetRotY = 0;
        var currentX = 0,
            currentY = 0,
            currentRotX = 0,
            currentRotY = 0;
        var rafId = null;

        function animate() {
            currentRotY += (targetRotY - currentRotY) * 0.12;
            currentRotX += (targetRotX - currentRotX) * 0.12;
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;

            if (image) {
                image.style.transform = 'translate3d(' + currentX + 'px, ' + currentY + 'px, 8px) rotateX(' + currentRotX + 'deg) rotateY(' + currentRotY + 'deg)';
                image.style.boxShadow = currentRotY * -0.8 + 'px ' + currentRotX * 0.8 + 'px 30px rgba(0,0,0,0.42), 0 0 0 1px rgba(125,211,232,0.22), 0 0 24px rgba(0,180,216,0.10)';
            }
            rafId = requestAnimationFrame(animate);
        }

        wrapper.addEventListener("mouseenter", function() {
            if (!rafId) rafId = requestAnimationFrame(animate);
        });

        wrapper.addEventListener("mousemove", function(e) {
            var rect = wrapper.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            var mx = (e.clientX - rect.left) / rect.width;
            var my = (e.clientY - rect.top) / rect.height;
            var nx = mx - 0.5;
            var ny = my - 0.5;

            targetRotY = nx * MAX_TILT;
            targetRotX = -ny * MAX_TILT;
            targetX = nx * MAX_TRANSLATE;
            targetY = ny * MAX_TRANSLATE;

            wrapper.style.setProperty("--mouse-x", mx * 100 + '%');
            wrapper.style.setProperty("--mouse-y", my * 100 + '%');
        });

        wrapper.addEventListener("mouseleave", function() {
            targetRotX = 0;
            targetRotY = 0;
            targetX = 0;
            targetY = 0;
            wrapper.style.setProperty("--mouse-x", '50%');
            wrapper.style.setProperty("--mouse-y", '50%');
        });

        if (!rafId) rafId = requestAnimationFrame(animate);
    }

    // ============================================================
    // 4. FIX SAMSUNG BROWSER - اعمال کلاس و استایل‌های خاص
    // ============================================================
    function fixSamsungBrowser() {
        var ua = navigator.userAgent;
        if (ua.indexOf('SamsungBrowser') > -1) {
            document.body.classList.add('samsung-browser');

            // اعمال استایل‌های خاص برای سامسونگ
            var style = document.createElement('style');
            style.textContent = `
                /* استایل‌های خاص مرورگر سامسونگ */
                .samsung-browser .profile-info {
                    display: table !important;
                }
                .samsung-browser .profile-image-wrapper {
                    display: table-cell !important;
                    vertical-align: middle !important;
                }
                .samsung-browser .name-section {
                    display: table-cell !important;
                    vertical-align: middle !important;
                }
                .samsung-browser .social-icon-circle {
                    display: inline-flex !important;
                    border-radius: 50% !important;
                    aspect-ratio: 1/1 !important;
                }
                .samsung-browser .status-dot {
                    position: absolute !important;
                    right: 2px !important;
                    bottom: 2px !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ============================================================
    // 5. CONTACT RIPPLE
    // ============================================================
    function initContactRipple() {
        if (!document.getElementById("ripple-keyframes")) {
            var style = document.createElement("style");
            style.id = "ripple-keyframes";
            style.textContent = '@keyframes contactRipple { from { transform: scale(0); opacity: 1; } to { transform: scale(2.5); opacity: 0; } }';
            document.head.appendChild(style);
        }

        var icons = document.querySelectorAll(".contact-inline-icon");
        for (var i = 0; i < icons.length; i++) {
            (function(btn) {
                btn.addEventListener("click", function(e) {
                    var rect = btn.getBoundingClientRect();
                    var size = Math.max(rect.width, rect.height);
                    var ripple = document.createElement("span");
                    ripple.style.cssText = 'position: absolute; width: ' + size + 'px; height: ' + size + 'px; left: ' + (e.clientX - rect.left - size / 2) + 'px; top: ' + (e.clientY - rect.top - size / 2) + 'px; border-radius: 50%; background: rgba(110, 211, 235, 0.25); transform: scale(0); animation: contactRipple 0.6s ease-out; pointer-events: none;';
                    btn.style.position = "relative";
                    btn.style.overflow = "hidden";
                    btn.appendChild(ripple);
                    setTimeout(function() { ripple.remove(); }, 600);
                });
            })(icons[i]);
        }
    }

    // ============================================================
    // 6. EMAIL COPY
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
                    btn.style.background = "rgba(88,214,141,0.2)";
                    btn.style.borderColor = "rgba(88,214,141,0.4)";
                    setTimeout(function() {
                        btn.style.background = "";
                        btn.style.borderColor = "";
                    }, 800);
                }).catch(function() {});
            }
        });
    }

    // ============================================================
    // 7. IMAGE FALLBACK
    // ============================================================
    function initImageFallback() {
        window.addEventListener("error", function(e) {
            if (e.target.tagName === "IMG") {
                var name = encodeURIComponent(e.target.alt || "User");
                e.target.src = 'https://ui-avatars.com/api/?name=' + name + '&background=00b4d8&color=fff&size=200';
            }
        }, true);
    }

    // ============================================================
    // 8. KEYBOARD NAVIGATION
    // ============================================================
    function initKeyboardNav() {
        document.addEventListener("keydown", function(e) {
            if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable) return;

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
    // 9. RESIZE HANDLER
    // ============================================================
    function initResizeHandler() {
        var resizeTimer;
        window.addEventListener("resize", function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                var wrapper = document.querySelector(".profile-image-wrapper");
                var image = document.querySelector(".profile-image");
                var isMobile = window.innerWidth < 600;
                var isTouch = window.matchMedia("(pointer: coarse)").matches;
                var isSamsung = navigator.userAgent.indexOf('SamsungBrowser') > -1;

                if ((isMobile || isTouch || isSamsung) && wrapper && image) {
                    image.style.transform = 'none';
                    image.style.webkitTransform = 'none';
                    image.style.border = '2.5px solid rgba(125, 211, 232, 0.4)';
                    wrapper.style.perspective = 'none';
                    wrapper.style.webkitPerspective = 'none';
                    wrapper.style.transform = 'none';
                    wrapper.style.webkitTransform = 'none';
                }
            }, 300);
        });
    }

    // ============================================================
    // 10. INIT
    // ============================================================
    function init() {
        fixSamsungBrowser();
        initProfileTilt();
        setTimeout(animateProjectCounter, 300);
        initContactRipple();
        initEmailCopy();
        initImageFallback();
        initKeyboardNav();
        initResizeHandler();

        console.log("%c✅ Portfolio Ready %c| %cSamsung Fixed (Table Layout)", 
            "color:#79d8ed;font-weight:bold;", 
            "color:#6b7280;", 
            "color:#8ddced;"
        );
    }

    // ============================================================
    // 11. DOM READY
    // ============================================================
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();