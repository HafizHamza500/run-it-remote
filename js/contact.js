// =================== LOADER ===================
let progress = 0;
const loadInterval = setInterval(() => {
  progress += Math.random() * 25;
  if (progress >= 100) {
    progress = 100;
    clearInterval(loadInterval);
    setTimeout(() => {
      gsap.to('#loader', {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          document.getElementById('loader').style.display = 'none';
          initLenis();
          initAnimations();
          startCallDuration();
        }
      });
    }, 300);
  }
  document.getElementById('loader-bar').style.width = progress + '%';
  document.getElementById('loader-percent').textContent = Math.round(progress) + '%';
}, 80);

// =================== LENIS SMOOTH SCROLL ===================
function initLenis() {
  const lenis = new Lenis({ 
    duration: 1.2, 
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    smooth: true, 
    smoothTouch: false 
  });
  
  function raf(time) { 
    lenis.raf(time); 
    requestAnimationFrame(raf); 
  }
  requestAnimationFrame(raf);
  
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// =================== TIME UPDATES ===================
function updateTime() {
  const el = document.getElementById('nav-time');
  const n = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const d = ['SUN','MON','TUE','WED','THU','FRI','SAT'][n.getDay()];
  const h = n.getHours(), m = String(n.getMinutes()).padStart(2,'0');
  
  if (el) {
    el.textContent = `${d} ${h%12||12}:${m} ${h>=12?'PM':'AM'}`;
  }
  
  // Phone time
  const phoneTime = document.getElementById('phone-time');
  const phoneDate = document.getElementById('phone-date');
  if (phoneTime) {
    phoneTime.textContent = `${h%12||12}:${m}`;
  }
  if (phoneDate) {
    phoneDate.textContent = `${days[n.getDay()]}, ${months[n.getMonth()]} ${n.getDate()}`;
  }
}
updateTime(); 
setInterval(updateTime, 1000);

// =================== CALL DURATION TIMER ===================
let callSeconds = 0;
function startCallDuration() {
  setInterval(() => {
    callSeconds++;
    const mins = Math.floor(callSeconds / 60);
    const secs = callSeconds % 60;
    const duration = document.getElementById('call-duration');
    if (duration) {
      duration.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }, 1000);
}

// =================== NAVBAR ===================
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 80);
});

// =================== MOBILE MENU ===================
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navCtaBtn = document.querySelector('.nav-cta-btn');

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    
    // Hide Get Started button in navbar when mobile menu is open (on mobile/tablet)
    if (window.innerWidth <= 1024 && navCtaBtn) {
      navCtaBtn.style.display = mobileMenu.classList.contains('open') ? 'none' : 'flex';
    }
  });
}

function closeMobileMenu() {
  mobileBtn.classList.remove('active');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  
  // Show Get Started button in navbar when mobile menu closes (on mobile/tablet)
  if (window.innerWidth <= 1024 && navCtaBtn) {
    navCtaBtn.style.display = 'flex';
  }
}

// Handle resize to reset button visibility
window.addEventListener('resize', () => {
  if (navCtaBtn) {
    if (window.innerWidth > 1024) {
      navCtaBtn.style.display = 'flex';
    } else {
      navCtaBtn.style.display = mobileMenu.classList.contains('open') ? 'none' : 'flex';
    }
  }
});

// =================== THREE.JS - HERO CANVAS ===================
function initHeroThreeJS() {
  const canvas = document.getElementById('contact-hero-canvas');
  if (!canvas) return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Create connection lines
  const linesGroup = new THREE.Group();
  const linesMaterial = new THREE.LineBasicMaterial({ 
    color: 0x00C2D4, 
    transparent: true, 
    opacity: 0.15 
  });
  
  for (let i = 0; i < 30; i++) {
    const points = [];
    const startX = (Math.random() - 0.5) * 20;
    const startY = (Math.random() - 0.5) * 15;
    const startZ = (Math.random() - 0.5) * 10;
    
    points.push(new THREE.Vector3(startX, startY, startZ));
    points.push(new THREE.Vector3(startX + (Math.random() - 0.5) * 5, startY + (Math.random() - 0.5) * 5, startZ + (Math.random() - 0.5) * 3));
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, linesMaterial);
    linesGroup.add(line);
  }
  scene.add(linesGroup);
  
  // Particles
  const particlesGeo = new THREE.BufferGeometry();
  const particlesCount = 300;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 25;
  }
  
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particlesMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x00C2D4,
    transparent: true,
    opacity: 0.6
  });
  
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);
  
  // Signal rings
  const ringGroup = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.RingGeometry(2 + i * 1.5, 2.1 + i * 1.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0x00C2D4, 
      transparent: true, 
      opacity: 0.1 - i * 0.02,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(-3, 0, -5);
    ringGroup.add(ring);
  }
  scene.add(ringGroup);
  
  camera.position.z = 10;
  
  let time = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    
    time += 0.005;
    
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;
    
    linesGroup.rotation.y += 0.0005;
    
    ringGroup.children.forEach((ring, i) => {
      ring.scale.x = 1 + Math.sin(time * 2 + i * 0.5) * 0.1;
      ring.scale.y = 1 + Math.sin(time * 2 + i * 0.5) * 0.1;
      ring.material.opacity = (0.1 - i * 0.02) * (0.5 + Math.sin(time * 2 + i * 0.5) * 0.5);
    });
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// =================== FORM VALIDATION ===================
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

// Character counter for message
const messageInput = document.getElementById('message');
const charCounter = document.getElementById('char-counter');

