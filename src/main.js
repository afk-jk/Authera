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
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzX7kcIgef9Kk0q_b6MTASh66SgCcHnaM7fhC81ZK0dcN1vxoBxtn9WTmp-crMaRkVp9Q/exec';

  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  let selectedDateObj = null;
  let selectedTime = null;

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const monthYearLabel = document.getElementById('current-month-year');
  const calendarGrid = document.getElementById('calendar-grid-days');
  const timeGrid = document.getElementById('time-grid-slots');

  const renderCalendar = () => {
    calendarGrid.innerHTML = `
      <div class="day-label">Sun</div>
      <div class="day-label">Mon</div>
      <div class="day-label">Tue</div>
      <div class="day-label">Wed</div>
      <div class="day-label">Thu</div>
      <div class="day-label">Fri</div>
      <div class="day-label">Sat</div>
    `;

    monthYearLabel.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Padding empty days
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'date-cell';
      emptyDiv.style.visibility = 'hidden';
      calendarGrid.appendChild(emptyDiv);
    }

    // Actual days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateCell = document.createElement('div');
      dateCell.className = 'date-cell';
      dateCell.textContent = i;

      const cellDate = new Date(currentYear, currentMonth, i);
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      if (cellDate < todayDateOnly) {
        dateCell.classList.add('faded');
        dateCell.style.cursor = 'not-allowed';
      } else {
        dateCell.classList.add('active');

        // Retain selection if we re-render (e.g., flip months back and forth)
        if (selectedDateObj &&
          selectedDateObj.getDate() === i &&
          selectedDateObj.getMonth() === currentMonth &&
          selectedDateObj.getFullYear() === currentYear) {
          dateCell.classList.add('selected');
        }

        dateCell.addEventListener('click', () => {
          document.querySelectorAll('.date-cell.selected').forEach(d => d.classList.remove('selected'));
          dateCell.classList.add('selected');
          selectedDateObj = new Date(currentYear, currentMonth, i);
          renderTimeSlots();
        });
      }

      calendarGrid.appendChild(dateCell);
    }
  };

  const renderTimeSlots = () => {
    timeGrid.innerHTML = '';
    selectedTime = null;

    if (!selectedDateObj) return;

    // Generate slots: 4:00 PM (16) to 8:30 PM (20.5)
    // You can easily change this later to standard business hours (9-5)
    const startHour = 16;
    const endHour = 20.5;

    const isToday = selectedDateObj.getDate() === today.getDate() &&
      selectedDateObj.getMonth() === today.getMonth() &&
      selectedDateObj.getFullYear() === today.getFullYear();

    for (let time = startHour; time <= endHour; time += 0.5) {
      const hour = Math.floor(time);
      const min = (time % 1) !== 0 ? 30 : 0;

      const slotTimeInfo = new Date(selectedDateObj);
      slotTimeInfo.setHours(hour, min, 0, 0);

      const displayHour = hour > 12 ? hour - 12 : hour;
      const displayMin = min === 0 ? '00' : '30';
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const timeString = `${displayHour}:${displayMin} ${ampm}`;

      const timeSlot = document.createElement('div');
      timeSlot.className = 'time-slot';
      timeSlot.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-clock">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg> ${timeString}
      `;

      // Disable if isToday AND slot time has already passed according to their CPU clock
      if (isToday && slotTimeInfo < new Date()) {
        timeSlot.style.opacity = '0.3';
        timeSlot.style.cursor = 'not-allowed';
      } else {
        timeSlot.addEventListener('click', () => {
          document.querySelectorAll('.time-slot.selected').forEach(t => t.classList.remove('selected'));
          timeSlot.classList.add('selected');
          selectedTime = timeString;
        });
      }

      timeGrid.appendChild(timeSlot);
    }
  };

  // Nav Arrows Setup
  document.getElementById('prev-month').addEventListener('click', () => {
    if (currentYear === today.getFullYear() && currentMonth <= today.getMonth()) return;
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  document.getElementById('next-month').addEventListener('click', () => {
    if (currentYear > today.getFullYear() + 4) return;
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  // Initial Boot
  selectedDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  renderCalendar();
  renderTimeSlots();

  // Highlight today's date automatically on boot
  const cells = document.querySelectorAll('.date-cell.active');
  for (let cell of cells) {
    if (cell.textContent == today.getDate()) {
      cell.classList.add('selected');
      break;
    }
  }

  // Form Submission
  const confirmBtn = document.getElementById('confirm-booking');
  confirmBtn.addEventListener('click', async () => {
    const name = document.getElementById('user-name').value;
    const business = document.getElementById('business-name').value;
    const email = document.getElementById('user-email').value;

    const problems = Array.from(document.querySelectorAll('.problem-pills input:checked'))
      .map(input => input.nextElementSibling.textContent.trim())
      .join(', ');

    if (!name || !email) {
      alert('Please fill out your name and email.');
      return;
    }

    if (!selectedTime || !selectedDateObj) {
      alert('Please select a valid date and time slot.');
      return;
    }

    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Sending...';

    // Format the date nicely for the Google Sheet (e.g. March 14, 2026)
    const formattedDate = `${monthNames[selectedDateObj.getMonth()]} ${selectedDateObj.getDate()}, ${selectedDateObj.getFullYear()}`;

    const formData = new URLSearchParams();
    formData.append('Timestamp', new Date().toLocaleString());
    formData.append('Name', name);
    formData.append('Business', business);
    formData.append('Email', email);
    formData.append('Problems', problems);
    formData.append('Date', formattedDate);
    formData.append('Time', selectedTime);

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });

      alert('Success! Your booking has been recorded in our Google Sheet.');
      document.getElementById('booking-modal').classList.remove('active');
      document.body.style.overflow = 'auto';

      // Reset form
      document.getElementById('user-name').value = '';
      document.getElementById('business-name').value = '';
      document.getElementById('user-email').value = '';
      document.querySelectorAll('.problem-pills input:checked').forEach(i => i.checked = false);
      selectedTime = null;
      renderTimeSlots();

    } catch (error) {
      console.error('Error!', error.message);
      alert('Something went wrong. Please try again.');
    } finally {
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirm Booking →';
    }
  });
};
