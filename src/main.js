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
  initBookingSystem();
});

// Booking System Logic
const initBookingSystem = () => {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzLAXdnejFicwauzJs-2cyEycV1LdGqF9BmczASaDZd4LDw7CwPRnxMqcr1vaaHwWe_mA/exec';

  let selectedDate = 'March 10, 2026'; // Default selected
  let selectedTime = null;

  // Date Selection
  const dates = document.querySelectorAll('.date-cell.active, .date-cell.selected');
  dates.forEach(date => {
    date.addEventListener('click', () => {
      dates.forEach(d => d.classList.remove('selected'));
      date.classList.add('selected');
      selectedDate = `March ${date.textContent.trim()}, 2026`;
    });
  });

  // Time Selection
  const times = document.querySelectorAll('.time-slot');
  times.forEach(time => {
    time.addEventListener('click', () => {
      times.forEach(t => t.classList.remove('selected'));
      time.classList.add('selected');
      selectedTime = time.textContent.trim();
    });
  });

  // Form Submission
  const confirmBtn = document.getElementById('confirm-booking');
  confirmBtn.addEventListener('click', async () => {
    const name = document.getElementById('user-name').value;
    const business = document.getElementById('business-name').value;
    const email = document.getElementById('user-email').value;

    // Get checked problems
    const problems = Array.from(document.querySelectorAll('.problem-pills input:checked'))
      .map(input => input.nextElementSibling.textContent.trim())
      .join(', ');

    if (!name || !email) {
      alert('Please fill out your name and email.');
      return;
    }

    if (!selectedTime) {
      alert('Please select a time slot.');
      return;
    }

    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Sending...';

    const formData = new URLSearchParams();
    formData.append('Timestamp', new Date().toLocaleString());
    formData.append('Name', name);
    formData.append('Business', business);
    formData.append('Email', email);
    formData.append('Problems', problems);
    formData.append('Date', selectedDate);
    formData.append('Time', selectedTime);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Google Script requires no-cors if not using complex CORS setup
      });

      alert('Success! Your booking has been recorded in our Google Sheet.');
      document.getElementById('booking-modal').classList.remove('active');
      document.body.style.overflow = 'auto';

      // Reset form
      document.getElementById('user-name').value = '';
      document.getElementById('business-name').value = '';
      document.getElementById('user-email').value = '';
      document.querySelectorAll('.problem-pills input:checked').forEach(i => i.checked = false);
      times.forEach(t => t.classList.remove('selected'));
      selectedTime = null;

    } catch (error) {
      console.error('Error!', error.message);
      alert('Something went wrong. Please try again.');
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm Booking →';
    }
  });
};
