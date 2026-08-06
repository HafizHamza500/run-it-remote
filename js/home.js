
// Lenis
function initLenis() {
  const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true, smoothTouch: false });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Navbar
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 80);
});

// Mobile Menu
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navCtaBtn = document.querySelector('.nav-cta-btn');

mobileBtn.addEventListener('click', () => {
  mobileBtn.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

function closeMobileMenu() {
  mobileBtn.classList.remove('active');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}



// Three.js
function initThreeJS() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  const geo = new THREE.BufferGeometry();
  const count = 500;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 12;
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ size: 0.02, color: 0x00C2D4, transparent: true, opacity: 0.5 });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);
  
  const torus = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.01, 16, 100), new THREE.MeshBasicMaterial({ color: 0x00C2D4, transparent: true, opacity: 0.2 }));
  torus.rotation.x = Math.PI / 2;
  scene.add(torus);
  
  camera.position.z = 5;
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = (e.clientX/window.innerWidth)*2-1; my = -(e.clientY/window.innerHeight)*2+1; });
  
  function animate() {
    requestAnimationFrame(animate);
    particles.rotation.y += 0.0004;
    torus.rotation.z += 0.002;
    camera.position.x += (mx*0.3 - camera.position.x) * 0.02;
    camera.position.y += (my*0.3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// =================== GSAP ANIMATIONS ===================
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  
  initThreeJS();
  
  // Hero animations
  gsap.fromTo('.hero-title-line span', 
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: 'power4.out' }
  );
  
  gsap.fromTo('.hero-badge', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.3 }
  );
  
  gsap.fromTo('.hero-subtitle', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.6 }
  );
  
  gsap.fromTo('.hero-cta', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.8 }
  );
  
  gsap.fromTo('.hero-stats', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay: 1 }
  );
  
  gsap.fromTo('.hero-float-card', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, delay: 1.2, ease: 'back.out(1.7)' }
  );
  
  // Counters
document.querySelectorAll('.counter').forEach(counter => {
  const target = parseInt(counter.dataset.target);
  if (!target) return;
  counter.innerHTML = "";

  const start = { value: 0 };

  ScrollTrigger.create({
    trigger: counter,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.fromTo(start,
        { value: 0 },
        {
          value: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            counter.innerHTML = Math.floor(start.value);
          },
          onComplete: () => {
            counter.innerHTML = target;
          }
        }
      );
    }
  });
});
  
  // Chart bars
  const chartBars = [50, 70, 45, 85, 60, 50, 80, 55, 75, 90, 65, 70];
  const aboutChart = document.getElementById('about-chart');
  if (aboutChart) {
    chartBars.forEach((height) => {
      const bar = document.createElement('div');
      bar.className = 'chart-bar';
      bar.style.height = height + '%';
      aboutChart.appendChild(bar);
    });
    
    ScrollTrigger.create({
      trigger: aboutChart,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(aboutChart.querySelectorAll('.chart-bar'), 
          { height: '10%' },
          { height: (i) => chartBars[i] + '%', duration: 0.8, stagger: 0.05, ease: 'power2.out' }
        );
      },
      once: true
    });
  }
  
  // Section animations
  const sections = ['#about', '#industries', '#process', '#results', '#testimonials', '#cta'];
  sections.forEach(section => {
    const el = document.querySelector(section);
    if (el) {
      gsap.fromTo(el.querySelectorAll('.section-label, .section-title, .section-text'), 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  });
  
  // About features
  gsap.fromTo('.about-feature', 
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.about-features',
        start: 'top 75%'
      }
    }
  );
  
  // About dashboard
  gsap.fromTo('.about-dashboard', 
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '.about-dashboard',
        start: 'top 75%'
      }
    }
  );
  
  gsap.fromTo('.about-float', 
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.3,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.about-dashboard',
        start: 'top 75%'
      }
    }
  );
  
  // Industry cards - FIXED
  gsap.fromTo('.industry-card', 
    { opacity: 0, y: 80 },
    {
      opacity: 1,
      y: 0,
      duration: 0.2,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.industries-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
  
  // Process steps
  gsap.fromTo('.process-step', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.process-timeline',
        start: 'top 70%'
      }
    }
  );
  
  // Process line fill
  ScrollTrigger.create({
    trigger: '.process-timeline',
    start: 'top 60%',
    end: 'bottom 40%',
    scrub: true,
    onUpdate: (self) => {
      const fill = document.getElementById('process-line-fill');
      if (fill) fill.style.height = (self.progress * 100) + '%';
    }
  });
  
  // Result cards - FIXED
  gsap.fromTo('.result-card', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.results-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
  
  // Result rings
  document.querySelectorAll('.result-ring .progress').forEach(circle => {
    const percent = parseInt(circle.dataset.percent);
    const circumference = 282;
    const offset = circumference - (percent / 100) * circumference;
    
    ScrollTrigger.create({
      trigger: circle,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(circle, {
          strokeDashoffset: offset,
          duration: 1.5,
          ease: 'power2.out'
        });
      },
      once: true
    });
  });
  
const cards = document.querySelectorAll('.why-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));
  
  // Testimonial cards - FIXED
gsap.fromTo('.testimonial-card', 
  { opacity: 0, y: 40 },
  {
    opacity: 1,
    y: 0,
    duration: 0.2,      
    stagger: 0.05,    
    ease: "power1.out", 
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  }
);
  // CTA form
  gsap.fromTo('.cta-form-container', 
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#cta',
        start: 'top 60%'
      }
    }
  );
}

// =================== FORM & MODAL ===================
// const form = document.getElementById('cta-form');
// form.addEventListener('submit', (e) => {
//   e.preventDefault();
//   document.getElementById('modal').classList.add('open');
//   document.body.style.overflow = 'hidden';
//   form.reset();
// });

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// =================== SMOOTH SCROLL ===================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


const videoThumb = document.getElementById("videoThumb");
const youtubeVideo = document.getElementById("youtubeVideo");

if (videoThumb && youtubeVideo) {
  videoThumb.addEventListener("click", function () {
    youtubeVideo.src = "https://www.youtube.com/embed/5-pNv-g0wyo?autoplay=1&rel=0&showinfo=0&modestbranding=1";
    youtubeVideo.style.display = "block";
    videoThumb.style.display = "none";
  });
}

document.querySelectorAll('.testimonial-video-play').forEach(button => {
  button.addEventListener('click', function () {
    const card = this.closest('.testimonial-video-card');
    if (!card) return;
    const iframe = card.querySelector('.testimonial-video-iframe');
    const preview = card.querySelector('.testimonial-video-preview');
    const url = this.dataset.video;
    if (!iframe || !url) return;
    iframe.src = url;
    preview.style.display = 'none';
    iframe.style.display = 'block';
    card.classList.add('video-open');
  });
});



// =================== INITIALIZE ===================
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initAnimations();
});

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