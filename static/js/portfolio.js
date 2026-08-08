/* ============================================
   PORTFOLIO JAVASCRIPT
   Premium Interactions & Smooth Animations
   Optimized for Performance & Beauty
   ============================================ */

/**
 * Tab Switching System
 * Switches between Education and Experience tabs with smooth icon transition
 */
function switchTab(tab) {
  const eduContent = document.getElementById('education-content');
  const expContent = document.getElementById('experience-content');
  const eduTab = document.getElementById('edu-tab');
  const expTab = document.getElementById('exp-tab');
  const tabIcon = document.getElementById('tab-icon');
  const tabTitle = document.getElementById('tab-title');
  
  if (!eduContent || !expContent || !eduTab || !expTab) return;
  
  // Add exit animation to active content
  const activeContent = document.querySelector('.tab-content.active');
  if (activeContent) {
    activeContent.style.opacity = '0';
    activeContent.style.transform = 'translateY(8px)';
  }
  
  setTimeout(() => {
    if (tab === 'education') {
      eduContent.classList.add('active');
      expContent.classList.remove('active');
      eduTab.classList.add('active');
      expTab.classList.remove('active');
      
      // Smooth icon transition
      if (tabIcon) {
        tabIcon.style.opacity = '0';
        tabIcon.style.transform = 'scale(0.8)';
        setTimeout(() => {
          tabIcon.className = 'fas fa-graduation-cap';
          tabIcon.style.opacity = '1';
          tabIcon.style.transform = 'scale(1)';
        }, 150);
      }
      
      if (tabTitle) {
        tabTitle.style.opacity = '0';
        setTimeout(() => {
          tabTitle.textContent = 'Education';
          tabTitle.style.opacity = '1';
        }, 150);
      }
    } else {
      expContent.classList.add('active');
      eduContent.classList.remove('active');
      expTab.classList.add('active');
      eduTab.classList.remove('active');
      
      // Smooth icon transition
      if (tabIcon) {
        tabIcon.style.opacity = '0';
        tabIcon.style.transform = 'scale(0.8)';
        setTimeout(() => {
          tabIcon.className = 'fas fa-briefcase';
          tabIcon.style.opacity = '1';
          tabIcon.style.transform = 'scale(1)';
        }, 150);
      }
      
      if (tabTitle) {
        tabTitle.style.opacity = '0';
        setTimeout(() => {
          tabTitle.textContent = 'Experience';
          tabTitle.style.opacity = '1';
        }, 150);
      }
    }
    
    // Animate new content in
    const newContent = document.querySelector('.tab-content.active');
    if (newContent) {
      newContent.style.opacity = '1';
      newContent.style.transform = 'translateY(0)';
    }
  }, 200);
}

/**
 * Initialize tab content transition properties
 */
