/* ============================================================
   PORTFOLIO JAVASCRIPT - Final Complete
   ============================================================ */

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
        if (tabIcon) tabIcon.className = 'fas fa-graduation-cap';
        if (tabTitle) tabTitle.textContent = 'Education';
    } else {
        expContent.classList.add('active');
        eduContent.classList.remove('active');
        expTab.classList.add('active');
        eduTab.classList.remove('active');
        if (tabIcon) tabIcon.className = 'fas fa-briefcase';
        if (tabTitle) tabTitle.textContent = 'Experience';
    }
}

function animateProjectCounter() {
    const counter = document.querySelector('.project-count');
    if (!counter) return;
    const text = counter.textContent.trim();
    const match = text.match(/\d+/);
    if (!match || counter.dataset.animated === 'true') return;
    counter.dataset.animated = 'true';
    const targetNumber = parseInt(match[0], 10);
    const suffix = text.replace(match[0], '');
    let currentNumber = 0;
    const steps = 10;
    const increment = Math.ceil(targetNumber / steps);
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) { currentNumber = targetNumber; clearInterval(timer); }
        counter.textContent = `${currentNumber}${suffix}`;
    }, 50);
}

function initProfileTilt() {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;

    const wrapper = document.querySelector('.profile-image-wrapper');
    const image = document.querySelector('.profile-image');
    if (!wrapper || !image) return;

    const MAX_TILT = 10;

    wrapper.addEventListener('mousemove', function(e) {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = x * (MAX_TILT * 2);
        const rotateX = -y * (MAX_TILT * 2);

        image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        image.style.boxShadow = `
            ${-x * 10}px ${y * 10}px 30px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(125, 211, 232, 0.22),
            0 0 35px rgba(0, 180, 216, 0.12)
        `;

        wrapper.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        wrapper.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height) * 100 + '%');
    });

    wrapper.addEventListener('mouseleave', function() {
        image.style.transform = 'rotateX(0deg) rotateY(0deg)';
        image.style.boxShadow = `
            0 10px 30px rgba(0, 0, 0, 0.40),
            0 0 0 1px rgba(125, 211, 232, 0.18),
            0 0 30px rgba(0, 180, 216, 0.10)
        `;
        wrapper.style.setProperty('--mouse-x', '50%');
        wrapper.style.setProperty('--mouse-y', '50%');
    });
}

function initContactRipple() {
    document.querySelectorAll('.contact-inline-icon').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                position:absolute; width:${size}px; height:${size}px;
                left:${e.clientX - rect.left - size/2}px; top:${e.clientY - rect.top - size/2}px;
                border-radius:50%; background:rgba(110,211,235,0.2);
                transform:scale(0); animation:contactRipple 0.6s ease-out; pointer-events:none;
            `;
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

function initEmailCopy() {
    const emailBtn = document.querySelector('.contact-inline-icon[aria-label="Email"]');
    if (!emailBtn) return;
    const email = emailBtn.getAttribute('href')?.replace('mailto:', '') || '';
    if (!email) return;
    emailBtn.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        navigator.clipboard.writeText(email).then(() => {
            emailBtn.style.background = 'rgba(88, 214, 141, 0.15)';
            emailBtn.style.borderColor = 'rgba(88, 214, 141, 0.3)';
            setTimeout(() => { emailBtn.style.background = ''; emailBtn.style.borderColor = ''; }, 800);
        }).catch(() => {});
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.tooltip').forEach(el => el.remove());
    initProfileTilt();
    setTimeout(animateProjectCounter, 300);
    initContactRipple();
    initEmailCopy();

    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
        if (e.key === '1' || e.key.toLowerCase() === 'e') { e.preventDefault(); switchTab('education'); }
        else if (e.key === '2' || e.key.toLowerCase() === 'x') { e.preventDefault(); switchTab('experience'); }
    });

    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(e.target.alt || 'User') + '&background=00b4d8&color=fff&size=200';
        }
    }, true);

    const style = document.createElement('style');
    style.textContent = '@keyframes contactRipple{from{transform:scale(0);opacity:1}to{transform:scale(2.5);opacity:0}}';
    document.head.appendChild(style);

    console.log('%c✅ Portfolio Ready %c| %c3D Tilt Active', 'color:#79d8ed;font-weight:bold;', 'color:#6b7280;', 'color:#8ddced;');
});