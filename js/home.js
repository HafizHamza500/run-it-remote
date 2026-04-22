
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
  
  // Hide Get Started button in navbar when mobile menu is open (on mobile/tablet)
  if (window.innerWidth <= 1024) {
    if (mobileMenu.classList.contains('open')) {
      navCtaBtn.style.display = 'none';
    } else {
      navCtaBtn.style.display = 'flex';
    }
  }
});

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
      // Desktop - always show
      navCtaBtn.style.display = 'flex';
    } else {
      // Mobile/Tablet - show only if menu is closed
      navCtaBtn.style.display = mobileMenu.classList.contains('open') ? 'none' : 'flex';
    }
  }
});

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
    if (target) {
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(counter, {
            innerHTML: target,
            duration: 2,
            snap: { innerHTML: 1 },
            ease: 'power2.out'
          });
        },
        once: true
      });
    }
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
const form = document.getElementById('cta-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  form.reset();
});

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

