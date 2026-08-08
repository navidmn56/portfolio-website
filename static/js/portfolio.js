/* ============================================================
   PORTFOLIO JAVASCRIPT
   Production Ready
   Lightweight / Accessible / Mobile Friendly
   ============================================================ */

"use strict";


/* ============================================================
   TAB SYSTEM
   ============================================================ */

function switchTab(tabName) {

    const tabs = {
        education: {
            button: document.getElementById("edu-tab"),
            content: document.getElementById("education-content"),
            title: "Education",
            icon: "fas fa-graduation-cap"
        },

        experience: {
            button: document.getElementById("exp-tab"),
            content: document.getElementById("experience-content"),
            title: "Experience",
            icon: "fas fa-briefcase"
        }
    };

    const selected = tabs[tabName];

    if (!selected) {
        return;
    }

    const tabIcon = document.getElementById("tab-icon");
    const tabTitle = document.getElementById("tab-title");

    Object.values(tabs).forEach(tab => {

        if (!tab.button || !tab.content) {
            return;
        }

        const isActive = tab === selected;

        tab.button.classList.toggle("active", isActive);
        tab.button.setAttribute(
            "aria-selected",
            String(isActive)
        );

        tab.content.classList.toggle(
            "active",
            isActive
        );

        tab.content.hidden = !isActive;
    });

    if (tabIcon) {
        tabIcon.className = selected.icon;
    }

    if (tabTitle) {
        tabTitle.textContent = selected.title;
    }
}


/* ============================================================
   INITIALIZE TABS
   ============================================================ */

function initializeTabs() {

    const buttons = document.querySelectorAll(
        ".tab-btn[data-tab]"
    );

    if (!buttons.length) {
        return;
    }

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const tabName = button.dataset.tab;

            switchTab(tabName);

        });

    });


    /* Keyboard navigation */

    buttons.forEach(button => {

        button.addEventListener("keydown", event => {

            if (
                event.key !== "ArrowLeft" &&
                event.key !== "ArrowRight"
            ) {
                return;
            }

            event.preventDefault();

            const currentIndex =
                Array.from(buttons).indexOf(button);

            let nextIndex;

            if (event.key === "ArrowRight") {
                nextIndex =
                    (currentIndex + 1) % buttons.length;
            } else {
                nextIndex =
                    (currentIndex - 1 + buttons.length) %
                    buttons.length;
            }

            const nextButton = buttons[nextIndex];

            if (!nextButton) {
                return;
            }

            nextButton.focus();

            switchTab(nextButton.dataset.tab);

        });

    });

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

    const originalText =
        counter.textContent.trim();

    const match =
        originalText.match(/\d+/);

    if (!match) {
        return;
    }

    const target =
        Number.parseInt(
            match[0],
            10
        );

    if (
        Number.isNaN(target) ||
        target <= 0
    ) {
        return;
    }

    const suffix =
        originalText
            .replace(match[0], "")
            .trim();

    counter.dataset.animated = "true";

    let current = 0;

    const duration = 450;
    const startTime = performance.now();

    function updateCounter(timestamp) {

        const elapsed =
            timestamp - startTime;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const eased =
            1 - Math.pow(1 - progress, 3);

        current =
            Math.floor(target * eased);

        counter.textContent =
            `${current} ${suffix}`;

        if (progress < 1) {

            requestAnimationFrame(
                updateCounter
            );

        } else {

            counter.textContent =
                `${target} ${suffix}`;
        }
    }

    requestAnimationFrame(updateCounter);
}


/* ============================================================
   EXTERNAL LINKS
   ============================================================ */

function initializeExternalLinks() {

    const links =
        document.querySelectorAll(
            'a[target="_blank"]'
        );

    links.forEach(link => {

        if (!link.rel.includes("noopener")) {
            link.rel = "noopener noreferrer";
        }

    });

}


/* ============================================================
   IMAGE FALLBACK
   ============================================================ */

function initializeImageFallback() {

    const images =
        document.querySelectorAll(
            ".profile-image"
        );

    images.forEach(image => {

        image.addEventListener(
            "error",
            function handleImageError() {

                if (
                    this.dataset.fallbackApplied === "true"
                ) {
                    return;
                }

                this.dataset.fallbackApplied = "true";

                const name =
                    this.alt || "User";

                this.src =
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=101820&color=79d9ee&size=256&font-size=0.38&bold=true&format=png`;

            },
            {
                once: true
            }
        );

    });

}


/* ============================================================
   INTERNAL HASH LINKS
   ============================================================ */

function initializeHashLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    links.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const selector =
                    link.getAttribute("href");

                if (
                    !selector ||
                    selector === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(selector);

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
   KEYBOARD SHORTCUTS
   ============================================================ */

function initializeKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            const target =
                event.target;

            if (
                target instanceof HTMLInputElement ||
                target instanceof HTMLTextAreaElement ||
                target instanceof HTMLSelectElement ||
                target.isContentEditable
            ) {
                return;
            }

            if (
                event.ctrlKey ||
                event.metaKey ||
                event.altKey
            ) {
                return;
            }

            switch (
                event.key.toLowerCase()
            ) {

                case "1":
                case "e":

                    switchTab("education");
                    break;

                case "2":
                case "x":

                    switchTab("experience");
                    break;

                default:
                    break;
            }

        }
    );

}


/* ============================================================
   CONTACT LINK FEEDBACK
   ============================================================ */

function initializeContactLinks() {

    const contactLinks =
        document.querySelectorAll(
            ".contact-card[href]"
        );

    contactLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                link.classList.add(
                    "contact-clicked"
                );

                window.setTimeout(
                    () => {
                        link.classList.remove(
                            "contact-clicked"
                        );
                    },
                    350
                );

            }
        );

    });

}


/* ============================================================
   INITIALIZATION
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTabs();

        initializeExternalLinks();

        initializeImageFallback();

        initializeHashLinks();

        initializeKeyboardShortcuts();

        initializeContactLinks();

        /*
         * Counter is intentionally delayed slightly
         * so it does not compete with initial rendering.
         */
        window.setTimeout(
            animateProjectCounter,
            250
        );

    }
);