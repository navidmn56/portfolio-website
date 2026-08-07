/* ============================================
   PORTFOLIO JAVASCRIPT
   Smooth Animations & Interactions
   ============================================ */

/**
 * Tab Switching System
 * Switches between Education and Experience tabs
 */
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

/**
 * Intersection Observer for scroll-triggered animations
 */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe cards and sections
  const elementsToAnimate = document.querySelectorAll(
    '.card-style, .summary, .profile-header, .project-card, .skill-tag'
  );
  
  elementsToAnimate.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.04}s`;
    observer.observe(el);
  });
}

/**
 * Make elements visible when they have 'animated' class
 */
function setupAnimationClass() {
  const style = document.createElement('style');
  style.textContent = `
    .animated {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
  
  // Fallback: animate all after 300ms if IntersectionObserver not supported
  setTimeout(() => {
    document.querySelectorAll('.card-style, .summary, .profile-header, .project-card, .skill-tag').forEach(el => {
      if (el.style.opacity === '0') {
        el.classList.add('animated');
      }
    });
  }, 500);
}

/**
 * Project Card - Smooth Hover Effect (no tilt)
 */
function setupProjectHoverEffects() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // حذف transform قبلی
      this.style.transition = 'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)';
      this.style.transform = 'translateY(-8px)';
      this.style.boxShadow = '0 20px 40px rgba(0, 180, 255, 0.15), 0 0 0 1px rgba(0, 180, 255, 0.1) inset';
      this.style.borderColor = 'rgba(0, 180, 255, 0.4)';
      this.style.background = 'rgba(255, 255, 255, 0.07)';
      
      // Show external icon
      const externalIcon = this.querySelector('.external-icon');
      if (externalIcon) {
        externalIcon.style.opacity = '1';
        externalIcon.style.transform = 'translate(0, 0)';
      }
      
      // Scale card icon
      const cardIcon = this.querySelector('.card-icon');
      if (cardIcon) {
        cardIcon.style.transform = 'scale(1.1)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
      this.style.borderColor = 'rgba(255, 255, 255, 0.04)';
      this.style.background = 'rgba(255, 255, 255, 0.03)';
      
      // Hide external icon
      const externalIcon = this.querySelector('.external-icon');
      if (externalIcon) {
        externalIcon.style.opacity = '0';
        externalIcon.style.transform = 'translate(-5px, 5px)';
      }
      
      // Reset card icon
      const cardIcon = this.querySelector('.card-icon');
      if (cardIcon) {
        cardIcon.style.transform = 'scale(1)';
      }
    });
  });
}

/**
 * Skill Tags - Ripple Effect on Hover
 */
function setupSkillRippleEffect() {
  const skillTags = document.querySelectorAll('.skill-tag');
  
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(102, 217, 255, 0.25);
        border-radius: 50%;
        pointer-events: none;
        animation: rippleAnimation 0.7s ease-out forwards;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/**
 * Counter Animation for Project Count
 */
function animateProjectCounter() {
  const counter = document.querySelector('.project-count');
  if (!counter) return;
  
  const text = counter.textContent;
  const match = text.match(/\d+/);
  if (!match) return;
  
  const targetNumber = parseInt(match[0]);
  let currentNumber = 0;
  const duration = 1000;
  const steps = 30;
  const increment = Math.ceil(targetNumber / steps);
  const stepTime = duration / steps;
  
  const timer = setInterval(() => {
    currentNumber += increment;
    if (currentNumber >= targetNumber) {
      currentNumber = targetNumber;
      clearInterval(timer);
    }
    counter.textContent = `${currentNumber} Project${currentNumber !== 1 ? 's' : ''}`;
  }, stepTime);
}

/**
 * Summary Section - Glow Pulse on Hover
 */
function setupSummaryGlow() {
  const summary = document.querySelector('.summary');
  if (!summary) return;
  
  summary.addEventListener('mouseenter', function() {
    this.style.boxShadow = '0 0 30px rgba(0, 200, 255, 0.2)';
    this.style.borderLeftColor = '#00e5ff';
  });
  
  summary.addEventListener('mouseleave', function() {
    this.style.boxShadow = '';
    this.style.borderLeftColor = '#00b4d8';
  });
}

/**
 * Profile Image - 3D Rotation on Hover
 */
function setupProfileImageEffect() {
  const profileImage = document.querySelector('.profile-image');
  if (!profileImage) return;
  
  profileImage.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;
    
    this.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
  
  profileImage.addEventListener('mouseleave', function() {
    this.style.transform = 'perspective(500px) rotateX(0) rotateY(0) scale(1)';
  });
}

/**
 * Keyboard Shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Only if not typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch(e.key) {
      case '1':
        switchTab('education');
        break;
      case '2':
        switchTab('experience');
        break;
      case 'e':
        switchTab('education');
        break;
      case 'x':
        switchTab('experience');
        break;
    }
  });
}

/**
 * Initialize Everything
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // Setup CSS animation class
  setupAnimationClass();
  
  // Scroll-triggered animations
  setupScrollAnimations();
  
  // Project cards - smooth hover
  setupProjectHoverEffects();
  
  // Skill tags - ripple effect
  setupSkillRippleEffect();
  
  // Counter animation
  setTimeout(animateProjectCounter, 600);
  
  // Summary glow
  setupSummaryGlow();
  
  // Profile image 3D effect
  setupProfileImageEffect();
  
  // Keyboard shortcuts
  setupKeyboardShortcuts();
  
  console.log('✨ Portfolio loaded successfully!');
  console.log('⌨️  Shortcuts: Press 1/E for Education | 2/X for Experience');
});

// Add ripple animation keyframes
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnimation {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }
`;
document.head.appendChild(rippleStyle);