// ================================
// script.js
// Interaction: nav toggle, accordion, product actions, form submit
// ================================

document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
    // Close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('show'));
    });
  }

  // Accordion
  const accordion = document.getElementById('faqAccordion');
  if (accordion) {
    accordion.querySelectorAll('.accordion-item').forEach(item => {
      const header = item.querySelector('.accordion-header');
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        accordion.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // Product buttons
  const orderButtons = document.querySelectorAll('.order-btn');
  const detailsButtons = document.querySelectorAll('.details-btn');

  orderButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product || 'Product';
      // Pre-fill order form product
      const select = document.getElementById('product');
      if (select) {
        select.value = Array.from(select.options).find(o => o.text === product)?.value || '';
        document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        alert(`Interested in ${product}? Scroll to Order section to request a quote.`);
      }
    });
  });

  detailsButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product || 'Product';
      alert(`${product}\n\n• High-quality corrugated material\n• Custom sizes & printing available\n• Bulk pricing on request`);
    });
  });

  // Order form validation (frontend only)
  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = orderForm.name.value.trim();
      const phone = orderForm.phone.value.trim();
      const email = orderForm.email.value.trim();
      const product = orderForm.product.value.trim();
      const message = orderForm.message.value.trim();

      const errors = [];
      if (!name) errors.push('Please enter your name.');
      if (!phone) errors.push('Please enter your phone number.');
      if (!product) errors.push('Please select a product.');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');

      if (errors.length) {
        alert('Fix the following:\n\n' + errors.map(e => '• ' + e).join('\n'));
        return;
      }

      // Simulate submission (ready for Node.js/MongoDB integration)
      const payload = { name, phone, email, product, message, source: 'homepage' };
      console.log('Quote request payload:', payload);

      alert('Thank you! Your request has been submitted. Our team will contact you within 24 hours.');
      orderForm.reset();
    });
  }
});

//slide show 
let slideIndex = 1;
showSlides(slideIndex);

// Arrow controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Dot controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
}

/* ----------- AUTO SLIDE ------------- */
/* Change time here (milliseconds) */

setInterval(() => {
    plusSlides(1);
}, 6000);   // Change speed: 4000 = faster, 10000 = slower

//welcome
let manualSlideIndex = 0;
showManualSlide(manualSlideIndex);

function manualChangeSlide(n) {
  showManualSlide(manualSlideIndex += n);
}

function showManualSlide(n) {
  let slides = document.getElementsByClassName("manual-slide");
  if (n >= slides.length) { manualSlideIndex = 0; }
  if (n < 0) { manualSlideIndex = slides.length - 1; }
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[manualSlideIndex].style.display = "block";
}
//process

    const steps = document.querySelectorAll(".step-number");
    steps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.4}s`;
    });



// Auth menu: hide login/signup when user is logged in, show when logged out
document.addEventListener('DOMContentLoaded', () => {
  async function updateAuthMenu() {
    try {
      const res = await fetch('/api/profile/profiledata', { credentials: 'include' });
      if (!res.ok) throw new Error('Not authenticated');

      // Logged in: hide login/signup links and show profile dropdown/icon
      document.querySelectorAll('.nav-links .login-btn').forEach(el => el.style.display = 'none');
      const dropdown = document.getElementById('dropdownMenu');
      if (dropdown) dropdown.style.display = 'block';
      const profileIcon = document.querySelector('.profile-icon');
      if (profileIcon) profileIcon.style.display = 'inline-block';

    } catch (err) {
      // Not logged in: show login/signup and hide profile dropdown/icon
      document.querySelectorAll('.nav-links .login-btn').forEach(el => el.style.display = 'inline-block');
      const dropdown = document.getElementById('dropdownMenu');
      if (dropdown) dropdown.style.display = 'none';
      const profileIcon = document.querySelector('.profile-icon');
      if (profileIcon) profileIcon.style.display = 'none';
    }
  }

  updateAuthMenu();
});

