/* ============================================================
PORTFOLIO JAVASCRIPT
Stable • Lightweight • Responsive
3D Profile Image Tilt
============================================================ */

"use strict";

/* ============================================================
TAB SWITCHING
============================================================ */

function switchTab(tab) {


const eduContent =
    document.getElementById("education-content");

const expContent =
    document.getElementById("experience-content");

const eduTab =
    document.getElementById("edu-tab");

const expTab =
    document.getElementById("exp-tab");

const tabIcon =
    document.getElementById("tab-icon");

const tabTitle =
    document.getElementById("tab-title");

if (
    !eduContent ||
    !expContent ||
    !eduTab ||
    !expTab
) {
    return;
}

if (tab === "education") {

    eduContent.classList.add("active");
    expContent.classList.remove("active");

    eduTab.classList.add("active");
    expTab.classList.remove("active");

    if (tabIcon) {
        tabIcon.className =
            "fas fa-graduation-cap";
    }

    if (tabTitle) {
        tabTitle.textContent =
            "Education";
    }

} else {

    expContent.classList.add("active");
    eduContent.classList.remove("active");

    expTab.classList.add("active");
    eduTab.classList.remove("active");

    if (tabIcon) {
        tabIcon.className =
            "fas fa-briefcase";
    }

    if (tabTitle) {
        tabTitle.textContent =
            "Experience";
    }
}


}

/* ============================================================
PROJECT COUNTER
============================================================ */

function animateProjectCounter() {


const counter =
    document.querySelector(".project-count");

if (!counter) {
    return;
}

if (counter.dataset.animated === "true") {
    return;
}

const text =
    counter.textContent.trim();

const match =
    text.match(/\d+/);

if (!match) {
    return;
}

counter.dataset.animated = "true";

const target =
    parseInt(match[0], 10);

const suffix =
    text.replace(match[0], "");

if (!Number.isFinite(target)) {
    return;
}

let current = 0;

const duration = 450;

const startTime = performance.now();

function update(now) {

    const progress =
        Math.min(
            (now - startTime) / duration,
            1
        );

    const eased =
        1 - Math.pow(1 - progress, 3);

    current =
        Math.floor(target * eased);

    counter.textContent =
        `${current}${suffix}`;

    if (progress < 1) {
        requestAnimationFrame(update);
    } else {
        counter.textContent =
            `${target}${suffix}`;
    }
}

requestAnimationFrame(update);


}

/* ============================================================
CONTACT RIPPLE
============================================================ */

function initContactRipple() {


const buttons =
    document.querySelectorAll(
        ".contact-item-icon-only"
    );

if (!buttons.length) {
    return;
}

buttons.forEach(button => {

    button.addEventListener(
        "click",
        function (event) {

            const rect =
                button.getBoundingClientRect();

            const size =
                Math.max(
                    rect.width,
                    rect.height
                );

            const x =
                event.clientX -
                rect.left -
                size / 2;

            const y =
                event.clientY -
                rect.top -
                size / 2;

            const ripple =
                document.createElement("span");

            ripple.className =
                "contact-ripple";

            ripple.style.width =
                `${size}px`;

            ripple.style.height =
                `${size}px`;

            ripple.style.left =
                `${x}px`;

            ripple.style.top =
                `${y}px`;

            button.appendChild(ripple);

            window.setTimeout(
                () => ripple.remove(),
                600
            );
        }
    );
});


}

/* ============================================================
CONTACT TOOLTIPS
============================================================ */

function initContactTooltips() {


const supportsTouch =
    window.matchMedia(
        "(hover: none)"
    ).matches;

if (supportsTouch) {
    return;
}

const buttons =
    document.querySelectorAll(
        ".contact-item-icon-only"
    );

if (!buttons.length) {
    return;
}

buttons.forEach(button => {

    const text =
        button.getAttribute("title");

    if (!text) {
        return;
    }

    button.addEventListener(
        "mouseenter",
        () => {

            const old =
                button.querySelector(
                    ".contact-tooltip-dynamic"
                );

            if (old) {
                old.remove();
            }

            const tooltip =
                document.createElement("span");

            tooltip.className =
                "contact-tooltip-dynamic";

            tooltip.textContent = text;

            button.appendChild(tooltip);
        }
    );

    button.addEventListener(
        "mouseleave",
        () => {

            const tooltip =
                button.querySelector(
                    ".contact-tooltip-dynamic"
                );

            if (tooltip) {
                tooltip.remove();
            }
        }
    );
});


}

