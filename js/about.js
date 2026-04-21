
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

// =================== THREE.JS - HERO CANVAS ===================
function initHeroThreeJS() {
  const canvas = document.getElementById('about-hero-canvas');
  if (!canvas) return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Create DNA Helix
  const helixGroup = new THREE.Group();
  const points1 = [];
  const points2 = [];
  const connectors = [];
  
  for (let i = 0; i < 100; i++) {
    const t = i * 0.15;
    const x1 = Math.cos(t) * 1.5;
    const y1 = (i - 50) * 0.1;
    const z1 = Math.sin(t) * 1.5;
    
    const x2 = Math.cos(t + Math.PI) * 1.5;
    const y2 = (i - 50) * 0.1;
    const z2 = Math.sin(t + Math.PI) * 1.5;
    
    points1.push(new THREE.Vector3(x1, y1, z1));
    points2.push(new THREE.Vector3(x2, y2, z2));
    
    // Connectors every 5 points
    if (i % 5 === 0) {
      const connGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x2, y2, z2)
      ]);
      const connMat = new THREE.LineBasicMaterial({ 
        color: 0x00C2D4, 
        transparent: true, 
        opacity: 0.3 
      });
      connectors.push(new THREE.Line(connGeo, connMat));
    }
  }
  
  const curve1 = new THREE.CatmullRomCurve3(points1);
  const curve2 = new THREE.CatmullRomCurve3(points2);
  
  const tubeGeo1 = new THREE.TubeGeometry(curve1, 100, 0.05, 8, false);
  const tubeGeo2 = new THREE.TubeGeometry(curve2, 100, 0.05, 8, false);
  
  const tubeMat = new THREE.MeshBasicMaterial({ 
    color: 0x00C2D4, 
    transparent: true, 
    opacity: 0.6 
  });
  
  const tube1 = new THREE.Mesh(tubeGeo1, tubeMat);
  const tube2 = new THREE.Mesh(tubeGeo2, tubeMat);
  
  helixGroup.add(tube1);
  helixGroup.add(tube2);
  connectors.forEach(c => helixGroup.add(c));
  
  scene.add(helixGroup);
  
  // Particles
  const particlesGeo = new THREE.BufferGeometry();
  const particlesCount = 300;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }
  
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particlesMat = new THREE.PointsMaterial({
    size: 0.03,
    color: 0x00C2D4,
    transparent: true,
    opacity: 0.4
  });
  
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);
  
  camera.position.z = 8;
  
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });
  
  function animate() {
    requestAnimationFrame(animate);
    
    helixGroup.rotation.y += 0.003;
    helixGroup.rotation.x = mouseY * 0.2;
    
    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;
    
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 1 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}

// =================== THREE.JS - GLOBE CANVAS ===================
function initGlobeThreeJS() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Create wireframe sphere
  const sphereGeo = new THREE.SphereGeometry(3, 32, 32);
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: 0x00C2D4,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  
  const sphere = new THREE.Mesh(sphereGeo, wireframeMat);
  scene.add(sphere);
  
  // Inner glow sphere
  const glowGeo = new THREE.SphereGeometry(2.8, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x00C2D4,
    transparent: true,
    opacity: 0.05
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  scene.add(glow);
  
  // Orbital rings
  const ringGeo = new THREE.RingGeometry(3.5, 3.55, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x00C2D4,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 2;
  scene.add(ring1);
  
  const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.y = Math.PI / 4;
  scene.add(ring2);
  
  // Dots on sphere
  const dotsGroup = new THREE.Group();
  for (let i = 0; i < 50; i++) {
    const phi = Math.acos(-1 + (2 * i) / 50);
    const theta = Math.sqrt(50 * Math.PI) * phi;
    
    const dotGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x00C2D4 });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    
    dot.position.x = 3 * Math.cos(theta) * Math.sin(phi);
    dot.position.y = 3 * Math.sin(theta) * Math.sin(phi);
    dot.position.z = 3 * Math.cos(phi);
    
    dotsGroup.add(dot);
  }
  scene.add(dotsGroup);
  
  camera.position.z = 8;
  
  function animate() {
    requestAnimationFrame(animate);
    
    sphere.rotation.y += 0.002;
    glow.rotation.y += 0.002;
    dotsGroup.rotation.y += 0.002;
    ring1.rotation.z += 0.001;
    ring2.rotation.z -= 0.001;
    
    renderer.render(scene, camera);
  }
  
  animate();
  
  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}

// =================== GSAP ANIMATIONS ===================
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  
  // Init Three.js scenes
  initHeroThreeJS();
  initGlobeThreeJS();
  
  // Hero animations
  gsap.fromTo('.about-breadcrumb', 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
  );
  
  gsap.fromTo('.about-hero-badge', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)' }
  );
  
  gsap.fromTo('.about-hero-title .line span', 
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.15, delay: 0.4, ease: 'power4.out' }
  );
  
  gsap.fromTo('.about-hero-desc', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay: 0.8 }
  );
  
  gsap.fromTo('.about-hero-stats', 
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay: 1 }
  );
  
  gsap.fromTo('.about-hero-float', 
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, delay: 1.2, ease: 'back.out(1.7)' }
  );
  
  // Counter animations
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
  
  // Story items
  const storyItems = document.querySelectorAll('.story-item');
  storyItems.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      onEnter: () => {
        item.classList.add('visible');
      }
    });
  });
  
  // Mission Vision cards
  gsap.fromTo('.mv-card', 
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.2,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.mv-grid',
        start: 'top 75%'
      }
    }
  );
  
  // Value cards
  gsap.fromTo('.value-card', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.values-grid',
        start: 'top 80%'
      }
    }
  );
  
  // Team cards
  gsap.fromTo('.team-card', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.team-grid',
        start: 'top 80%'
      }
    }
  );
  
  // Global section
  gsap.fromTo('.global-content', 
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#global',
        start: 'top 70%'
      }
    }
  );
  
  gsap.fromTo('.global-visual', 
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#global',
        start: 'top 70%'
      }
    }
  );
  
  // Award cards
  gsap.fromTo('.award-card', 
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.awards-grid',
        start: 'top 80%'
      }
    }
  );
  
  // CTA section
  gsap.fromTo('.about-cta-content', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '#about-cta',
        start: 'top 70%'
      }
    }
  );
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


// =================== INITIALIZE ===================
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initAnimations();
});