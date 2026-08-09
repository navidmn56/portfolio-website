(function () {
    "use strict";

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

    function animateProjectCounter() {
        const counter = document.querySelector(".project-count");
        if (!counter) return;
        const text = counter.textContent.trim();
        const match = text.match(/\d+/);
        if (!match || counter.dataset.animated === "true") return;
        counter.dataset.animated = "true";
        const targetNumber = parseInt(match[0], 10);
        const suffix = text.replace(match[0], "");
        let currentNumber = 0;
        const timer = setInterval(() => {
            currentNumber += Math.ceil(targetNumber / 10);
            if (currentNumber >= targetNumber) { currentNumber = targetNumber; clearInterval(timer); }
            counter.textContent = `${currentNumber}${suffix}`;
        }, 50);
    }

    function initProfileTilt() {
        const wrapper = document.querySelector(".profile-image-wrapper");
        const image = document.querySelector(".profile-image");
        if (!wrapper || !image) return;
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const MAX_TILT = 14, MAX_TRANSLATE = 8;
        let tx = 0, ty = 0, trx = 0, try2 = 0;
        let ctx = 0, cty = 0, crx = 0, cry = 0;
        let frame = null;

        function anim() {
            crx += (trx - crx) * 0.12; cry += (try2 - cry) * 0.12;
            ctx += (tx - ctx) * 0.12; cty += (ty - cty) * 0.12;
            image.style.transform = `translate3d(${ctx}px,${cty}px,8px) rotateX(${crx}deg) rotateY(${cry}deg)`;
            image.style.boxShadow = `${cry*-0.8}px ${crx*0.8}px 30px rgba(0,0,0,0.42), 0 0 0 1px rgba(125,211,232,0.22), 0 0 24px rgba(0,180,216,0.10)`;
            frame = requestAnimationFrame(anim);
        }

        wrapper.addEventListener("mouseenter", () => { if(!frame) frame=requestAnimationFrame(anim); });
        wrapper.addEventListener("mousemove", (e) => {
            const r = wrapper.getBoundingClientRect();
            if(!r.width||!r.height) return;
            const mx=(e.clientX-r.left)/r.width, my=(e.clientY-r.top)/r.height;
            const nx=mx-0.5, ny=my-0.5;
            try2=nx*MAX_TILT; trx=-ny*MAX_TILT;
            tx=nx*MAX_TRANSLATE; ty=ny*MAX_TRANSLATE;
            wrapper.style.setProperty("--mouse-x",`${mx*100}%`);
            wrapper.style.setProperty("--mouse-y",`${my*100}%`);
        });
        wrapper.addEventListener("mouseleave", () => {
            trx=0; try2=0; tx=0; ty=0;
            wrapper.style.setProperty("--mouse-x","50%");
            wrapper.style.setProperty("--mouse-y","50%");
        });
        if(!frame) frame=requestAnimationFrame(anim);
    }

    function initContactRipple() {
        document.querySelectorAll(".contact-inline-icon").forEach(b => {
            b.addEventListener("click", function(e) {
                const r=b.getBoundingClientRect(), s=Math.max(r.width,r.height);
                const rip=document.createElement("span");
                rip.style.cssText=`position:absolute;width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px;border-radius:50%;background:rgba(110,211,235,0.2);transform:scale(0);animation:contactRipple 0.6s ease-out;pointer-events:none;`;
                b.style.position="relative"; b.style.overflow="hidden";
                b.appendChild(rip); setTimeout(()=>rip.remove(),600);
            });
        });
    }

    function initEmailCopy() {
        const b=document.querySelector('.contact-inline-icon[aria-label="Email"]');
        if(!b) return;
        const em=b.getAttribute("href")?.replace("mailto:","")||"";
        if(!em) return;
        b.addEventListener("contextmenu",function(e){e.preventDefault();navigator.clipboard.writeText(em).then(()=>{b.style.background="rgba(88,214,141,0.15)";b.style.borderColor="rgba(88,214,141,0.3)";setTimeout(()=>{b.style.background="";b.style.borderColor="";},800);}).catch(()=>{});});
    }

    function init() {
        document.querySelectorAll(".tooltip").forEach(e=>e.remove());
        initProfileTilt();
        setTimeout(animateProjectCounter,300);
        initContactRipple();
        initEmailCopy();
        document.addEventListener("keydown",function(e){if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA"||e.target.isContentEditable)return;if(e.key==="1"||e.key.toLowerCase()==="e"){e.preventDefault();window.switchTab("education");}else if(e.key==="2"||e.key.toLowerCase()==="x"){e.preventDefault();window.switchTab("experience");}});
        window.addEventListener("error",function(e){if(e.target.tagName==="IMG"){e.target.src="https://ui-avatars.com/api/?name="+encodeURIComponent(e.target.alt||"User")+"&background=00b4d8&color=fff&size=200";}},true);
        const s=document.createElement("style"); s.textContent="@keyframes contactRipple{from{transform:scale(0);opacity:1}to{transform:scale(2.5);opacity:0}}"; document.head.appendChild(s);
        console.log("%c✅ Portfolio Ready %c| %c3D Tilt Active","color:#79d8ed;font-weight:bold;","color:#6b7280;","color:#8ddced;");
    }

    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init);
    else init();
})();