if (messageInput && charCounter) {
  messageInput.addEventListener('input', () => {
    const length = messageInput.value.length;
    const max = 500;
    charCounter.textContent = `${length} / ${max}`;
    
    charCounter.classList.remove('warning', 'danger');
    if (length > 400) {
      charCounter.classList.add('warning');
    }
    if (length > 480) {
      charCounter.classList.add('danger');
    }
  });
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    
    if (value.length >= 6) {
      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length >= 3) {
      value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    }
    
    e.target.value = value;
  });
}

// Validation functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  
  if (input) {
    input.classList.add('error');
    input.classList.remove('success');
  }
  if (error) {
    error.querySelector('span').textContent = message;
    error.classList.add('show');
  }
}

function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(`${fieldId}-error`);
  
  if (input) {
    input.classList.remove('error');
    input.classList.add('success');
  }
  if (error) {
    error.classList.remove('show');
  }
}

function clearAllErrors() {
  document.querySelectorAll('.form-input').forEach(input => {
    input.classList.remove('error', 'success');
  });
  document.querySelectorAll('.form-error').forEach(error => {
    error.classList.remove('show');
  });
}

// Real-time validation
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('blur', () => {
    validateField(input);
  });
  
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      validateField(input);
    }
  });
});

function validateField(input) {
  const id = input.id;
  const value = input.value.trim();
  
  switch(id) {
    case 'firstName':
      if (!value) {
        showError('firstName', 'First name is required');
        return false;
      }
      clearError('firstName');
      return true;
      
    case 'lastName':
      if (!value) {
        showError('lastName', 'Last name is required');
        return false;
      }
      clearError('lastName');
      return true;
      
    case 'email':
      if (!value) {
        showError('email', 'Email is required');
        return false;
      }
      if (!validateEmail(value)) {
        showError('email', 'Please enter a valid email');
        return false;
      }
      clearError('email');
      return true;
      
    case 'phone':
      if (!value) {
        showError('phone', 'Phone number is required');
        return false;
      }
      if (!validatePhone(value)) {
        showError('phone', 'Please enter a valid phone number');
        return false;
      }
      clearError('phone');
      return true;
      
    case 'service':
      if (!value) {
        showError('service', 'Please select a service');
        return false;
      }
      clearError('service');
      return true;
      
    case 'industry':
      if (!value) {
        showError('industry', 'Please select your industry');
        return false;
      }
      clearError('industry');
      return true;
      
    default:
      return true;
  }
}

// Form submission
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validate all required fields
  let isValid = true;
  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'service', 'industry'];
  
  requiredFields.forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  if (!isValid) {
    // Scroll to first error
    const firstError = document.querySelector('.form-input.error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
    return;
  }
  
  // Show loading state
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Reset loading state
  submitBtn.classList.remove('loading');
  submitBtn.disabled = false;
  
  // Show success modal
  document.getElementById('success-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  
  // Reset form
  contactForm.reset();
  clearAllErrors();
  if (charCounter) charCounter.textContent = '0 / 500';
});

// =================== MODAL ===================
function closeModal() {
  document.getElementById('success-modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// =================== FAQ ACCORDION ===================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all items
    faqItems.forEach(i => i.classList.remove('active'));
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// =================== GSAP ANIMATIONS ===================
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  
  // Init Three.js
  initHeroThreeJS();
  
  // Hero animations
  gsap.fromTo('.contact-breadcrumb', 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
  );
  
  gsap.fromTo('.contact-hero-label', 
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.8, delay: 0.3 }
  );
  
  gsap.fromTo('.contact-hero-title', 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power4.out' }
  );
  
  gsap.fromTo('.contact-hero-desc', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.6 }
  );
  
  gsap.fromTo('.contact-form', 
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, delay: 0.8 }
  );
  
  gsap.fromTo('.phone-mockup', 
    { opacity: 0, scale: 0.8, y: 50 },
    { opacity: 1, scale: 1, y: 0, duration: 1, delay: 1, ease: 'back.out(1.7)' }
  );
  
  gsap.fromTo('.phone-badge-top-right', 
    { opacity: 0, scale: 0.8, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 1.3, ease: 'back.out(1.7)' }
  );
  
  gsap.fromTo('.phone-float', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, delay: 1.3, ease: 'back.out(1.7)' }
  );
  
  // Contact info cards
  gsap.fromTo('.contact-info-card', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.contact-info-grid',
        start: 'top 80%'
      }
    }
  );
  
  // Map section
  gsap.fromTo('.map-content', 
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#map-section',
        start: 'top 70%'
      }
    }
  );
  
  gsap.fromTo('.map-visual', 
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#map-section',
        start: 'top 70%'
      }
    }
  );
  
  gsap.fromTo('.office-location', 
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.office-locations',
        start: 'top 80%'
      }
    }
  );
  
  // Map pins
  gsap.fromTo('.map-pin', 
    { opacity: 0, scale: 0 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.2,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.map-visual',
        start: 'top 70%'
      }
    }
  );
  
  // FAQ items
  gsap.fromTo('.faq-item', 
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.faq-grid',
        start: 'top 80%'
      }
    }
  );
  
  // Social links
  gsap.fromTo('.social-link-btn', 
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.social-links',
        start: 'top 85%'
      }
    }
  );
  
  // Section titles
  document.querySelectorAll('.section-title').forEach(title => {
    gsap.fromTo(title, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: title,
          start: 'top 85%'
        }
      }
    );
  });
  
  // Section labels
  document.querySelectorAll('.section-label').forEach(label => {
    gsap.fromTo(label, 
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: label,
          start: 'top 85%'
        }
      }
    );
  });
}

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

// =================== PHONE ACTION BUTTONS ===================
document.querySelectorAll('.phone-action-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    this.style.transform = 'scale(0.9)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
});


// =================== INITIALIZE ===================
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initAnimations();
});