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
    // 3. GLOW EFFECT - فقط نور پشت عکس
    // ============================================================
    function initGlowEffect() {
        var wrapper = document.querySelector(".profile-image-wrapper");
        if (!wrapper) return;

        // ساخت glow effect
        var glow = document.createElement('div');
        glow.className = 'glow-effect';
        wrapper.appendChild(glow);
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
    // 8. PROJECT CARDS
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
    // 9. SAMSUNG BROWSER DETECTION
    // ============================================================
    function detectSamsungBrowser() {
        if (navigator.userAgent.indexOf('SamsungBrowser') > -1) {
            document.body.classList.add('samsung-browser');
        }
    }

    // ============================================================
    // 10. INIT
    // ============================================================
    function init() {
        detectSamsungBrowser();
        initGlowEffect();
        setTimeout(animateProjectCounter, 400);
        initContactRipple();
        initEmailCopy();
        initImageFallback();
        initKeyboardNav();
        initProjectCards();

        console.log('%c🚀 Portfolio Ready', 'color:#79d8ed;font-size:18px;font-weight:bold;');
        console.log('%c✨ Glow Effect Active • Static Profile', 'color:#8ddced;font-size:12px;');
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