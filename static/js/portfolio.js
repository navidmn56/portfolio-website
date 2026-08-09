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

function initProfileTilt() {
    const wrapper = document.querySelector('.profile-image-wrapper');
    const image = document.querySelector('.profile-image');
    if (!wrapper || !image) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    wrapper.addEventListener('mousemove', function(e) {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        image.style.transform = `translateZ(8px) rotateX(${-y*20}deg) rotateY(${x*20}deg)`;
        image.style.boxShadow = `${-x*10}px ${y*10}px 30px rgba(0,0,0,0.45), 0 0 0 1px rgba(125,211,232,0.22)`;
        wrapper.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width) * 100 + '%');
        wrapper.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height) * 100 + '%');
    });

    wrapper.addEventListener('mouseleave', function() {
        image.style.transform = 'translateZ(8px) rotateX(0deg) rotateY(0deg)';
        image.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(125,211,232,0.18)';
        wrapper.style.setProperty('--mouse-x', '50%');
        wrapper.style.setProperty('--mouse-y', '50%');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initProfileTilt();
    console.log('✅ 3D Tilt Ready');
});