function initTabTransitions() {
  document.querySelectorAll('.tab-content').forEach(content => {
    content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
  
  const tabIcon = document.getElementById('tab-icon');
  const tabTitle = document.getElementById('tab-title');
  
  if (tabIcon) {
    tabIcon.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  }
  
  if (tabTitle) {
    tabTitle.style.transition = 'opacity 0.3s ease';
  }
}

/**
 * Intersection Observer for elegant scroll-triggered animations
 */
function setupScrollAnimations() {
  // Only run if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.card-style, .summary, .profile-header, .project-card, .skill-tag').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return;
  }
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Animate elements with staggered delay
  const elementsToAnimate = document.querySelectorAll(
    '.card-style, .summary, .profile-header, .project-card, .skill-tag'
  );
  
  elementsToAnimate.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.03}s`;
    observer.observe(el);
  });
  
  // Fallback: show all after timeout
  setTimeout(() => {
    elementsToAnimate.forEach(el => {
      if (el.style.opacity === '0') {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }, 1500);
}

/**
 * Project Cards - Elegant Hover Effects (Desktop Only)
 */
function setupProjectHoverEffects() {
  // Only apply on devices with hover capability
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-6px)';
      this.style.boxShadow = '0 15px 35px rgba(0, 180, 255, 0.12), 0 0 0 1px rgba(0, 180, 255, 0.08) inset';
      this.style.borderColor = 'rgba(108, 211, 234, 0.25)';
      
      const externalIcon = this.querySelector('.external-icon');
      if (externalIcon) {
        externalIcon.style.opacity = '1';
        externalIcon.style.transform = 'translate(0, 0)';
      }
      
      const cardIcon = this.querySelector('.card-icon');
      if (cardIcon) {
        cardIcon.style.transform = 'scale(1.08)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
      this.style.borderColor = 'rgba(255, 255, 255, 0.06)';
      
      const externalIcon = this.querySelector('.external-icon');
      if (externalIcon) {
        externalIcon.style.opacity = '0.7';
        externalIcon.style.transform = 'translate(0, 0)';
      }
      
      const cardIcon = this.querySelector('.card-icon');
      if (cardIcon) {
        cardIcon.style.transform = 'scale(1)';
      }
    });
  });
}

/**
 * Skill Tags - Subtle Glow Effect on Hover
 */
function setupSkillInteractions() {
  const skillTags = document.querySelectorAll('.skill-tag');
  
  skillTags.forEach(tag => {
    tag.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.borderColor = 'rgba(110, 211, 235, 0.3)';
      this.style.boxShadow = '0 5px 15px rgba(0, 180, 255, 0.1)';
    });
    
    tag.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      this.style.boxShadow = '';
    });
  });
}

/**
 * Counter Animation for Project Count
 */
function animateProjectCounter() {
  const counter = document.querySelector('.project-count');
  if (!counter) return;
  
  const text = counter.textContent.trim();
  const match = text.match(/\d+/);
  if (!match) return;
  
  const targetNumber = parseInt(match[0]);
  const suffix = text.replace(match[0], '');
  
  // Don't animate if already visible
  if (counter.dataset.animated === 'true') return;
  counter.dataset.animated = 'true';
  
  let currentNumber = 0;
  const duration = 800;
  const steps = 20;
  const increment = Math.ceil(targetNumber / steps);
  const stepTime = duration / steps;
  
  const timer = setInterval(() => {
    currentNumber += increment;
    if (currentNumber >= targetNumber) {
      currentNumber = targetNumber;
      clearInterval(timer);
    }
    counter.textContent = `${currentNumber}${suffix}`;
  }, stepTime);
}

/**
 * Summary Section - Elegant Glow on Hover
 */
function setupSummaryGlow() {
  const summary = document.querySelector('.summary');
  if (!summary) return;
  
  summary.addEventListener('mouseenter', function() {
    this.style.boxShadow = '0 0 25px rgba(99, 207, 229, 0.15)';
    this.style.borderLeftColor = '#7bd8ed';
    this.style.transition = 'all 0.4s ease';
  });
  
  summary.addEventListener('mouseleave', function() {
    this.style.boxShadow = '';
    this.style.borderLeftColor = '#63cfe5';
  });
}

/**
 * Profile Image - Subtle 3D Effect on Mouse Move
 */
function setupProfileImageEffect() {
  const profileWrapper = document.querySelector('.profile-image-wrapper');
  const profileImage = document.querySelector('.profile-image');
  
  if (!profileImage || !profileWrapper) return;
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  
  profileWrapper.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 6;
    
    profileImage.style.transform = `perspective(400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    profileImage.style.transition = 'transform 0.1s ease';
  });
  
  profileWrapper.addEventListener('mouseleave', function() {
    profileImage.style.transform = 'perspective(400px) rotateX(0) rotateY(0) scale(1)';
    profileImage.style.transition = 'transform 0.4s ease';
  });
}

/**
 * Social Icons - Elegant Hover Effect
 */
function setupSocialIconsEffects() {
  const socialIcons = document.querySelectorAll('.social-icon-circle');
  
  socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
      this.style.boxShadow = '0 6px 15px rgba(0, 180, 255, 0.15)';
    });
    
    icon.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
}

/**
 * Keyboard Shortcuts
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ignore if typing in input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    
    switch(e.key.toLowerCase()) {
      case '1':
      case 'e':
        e.preventDefault();
        switchTab('education');
        break;
      case '2':
      case 'x':
        e.preventDefault();
        switchTab('experience');
        break;
    }
  });
}

/**
 * Handle window resize for responsive adjustments
 */
function handleResize() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    // Remove inline styles on resize to let CSS handle layout
    if (window.innerWidth < 900) {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.borderColor = '';
    }
  });
}

/**
 * Initialize Everything
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize tab transitions
  initTabTransitions();
  
  // Scroll-triggered animations
  setupScrollAnimations();
  
  // Project cards hover effects
  setupProjectHoverEffects();
  
  // Skill tags interactions
  setupSkillInteractions();
  
  // Counter animation with slight delay
  setTimeout(animateProjectCounter, 500);
  
  // Summary glow effect
  setupSummaryGlow();
  
  // Profile image 3D effect
  setupProfileImageEffect();
  
  // Social icons effects
  setupSocialIconsEffects();
  
  // Keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Handle resize
  window.addEventListener('resize', handleResize);
  
  // Performance: remove event listeners when page is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause heavy animations if needed
    }
  });
  
  console.log('✨ Portfolio initialized successfully');
  console.log('⌨️  Shortcuts: Press 1/E for Education | 2/X for Experience');
});

/**
 * Global error handling for images
 */
window.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG') {
    e.target.style.display = 'none';
    console.warn('Image failed to load:', e.target.src);
  }
}, true);

/**
 * Add smooth scroll behavior for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  });
});