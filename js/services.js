// =================== LENIS ===================
const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10*t)), smooth: true, smoothTouch: false });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// =================== NAVBAR ===================
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 80);
});

// =================== MOBILE MENU ===================
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navCtaBtn = document.querySelector('.nav-cta-btn');

mobileBtn.addEventListener('click', () => {
  mobileBtn.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  
  // Hide Get Started button in navbar when mobile menu is open (on mobile/tablet)
  if (window.innerWidth <= 1024 && navCtaBtn) {
    navCtaBtn.style.display = mobileMenu.classList.contains('open') ? 'none' : 'flex';
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
      navCtaBtn.style.display = 'flex';
    } else {
      navCtaBtn.style.display = mobileMenu.classList.contains('open') ? 'none' : 'flex';
    }
  }
});

// =================== THREE.JS HERO ===================
(function initHero() {
  const canvas = document.getElementById('services-hero-canvas');
  if (!canvas) return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
  const material = new THREE.MeshBasicMaterial({ color: 0x00C2D4, wireframe: true, transparent: true, opacity: 0.07 });
  const wave = new THREE.Mesh(geometry, material);
  wave.rotation.x = -Math.PI / 2.5;
  wave.position.y = -3; wave.position.z = -5;
  scene.add(wave);
  const pGeo = new THREE.BufferGeometry();
  const pCount = 400;
  const pos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) pos[i] = (Math.random() - 0.5) * 20;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.03, color: 0x00C2D4, transparent: true, opacity: 0.5 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);
  camera.position.z = 8; camera.position.y = 2;
  let time = 0;
  (function animate() {
    requestAnimationFrame(animate); time += 0.01;
    const p = wave.geometry.attributes.position.array;
    for (let i = 0; i < p.length; i += 3) {
      p[i+2] = Math.sin(p[i]*0.5+time)*0.3 + Math.cos(p[i+1]*0.5+time)*0.3;
    }
    wave.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.0003;
    renderer.render(scene, camera);
  })();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// =================== GSAP ANIMATIONS ===================
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Hero
gsap.fromTo('.hero-label', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, delay: 0.3 });
gsap.fromTo('.hero-title .line span', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.15, delay: 0.4, ease: 'power4.out' });
gsap.fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.8 });
gsap.fromTo('.hero-buttons', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 1 });
gsap.fromTo('.hero-quick-card', { opacity: 0, scale: 0.8, y: 50 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 1.2, ease: 'back.out(1.7)' });

// Overview cards
gsap.fromTo('.ov-card', { opacity: 0, y: 40 }, {
  opacity: 1, y: 0, duration: 0.5, stagger: 0.07,
  scrollTrigger: { trigger: '.overview-grid', start: 'top 80%' }
});

// Service sections
document.querySelectorAll('.service-section').forEach((section, i) => {
  const imgBox = section.querySelector('.service-img-box');
  const content = section.querySelector('.service-content');
  const isReverse = section.querySelector('.service-inner.reverse');
  gsap.fromTo(imgBox, { opacity: 0, x: isReverse ? 60 : -60 }, {
    opacity: 1, x: 0, duration: 1,
    scrollTrigger: { trigger: section, start: 'top 65%' }
  });
  gsap.fromTo(content, { opacity: 0, x: isReverse ? -60 : 60 }, {
    opacity: 1, x: 0, duration: 1, delay: 0.15,
    scrollTrigger: { trigger: section, start: 'top 65%' }
  });
  gsap.fromTo(section.querySelectorAll('.sf-item'), { opacity: 0, x: -20 }, {
    opacity: 1, x: 0, duration: 0.4, stagger: 0.08, delay: 0.3,
    scrollTrigger: { trigger: section, start: 'top 65%' }
  });
});

// CTA
gsap.fromTo('.services-cta-content', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, scrollTrigger: { trigger: '#services-cta', start: 'top 70%' } });
gsap.fromTo('.cta-form', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, scrollTrigger: { trigger: '#services-cta', start: 'top 70%' } });

// Section titles & labels
document.querySelectorAll('.section-title').forEach(el => {
  gsap.fromTo(el, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 85%' } });
});

// =================== SMOOTH SCROLL ===================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// =================== FORM ===================
document.getElementById('services-form').addEventListener('submit', e => {
  e.preventDefault();
  const modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:1rem;';
  modal.innerHTML = `
    <div style="position:absolute;inset:0;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);" onclick="this.parentElement.remove()"></div>
    <div style="position:relative;z-index:1;background:#1a1a1a;border:1px solid rgba(0,194,212,0.25);border-radius:20px;padding:2.5rem;max-width:420px;width:100%;text-align:center;animation:modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1);">
      <div style="width:65px;height:65px;background:rgba(0,194,212,0.1);border:2px solid #00C2D4;border-radius:50%;margin:0 auto 1.25rem;display:flex;align-items:center;justify-content:center;">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#00C2D4" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 style="font-size:1.25rem;font-weight:800;margin-bottom:0.4rem;color:#fff;">Quote Request Sent!</h3>
      <p style="color:#888;margin-bottom:1.5rem;font-size:0.9rem;">We'll get back to you within 24 hours with a custom quote.</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;">
        <a href="tel:4049055636" style="padding:0.7rem 1.5rem;background:#00C2D4;color:#0A0A0A;font-weight:700;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:8px;">Call Now</a>
        <button onclick="this.closest('[style*=fixed]').remove()" style="padding:0.7rem 1.5rem;background:transparent;color:#fff;font-weight:600;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;border:1px solid rgba(255,255,255,0.2);border-radius:8px;cursor:pointer;">Close</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
  if (!document.querySelector('#modal-anim')) {
    const s = document.createElement('style'); s.id = 'modal-anim';
    s.textContent = '@keyframes modalIn{from{opacity:0;transform:scale(0.9) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}';
    document.head.appendChild(s);
  }
  document.getElementById('services-form').reset();
});