(function () {
    "use strict";

    // ============================================================
    // 1. TAB SWITCHING
    // ============================================================
    window.switchTab = function (tab) {
        const eduContent = document.getElementById("education-content");
        const expContent = document.getElementById("experience-content");
        const eduTab = document.getElementById("edu-tab");
        const expTab = document.getElementById("exp-tab");
        const tabIcon = document.getElementById("tab-icon");
        const tabTitle = document.getElementById("tab-title");
        
        if (!eduContent || !expContent || !eduTab || !expTab) return;
        
        const isEducation = tab === "education";
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
        const counter = document.querySelector(".project-count");
        if (!counter || counter.dataset.animated === "true") return;
        counter.dataset.animated = "true";
        
        const text = counter.textContent.trim();
        const match = text.match(/\d+/);
        if (!match) return;
        
        const target = parseInt(match[0], 10);
        const suffix = text.replace(match[0], "");
        let current = 0;
        
        const timer = setInterval(() => {
            current += Math.ceil(target / 10);
            if (current >= target) { 
                current = target; 
                clearInterval(timer); 
            }
            counter.textContent = `${current}${suffix}`;
        }, 50);
    }

    // ============================================================
    // 3. PROFILE 3D TILT - فقط در دسکتاپ
    // ============================================================
    function initProfileTilt() {
        const wrapper = document.querySelector(".profile-image-wrapper");
        const image = document.querySelector(".profile-image");
        if (!wrapper || !image) return;

        // تشخیص دستگاه لمسی یا موبایل
        const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
        const isMobile = window.innerWidth < 600;
        
        if (isTouchDevice || isMobile) {
            // غیرفعال کردن تیلت در موبایل - اما حفظ بوردر و ظاهر
            image.style.transform = 'none';
            image.style.border = '2px solid rgba(125, 211, 232, 0.35)';
            wrapper.style.perspective = 'none';
            return;
        }

        const MAX_TILT = 12;
        const MAX_TRANSLATE = 6;
        let targetX = 0, targetY = 0, targetRotX = 0, targetRotY = 0;
        let currentX = 0, currentY = 0, currentRotX = 0, currentRotY = 0;
        let rafId = null;

        function animate() {
            currentRotY += (targetRotY - currentRotY) * 0.12;
            currentRotX += (targetRotX - currentRotX) * 0.12;
            currentX += (targetX - currentX) * 0.12;
            currentY += (targetY - currentY) * 0.12;

            if (image) {
                image.style.transform = `translate3d(${currentX}px, ${currentY}px, 8px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
                image.style.boxShadow = `${currentRotY * -0.8}px ${currentRotX * 0.8}px 30px rgba(0,0,0,0.42), 0 0 0 1px rgba(125,211,232,0.22), 0 0 24px rgba(0,180,216,0.10)`;
            }
            rafId = requestAnimationFrame(animate);
        }

        wrapper.addEventListener("mouseenter", () => {
            if (!rafId) rafId = requestAnimationFrame(animate);
        });

        wrapper.addEventListener("mousemove", (e) => {
            const rect = wrapper.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            
            const mx = (e.clientX - rect.left) / rect.width;
            const my = (e.clientY - rect.top) / rect.height;
            const nx = mx - 0.5;
            const ny = my - 0.5;
            
            targetRotY = nx * MAX_TILT;
            targetRotX = -ny * MAX_TILT;
            targetX = nx * MAX_TRANSLATE;
            targetY = ny * MAX_TRANSLATE;
            
            wrapper.style.setProperty("--mouse-x", `${mx * 100}%`);
            wrapper.style.setProperty("--mouse-y", `${my * 100}%`);
        });

        wrapper.addEventListener("mouseleave", () => {
            targetRotX = 0; targetRotY = 0; targetX = 0; targetY = 0;
            wrapper.style.setProperty("--mouse-x", "50%");
            wrapper.style.setProperty("--mouse-y", "50%");
        });

        if (!rafId) rafId = requestAnimationFrame(animate);
    }

    // ============================================================
    // 4. CONTACT RIPPLE EFFECT
    // ============================================================
    function initContactRipple() {
        if (!document.getElementById("ripple-keyframes")) {
            const style = document.createElement("style");
            style.id = "ripple-keyframes";
            style.textContent = `
                @keyframes contactRipple {
                    from { transform: scale(0); opacity: 1; }
                    to { transform: scale(2.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.querySelectorAll(".contact-inline-icon").forEach(btn => {
            btn.addEventListener("click", function(e) {
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const ripple = document.createElement("span");
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${e.clientX - rect.left - size/2}px;
                    top: ${e.clientY - rect.top - size/2}px;
                    border-radius: 50%;
                    background: rgba(110, 211, 235, 0.25);
                    transform: scale(0);
                    animation: contactRipple 0.6s ease-out;
                    pointer-events: none;
                `;
                btn.style.position = "relative";
                btn.style.overflow = "hidden";
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ============================================================
    // 5. EMAIL COPY ON RIGHT-CLICK
    // ============================================================
    function initEmailCopy() {
        const btn = document.querySelector('.contact-inline-icon[aria-label="Email"]');
        if (!btn) return;
        
        const email = btn.getAttribute("href")?.replace("mailto:", "") || "";
        if (!email) return;
        
        btn.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(email).then(() => {
                btn.style.background = "rgba(88,214,141,0.2)";
                btn.style.borderColor = "rgba(88,214,141,0.4)";
                setTimeout(() => { 
                    btn.style.background = ""; 
                    btn.style.borderColor = ""; 
                }, 800);
            }).catch(() => {});
        });
    }

    // ============================================================
    // 6. IMAGE FALLBACK
    // ============================================================
    function initImageFallback() {
        window.addEventListener("error", function(e) {
            if (e.target.tagName === "IMG") {
                const name = encodeURIComponent(e.target.alt || "User");
                e.target.src = `https://ui-avatars.com/api/?name=${name}&background=00b4d8&color=fff&size=200`;
            }
        }, true);
    }

    // ============================================================
    // 7. KEYBOARD NAVIGATION
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
    // 8. RESIZE HANDLER - جلوگیری از مشکلات موبایل
    // ============================================================
    function initResizeHandler() {
        let resizeTimer;
        window.addEventListener("resize", function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                const wrapper = document.querySelector(".profile-image-wrapper");
                const image = document.querySelector(".profile-image");
                const isMobile = window.innerWidth < 600;
                const isTouch = window.matchMedia("(pointer: coarse)").matches;
                
                if ((isMobile || isTouch) && wrapper && image) {
                    image.style.transform = 'none';
                    image.style.border = '2px solid rgba(125, 211, 232, 0.35)';
                    wrapper.style.perspective = 'none';
                }
            }, 300);
        });
    }

    // ============================================================
    // 9. INITIALIZATION
    // ============================================================
    function init() {
        initProfileTilt();
        setTimeout(animateProjectCounter, 300);
        initContactRipple();
        initEmailCopy();
        initImageFallback();
        initKeyboardNav();
        initResizeHandler();

        console.log("%c✅ Portfolio Ready %c| %cMobile Issues Fixed", 
            "color:#79d8ed;font-weight:bold;", 
            "color:#6b7280;", 
            "color:#8ddced;"
        );
    }

    // ============================================================
    // 10. DOM READY
    // ============================================================
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();