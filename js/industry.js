
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

// =================== TIME ===================
function updateTime() {
  const el = document.getElementById('nav-time');
  if (!el) return;
  const n = new Date();
  const d = ['SUN','MON','TUE','WED','THU','FRI','SAT'][n.getDay()];
  const h = n.getHours(), m = String(n.getMinutes()).padStart(2,'0');
  el.textContent = `${d} ${h%12||12}:${m} ${h>=12?'PM':'AM'}`;
}
updateTime(); 
setInterval(updateTime, 1000);

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
  const canvas = document.getElementById('industry-hero-canvas');
  if (!canvas) return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Create flowing wave mesh
  const geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00C2D4,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  
  const wave = new THREE.Mesh(geometry, material);
  wave.rotation.x = -Math.PI / 2.5;
  wave.position.y = -3;
  wave.position.z = -5;
  scene.add(wave);
  
  // Particles
  const particlesGeo = new THREE.BufferGeometry();
  const particlesCount = 400;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particlesMat = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x00C2D4,
    transparent: true,
    opacity: 0.5
  });
  
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);
  
  camera.position.z = 8;
  camera.position.y = 2;
  
  let time = 0;
  
  function animate() {
    requestAnimationFrame(animate);
    
    time += 0.01;
    
    // Animate wave
    const positions = wave.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      positions[i + 2] = Math.sin(x * 0.5 + time) * 0.3 + Math.cos(y * 0.5 + time) * 0.3;
    }
    wave.geometry.attributes.position.needsUpdate = true;
    
    particles.rotation.y += 0.0003;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// =================== INDUSTRY SECTIONS SCROLL ANIMATIONS ===================
// Animate industry sections on scroll
document.querySelectorAll('.industry-section').forEach((section, index) => {
  gsap.fromTo(section.querySelector('.industry-content'), 
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    }
  );
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
  gsap.fromTo('.industry-breadcrumb', 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
  );
  
  gsap.fromTo('.industry-hero-label', 
    { opacity: 0, x: -30 },
    { opacity: 1, x: 0, duration: 0.8, delay: 0.3 }
  );
  
  gsap.fromTo('.industry-hero-title .line span', 
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.15, delay: 0.4, ease: 'power4.out' }
  );
  
  gsap.fromTo('.industry-hero-desc', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.8 }
  );
  
  gsap.fromTo('.industry-hero-buttons', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay: 1 }
  );
  
  gsap.fromTo('.hero-service-card', 
    { opacity: 0, scale: 0.8, y: 50 },
    { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 1.2, ease: 'back.out(1.7)' }
  );
  
  // Industries Served section header animation
  gsap.fromTo('#industries-served .services-header', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#industries-served',
        start: 'top 70%'
      }
    }
  );
  
  gsap.fromTo('#industries-served .services-container', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: 0.3,
      scrollTrigger: {
        trigger: '#industries-served',
        start: 'top 70%'
      }
    }
  );
  
  // All services cards
  gsap.fromTo('.all-service-card', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.2,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.all-services-grid',
        start: 'top 80%'
      }
    }
  );
  
  // Industries content
  gsap.fromTo('.industry-visual', 
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#industries-served',
        start: 'top 60%'
      }
    }
  );
  
  gsap.fromTo('.industry-info', 
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#industries-served',
        start: 'top 60%'
      }
    }
  );
  
  // Comparison table rows

    
    // Comparison table rows
  gsap.fromTo('.comparison-row:not(.comparison-header-row)', 
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.comparison-table',
        start: 'top 75%'
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
  
  // CTA section
  gsap.fromTo('.industry-cta-content', 
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#industry-cta',
        start: 'top 70%'
      }
    }
  );
  
  gsap.fromTo('.industry-cta-form', 
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#industry-cta',
        start: 'top 70%'
      }
    }
  );
  
  // Parallax effects on scroll
  gsap.to('.industry-hero-bg::before', {
    yPercent: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: '#industry-hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  // Service cards hover parallax
  const serviceCards = document.querySelectorAll('.hero-service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
  
  // All service cards magnetic effect
  const allServiceCards = document.querySelectorAll('.all-service-card');
  allServiceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(card.querySelector('.all-service-card-icon'), {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.3
      });
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('.all-service-card-icon'), {
        x: 0,
        y: 0,
        duration: 0.3
      });
    });
  });
  
  // Industry benefits stagger animation
  gsap.fromTo('.industry-benefit', 
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.industry-benefits',
        start: 'top 80%'
      }
    }
  );
  
  // Text reveal animations for section titles
  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
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
  
  // Section labels animation
  const sectionLabels = document.querySelectorAll('.section-label');
  sectionLabels.forEach(label => {
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

// =================== FORM SUBMISSION ===================
const industryForm = document.getElementById('industry-form');
if (industryForm) {
  industryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Create success modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    `;
    
    modal.innerHTML = `
      <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);" onclick="this.parentElement.remove()"></div>
      <div style="position: relative; z-index: 1; background: #1a1a1a; border: 1px solid rgba(0, 194, 212, 0.25); border-radius: 20px; padding: 2.5rem; max-width: 420px; width: 100%; text-align: center; animation: modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <div style="width: 65px; height: 65px; background: rgba(0, 194, 212, 0.1); border: 2px solid #00C2D4; border-radius: 50%; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center;">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00C2D4" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.4rem; color: #fff;">Quote Request Sent!</h3>
        <p style="color: #888; margin-bottom: 1.5rem; font-size: 0.9rem;">We'll get back to you within 24 hours with a custom quote.</p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <a href="tel:4049055636" style="padding: 0.7rem 1.5rem; background: #00C2D4; color: #0A0A0A; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; border-radius: 8px;">Call Now</a>
          <button onclick="this.closest('[style*=fixed]').remove()" style="padding: 0.7rem 1.5rem; background: transparent; color: #fff; font-weight: 600; font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; cursor: pointer;">Close</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add animation keyframes if not exists
    if (!document.querySelector('#modal-animation')) {
      const style = document.createElement('style');
      style.id = 'modal-animation';
      style.textContent = `
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Reset form
    industryForm.reset();
    
    // Close modal on Escape key
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', closeOnEscape);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
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

// =================== INTERSECTION OBSERVER FOR ANIMATIONS ===================
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
    }
  });
}, observerOptions);

// Observe elements that need animation
document.querySelectorAll('.all-service-card, .faq-item, .industry-benefit').forEach(el => {
  animationObserver.observe(el);
});

// =================== PRELOAD CRITICAL ASSETS ===================
function preloadImages() {
  const images = document.querySelectorAll('img[data-src]');
  images.forEach(img => {
    img.src = img.dataset.src;
  });
}

// Call after page load
window.addEventListener('load', preloadImages);

// =================== PERFORMANCE OPTIMIZATION ===================
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for resize events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Optimized scroll handler
const optimizedScrollHandler = throttle(() => {
  // Add any scroll-based logic here
}, 100);

window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// Optimized resize handler
const optimizedResizeHandler = debounce(() => {
  // Recalculate any layout-dependent values
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// =================== INITIALIZE ===================
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initAnimations();
});