/* ============================================================
EMAIL COPY
Mobile long press
Desktop right click
============================================================ */

function initLongPressCopy() {


const emailButton =
    document.querySelector(
        '.contact-item-icon-only[aria-label="Email"]'
    );

if (!emailButton) {
    return;
}

const href =
    emailButton.getAttribute("href");

if (!href) {
    return;
}

const email =
    href.replace(/^mailto:/i, "");

if (!email) {
    return;
}

let timer = null;

function copyEmail() {

    if (
        !navigator.clipboard ||
        !navigator.clipboard.writeText
    ) {
        return;
    }

    navigator.clipboard
        .writeText(email)
        .then(showCopyFeedback)
        .catch(() => {});
}

emailButton.addEventListener(
    "touchstart",
    () => {

        timer =
            window.setTimeout(
                copyEmail,
                800
            );
    },
    {
        passive: true
    }
);

emailButton.addEventListener(
    "touchend",
    () => {
        clearTimeout(timer);
    }
);

emailButton.addEventListener(
    "touchmove",
    () => {
        clearTimeout(timer);
    }
);

emailButton.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

        copyEmail();
    }
);


}

function showCopyFeedback() {


const old =
    document.querySelector(
        ".copy-feedback"
    );

if (old) {
    old.remove();
}

const feedback =
    document.createElement("div");

feedback.className =
    "copy-feedback";

feedback.textContent =
    "Email copied!";

document.body.appendChild(feedback);

window.setTimeout(
    () => feedback.remove(),
    2000
);


}

/* ============================================================
PROFILE IMAGE 3D TILT
============================================================ */

function initProfileTilt() {


const wrapper =
    document.querySelector(
        ".profile-image-wrapper"
    );

const image =
    document.querySelector(
        ".profile-image"
    );

if (!wrapper || !image) {
    return;
}

const media =
    window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    );

if (!media.matches) {
    return;
}

const MAX_TILT = 10;

let frame = null;

let mouseX = 0;
let mouseY = 0;

