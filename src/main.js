// Intersection Observer for Scroll Animations
const observeElements = () => {
  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const targets = document.querySelectorAll('.step-card, .stat-item, h2, .glass-panel');
  targets.forEach(target => {
    target.style.opacity = '0';
    observer.observe(target);
  });
};

// FAQ Accordion Logic
const initFAQ = () => {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      // Close other items
      faqItems.forEach(i => i.classList.remove('active'));
      
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
};

// Smooth Scrolling for Nav Links
const initSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  observeElements();
  initFAQ();
  initSmoothScroll();
});
