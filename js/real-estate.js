// ============= Mobile menu =============
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');

function openMobileMenu() {
  mobileMenu.classList.add('active');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  if (mobileMenu.classList.contains('active')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});

// Overlay click se close
mobileOverlay.addEventListener('click', closeMobileMenu);

// Mobile menu ke andar click se close nahi hona chahiye
mobileMenu.addEventListener('click', function(e) {
  e.stopPropagation();
});

// Mobile menu ke links par click se close
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// ============= Mobile Dropdown Toggle =============
function toggleMobileDrop(element) {
  // Toggle arrow
  element.classList.toggle('active');
  
  // Get content panel
  const content = element.nextElementSibling;
  content.classList.toggle('active');
  
  // Close other open dropdowns
  const allBtns = document.querySelectorAll('.mobile-dropdown-btn');
  allBtns.forEach(btn => {
    if (btn !== element && btn.classList.contains('active')) {
      btn.classList.remove('active');
      const otherContent = btn.nextElementSibling;
      if (otherContent) {
        otherContent.classList.remove('active');
      }
    }
  });
}

// ============= Close mobile menu on outside click =============
document.addEventListener('click', function(e) {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-menu-btn');
  
  if (menu && menu.classList.contains('active')) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      closeMobileMenu();
    }
  }
});

    // ============= Lenis smooth scroll =============
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // ============= Scroll reveal animations =============
    document.querySelectorAll('.reveal').forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    ScrollTrigger.create({
      start: 'top -80',
      onUpdate: (self) => {
        document.getElementById('navbar').style.boxShadow = self.progress > 0
          ? '0 10px 30px rgba(0,0,0,0.35)' : 'none';
      }
    });

    // ============= FAQ accordion =============
    document.querySelectorAll('.faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
        if (!wasActive) item.classList.add('active');
      });
    });
    const track = document.querySelector(".trusted-track");
    if (track) {
        track.innerHTML += track.innerHTML;
    }

    (function () {
    const form = document.getElementById('leadForm');
    const submitBtn = document.getElementById('lf-submit-btn');
    const submitText = document.getElementById('lf-submit-text');
    const modalOverlay = document.getElementById('lf-modal-overlay');
    const modalClose = document.getElementById('lf-modal-close');

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzXcpyVH-vnIJadoKKFThgxlw8ayeM7ah1-aADYllextpkQg4E_wjr_ScDS2Yx7SN0Xkw/exec";

    function setError(fieldId, errorId, message) {
      const field = document.getElementById(fieldId);
      const errorEl = document.getElementById(errorId);
      field.closest('.lf-field').classList.add('lf-invalid');
      errorEl.textContent = message;
    }

    function clearError(fieldId, errorId) {
      const field = document.getElementById(fieldId);
      const errorEl = document.getElementById(errorId);
      field.closest('.lf-field').classList.remove('lf-invalid');
      errorEl.textContent = '';
    }

    function validateForm() {
      let isValid = true;

      const name = document.getElementById('lf-name').value.trim();
      const phone = document.getElementById('lf-phone').value.trim();
      const email = document.getElementById('lf-email').value.trim();
      const company = document.getElementById('lf-company').value.trim();
      const callers = document.getElementById('lf-callers').value;

      if (name.length < 2) {
        setError('lf-name', 'err-name', 'Please enter your full name');
        isValid = false;
      } else { clearError('lf-name', 'err-name'); }

      const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
      if (!phoneRegex.test(phone)) {
        setError('lf-phone', 'err-phone', 'Please enter a valid phone number');
        isValid = false;
      } else { clearError('lf-phone', 'err-phone'); }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('lf-email', 'err-email', 'Please enter a valid email address');
        isValid = false;
      } else { clearError('lf-email', 'err-email'); }

      if (company.length < 2) {
        setError('lf-company', 'err-company', 'Please enter your company name');
        isValid = false;
      } else { clearError('lf-company', 'err-company'); }

      if (!callers) {
        setError('lf-callers', 'err-callers', 'Please select an option');
        isValid = false;
      } else { clearError('lf-callers', 'err-callers'); }

      return isValid;
    }

    ['lf-name', 'lf-phone', 'lf-email', 'lf-company', 'lf-callers'].forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener('input', () => el.closest('.lf-field').classList.remove('lf-invalid'));
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      const data = {
        name: document.getElementById('lf-name').value.trim(),
        phone: document.getElementById('lf-phone').value.trim(),
        email: document.getElementById('lf-email').value.trim(),
        company: document.getElementById('lf-company').value.trim(),
        callers: document.getElementById('lf-callers').value,
        timeline: document.getElementById('lf-timeline').value || 'Not specified',
        date: new Date().toLocaleString()
      };

      submitBtn.disabled = true;
      submitText.textContent = 'Submitting...';

      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(() => {
        form.reset();
        modalOverlay.classList.add('active');
      })
      .catch(() => {
        form.reset();
        modalOverlay.classList.add('active');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitText.textContent = 'Submit';
      });
    });

    modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    });
  })();
  