function updateTilt() {

    frame = null;

    const rect =
        wrapper.getBoundingClientRect();

    if (
        rect.width === 0 ||
        rect.height === 0
    ) {
        return;
    }

    const x =
        (mouseX - rect.left) /
        rect.width -
        0.5;

    const y =
        (mouseY - rect.top) /
        rect.height -
        0.5;

    const rotateY =
        x * MAX_TILT * 2;

    const rotateX =
        -y * MAX_TILT * 2;

    image.style.transform =
        `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    const shadowX =
        -x * 8;

    const shadowY =
        y * 8;

    image.style.boxShadow =
        `
        ${shadowX}px ${shadowY}px 28px rgba(0,0,0,0.42),
        0 0 0 1px rgba(125,211,232,0.22),
        0 0 30px rgba(0,180,216,0.12)
        `;

    wrapper.style.setProperty(
        "--mouse-x",
        `${(x + 0.5) * 100}%`
    );

    wrapper.style.setProperty(
        "--mouse-y",
        `${(y + 0.5) * 100}%`
    );
}

wrapper.addEventListener(
    "mousemove",
    event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        if (!frame) {
            frame =
                requestAnimationFrame(
                    updateTilt
                );
        }
    }
);

wrapper.addEventListener(
    "mouseenter",
    () => {

        image.style.transition =
            "transform 0.08s ease-out, box-shadow 0.08s ease";

        wrapper.style.setProperty(
            "--mouse-x",
            "50%"
        );

        wrapper.style.setProperty(
            "--mouse-y",
            "50%"
        );
    }
);

wrapper.addEventListener(
    "mouseleave",
    () => {

        if (frame) {
            cancelAnimationFrame(frame);
            frame = null;
        }

        image.style.transform =
            "rotateX(0deg) rotateY(0deg)";

        image.style.boxShadow =
            `
            0 0 0 1px rgba(125,211,232,0.18),
            0 0 30px rgba(0,180,216,0.10),
            0 10px 30px rgba(0,0,0,0.40)
            `;

        image.style.transition =
            "transform 0.22s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.22s ease";

        wrapper.style.setProperty(
            "--mouse-x",
            "50%"
        );

        wrapper.style.setProperty(
            "--mouse-y",
            "50%"
        );
    }
);


}

/* ============================================================
KEYBOARD SHORTCUTS
============================================================ */

function initKeyboardShortcuts() {


document.addEventListener(
    "keydown",
    event => {

        const target =
            event.target;

        if (
            target &&
            (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            )
        ) {
            return;
        }

        const key =
            event.key.toLowerCase();

        if (
            key === "1" ||
            key === "e"
        ) {

            event.preventDefault();

            switchTab("education");

        } else if (
            key === "2" ||
            key === "x"
        ) {

            event.preventDefault();

            switchTab("experience");
        }
    }
);


}

/* ============================================================
SMOOTH ANCHOR SCROLL
============================================================ */

function initSmoothScroll() {


document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            event => {

                const id =
                    anchor.getAttribute(
                        "href"
                    );

                if (
                    !id ||
                    id === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        id
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });
            }
        );
    });


}

/* ============================================================
IMAGE FALLBACK
============================================================ */

function initImageFallback() {


window.addEventListener(
    "error",
    event => {

        const image =
            event.target;

        if (
            !image ||
            image.tagName !== "IMG"
        ) {
            return;
        }

        if (
            image.dataset
                .fallbackApplied === "true"
        ) {
            return;
        }

        image.dataset
            .fallbackApplied =
            "true";

        const name =
            image.alt ||
            "User";

        image.src =
            "https://ui-avatars.com/api/?" +
            "name=" +
            encodeURIComponent(name) +
            "&background=00b4d8" +
            "&color=fff" +
            "&size=256" +
            "&format=png";
    },
    true
);


}

/* ============================================================
REMOVE OLD TOOLTIP ELEMENTS
============================================================ */

function removeOldTooltips() {


document
    .querySelectorAll(".tooltip")
    .forEach(element => {
        element.remove();
    });


}

/* ============================================================
DYNAMIC CONTACT STYLES
============================================================ */

function injectDynamicStyles() {


if (
    document.getElementById(
        "portfolio-dynamic-styles"
    )
) {
    return;
}

const style =
    document.createElement("style");

style.id =
    "portfolio-dynamic-styles";

style.textContent = `

    .contact-item-icon-only {
        position: relative;
        overflow: hidden;
    }

    .contact-ripple {
        position: absolute;

        border-radius: 50%;

        background:
            rgba(110,211,235,0.2);

        transform: scale(0);

        pointer-events: none;

        animation:
            contactRipple 0.6s ease-out;
    }

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

    .contact-tooltip-dynamic {
        position: absolute;

        bottom: -32px;
        left: 50%;

        transform:
            translateX(-50%);

        padding:
            4px 10px;

        border-radius: 6px;

        background:
            rgba(15,18,28,0.96);

        color: #e8edf3;

        font-size: 0.65rem;

        white-space: nowrap;

        border:
            1px solid rgba(110,211,235,0.2);

        z-index: 9999;

        pointer-events: none;

        animation:
            tooltipIn 0.18s ease;
    }

    @keyframes tooltipIn {

        from {
            opacity: 0;

            transform:
                translateX(-50%)
                translateY(4px);
        }

        to {
            opacity: 1;

            transform:
                translateX(-50%)
                translateY(0);
        }
    }

    .copy-feedback {
        position: fixed;

        left: 50%;
        bottom: 20px;

        transform:
            translateX(-50%);

        z-index: 99999;

        padding:
            8px 16px;

        border-radius: 20px;

        background:
            rgba(88,214,141,0.95);

        color: #111;

        font-size: 0.75rem;

        font-weight: 600;

        box-shadow:
            0 8px 25px rgba(0,0,0,0.3);

        animation:
            copyFeedback 2s ease forwards;
    }

    @keyframes copyFeedback {

        0% {
            opacity: 0;

            transform:
                translateX(-50%)
                translateY(10px);
        }

        15% {
            opacity: 1;

            transform:
                translateX(-50%)
                translateY(0);
        }

        75% {
            opacity: 1;
        }

        100% {
            opacity: 0;

            transform:
                translateX(-50%)
                translateY(-10px);
        }
    }

`;

document.head.appendChild(style);


}

/* ============================================================
INITIALIZE
============================================================ */

document.addEventListener(
"DOMContentLoaded",
() => {


    removeOldTooltips();

    injectDynamicStyles();

    setTimeout(
        animateProjectCounter,
        250
    );

    initContactRipple();

    initContactTooltips();

    initLongPressCopy();

    initProfileTilt();

    initKeyboardShortcuts();

    initSmoothScroll();

    initImageFallback();

    console.log(
        "%cPortfolio Loaded Successfully",
        "color:#79d8ed;font-weight:bold;"
    );

    console.log(
        "%c3D Profile Tilt: Enabled",
        "color:#8ddced;"
    );
}


);
