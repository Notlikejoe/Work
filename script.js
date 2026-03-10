/* =========================================================================
   LUXURY SCRIPT v2 — IH Atelier
   Production-Ready | Cinematic | Refined Animations
   ========================================================================= */

// Prevent FOUC
document.documentElement.style.visibility = 'hidden';
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.visibility = 'visible';
});

// Error handling for images
window.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    if (e.target.src.endsWith('.jpg') && !e.target.dataset.fallbackAttempted) {
      e.target.dataset.fallbackAttempted = 'true';
      e.target.src = e.target.src.replace(/\.jpg$/, '.png');
    } else if (e.target.src.endsWith('.png') && !e.target.dataset.fallbackAttempted) {
      e.target.dataset.fallbackAttempted = 'true';
      e.target.src = e.target.src.replace(/\.png$/, '.jpg');
    }
  }
}, true);

// Handle explore button navigation (remove inline onclick)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.explore-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'projects.html';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================================
     PAGE LOADER — Cinematic Reveal
     ========================================================================= */
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader) {
    document.body.classList.add('loading');
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.style.opacity = '0';
        pageLoader.style.pointerEvents = 'none';
        document.body.classList.remove('loading');
        
        // Trigger hero animations
        initHeroAnimations();
      }, 1500);
    });
  } else {
    // No loader, start animations directly
    initHeroAnimations();
  }

  /* =========================================================================
     LENIS SMOOTH SCROLL — Premium Feel
     ========================================================================= */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      })(0);
    }
  }

  /* =========================================================================
     SCROLL PROGRESS BAR
     ========================================================================= */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const scroll = window.scrollY;
      progressBar.style.width = `${(scroll / total) * 100}%`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* =========================================================================
     NAVIGATION — Blur + Scale + Page Transition
     ========================================================================= */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* =========================================================================
     PAGE TRANSITIONS
     ========================================================================= */
  const pageTransition = document.querySelector('.page-transition');
  const internalLinks = document.querySelectorAll('a[href$=".html"]');
  
  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Skip if same page or external
      if (href.includes('#') || link.target === '_blank') return;
      
      e.preventDefault();
      
      if (pageTransition) {
        pageTransition.classList.add('active');
        
        setTimeout(() => {
          window.location.href = href;
        }, 800);
      } else {
        window.location.href = href;
      }
    });
  });

  /* =========================================================================
     HAMBURGER MENU — Refined
     ========================================================================= */
  const menuBtn = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('menu-close-btn');
  const menuOverlay = document.getElementById('menu-overlay');

  if (menuBtn && closeBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
      menuOverlay.classList.add('active');
      menuBtn.classList.add('active');
    });
    
    closeBtn.addEventListener('click', () => {
      menuOverlay.classList.remove('active');
      menuBtn.classList.remove('active');
    });
    
    menuOverlay.addEventListener('click', (e) => {
      if (e.target === menuOverlay) {
        menuOverlay.classList.remove('active');
        menuBtn.classList.remove('active');
      }
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        menuOverlay.classList.remove('active');
        menuBtn.classList.remove('active');
      }
    });
  }

  /* =========================================================================
     CUSTOM CURSOR — Premium Feel
     ========================================================================= */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    document.body.classList.add('has-custom-cursor');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let cursorVisible = true;

    const DARK_CURSOR_SELECTOR = '.black-banner, .hero-overlay, .footer, .quote-section, [data-cursor-invert], .ih-group-watermark';

    const isOverDarkSurface = (x, y) => {
      const el = document.elementFromPoint(x, y);
      if (!el) return false;
      return el.closest(DARK_CURSOR_SELECTOR) !== null;
    };

    const updateCursor = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
      
      const overDark = isOverDarkSurface(mouseX, mouseY);
      
      // Directly apply inverted styles to ensure they take effect
      if (overDark) {
        cursor.style.setProperty('background-color', '#f7f5f1', 'important');
        cursor.style.setProperty('box-shadow', '0 0 12px rgba(247, 245, 241, 0.5)', 'important');
        follower.style.setProperty('border-color', 'rgba(247, 245, 241, 0.7)', 'important');
      } else {
        cursor.style.removeProperty('background-color');
        cursor.style.removeProperty('box-shadow');
        follower.style.removeProperty('border-color');
        // Restore original styles from CSS
        cursor.style.setProperty('background-color', 'var(--ink)');
        cursor.style.setProperty('box-shadow', '0 0 12px rgba(11, 11, 12, 0.4)');
        follower.style.setProperty('border-color', 'rgba(11, 11, 12, 0.4)');
      }
      
      requestAnimationFrame(updateCursor);
    };

    const showCursor = () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
      cursorVisible = true;
    };

    const hideCursor = () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
      cursorVisible = false;
    };

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorVisible) showCursor();
    });

    // Only hide when pointer actually leaves the window (not when moving over canvas/iframes).
    // mouseleave can fire spuriously over full-screen WebGL canvases on home/services/projects.
    document.addEventListener('mouseout', (e) => {
      const leftWindow = !e.relatedTarget || !document.documentElement.contains(e.relatedTarget);
      if (leftWindow) hideCursor();
    });

    document.addEventListener('mouseenter', () => {
      showCursor();
    });

    updateCursor();

    // Expand on interactive elements
    const hoverables = document.querySelectorAll('a, button, .gallery-item, .project-card, .tilt-card, input, textarea');
    
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('expanded');
        follower.classList.add('expanded');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('expanded');
        follower.classList.remove('expanded');
      });
    });

    // Text mode for text inputs
    const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    textInputs.forEach(input => {
      input.addEventListener('mouseenter', () => cursor.classList.add('text-mode'));
      input.addEventListener('mouseleave', () => cursor.classList.remove('text-mode'));
    });
  }

  /* =========================================================================
     THREE.JS — Cinematic 3D Hero (Architectural Villa)
     ========================================================================= */
  const heroCanvas = document.getElementById('hero-canvas');
  
  if (heroCanvas && typeof THREE !== 'undefined') {
    initHero3D(heroCanvas);
  }

  /* =========================================================================
     THREE.JS — About Blueprint Canvas
     ========================================================================= */
  const blueprintCanvas = document.getElementById('about-blueprint-canvas');
  
  if (blueprintCanvas && typeof THREE !== 'undefined') {
    initBlueprint3D(blueprintCanvas);
  }

  /* =========================================================================
     GSAP SCROLL ANIMATIONS
     ========================================================================= */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 1 });

    // Reveal animations
    document.querySelectorAll('.reveal-up, .reveal-3d').forEach((el, i) => {
      const is3d = el.classList.contains('reveal-3d');
      
      gsap.fromTo(el, {
        opacity: 0,
        y: 50,
        rotateX: is3d ? 12 : 0,
        transformPerspective: is3d ? 1200 : 'none',
      }, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        delay: (i % 3) * 0.08,
      });
    });

    // Gallery reveal
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      gsap.fromTo(item, {
        opacity: 0.3,
        scale: 0.92,
        y: 40,
      }, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        delay: i * 0.1,
      });
    });

    // Project cards stagger
    document.querySelectorAll('.project-card').forEach((card, i) => {
      gsap.fromTo(card, {
        opacity: 0,
        y: 80,
        rotateY: 5,
      }, {
        opacity: 1,
        y: 0,
        rotateY: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        delay: i * 0.12,
      });
    });

    // Blueprint section parallax
    const blueprintSection = document.querySelector('.blueprint-section');
    if (blueprintSection) {
      gsap.to('.blueprint-left', {
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: blueprintSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }

    // Image parallax
    document.querySelectorAll('.view-feel .image-wrapper').forEach(wrapper => {
      const img = wrapper.querySelector('img');
      if (img) {
        gsap.fromTo(img, {
          scale: 1.1,
          y: -30,
        }, {
          scale: 1.2,
          y: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapper,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
    });
  }

  /* =========================================================================
     MAGNETIC BUTTONS — Premium Interaction
     ========================================================================= */
  const magneticBtns = document.querySelectorAll('.nav-cta, .explore-btn, .lux-project-cta, .nav-arrow, .nav-arrow-light');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });

  /* =========================================================================
     GALLERY NAVIGATION
     ========================================================================= */
  const galleryTrack = document.getElementById('gallery-track');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  
  if (galleryTrack && galleryItems.length > 0) {
    let currentIndex = 2; // Start at middle item
    const totalItems = galleryItems.length;
    const itemWidth = galleryItems[0].offsetWidth + 24; // width + gap
    
    const updateGallery = () => {
      galleryItems.forEach((item, i) => {
        item.classList.toggle('active', i === currentIndex);
      });
      
      const offset = -((currentIndex - 1) * itemWidth);
      galleryTrack.style.transform = `translateX(${offset}px)`;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateGallery();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(totalItems - 1, currentIndex + 1);
        updateGallery();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });

    // Auto-advance
    setInterval(() => {
      if (currentIndex < totalItems - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateGallery();
    }, 6000);
  }

  /* =========================================================================
     PROJECTS NAVIGATION
     ========================================================================= */
  const projPrev = document.getElementById('proj-prev');
  const projNext = document.getElementById('proj-next');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (projPrev && projNext && projectCards.length > 0) {
    let projIndex = 0;
    const totalProjects = projectCards.length;

    projPrev.addEventListener('click', () => {
      projIndex = Math.max(0, projIndex - 1);
      projectCards[projIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    projNext.addEventListener('click', () => {
      projIndex = Math.min(totalProjects - 1, projIndex + 1);
      projectCards[projIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* =========================================================================
     3D TILT EFFECT ON CARDS
     ========================================================================= */
  const tiltCards = document.querySelectorAll('.tilt-card, .project-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  });

  /* =========================================================================
     ANIMATED COUNTERS
     ========================================================================= */
  const counters = document.querySelectorAll('.bp-num');
  
  if (counters.length > 0 && typeof gsap !== 'undefined') {
    counters.forEach(counter => {
      const target = parseInt(counter.textContent);
      if (isNaN(target)) return;

      gsap.fromTo(counter, {
        textContent: 0,
      }, {
        textContent: target,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: counter,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  // Initialize scroll position
  window.scrollTo(0, 0);
});

/* =========================================================================
   HERO ANIMATIONS — Cinematic Entrance Sequence
   ========================================================================= */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const heroPretitle = document.querySelector('.hero-pretitle');
  const heroBrand = document.querySelector('.hero-brand');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const heroBox = document.querySelector('.hero-box');

  const tl = gsap.timeline({ delay: 0.5 });

  // Pretitle - first to appear
  if (heroPretitle) {
    tl.fromTo(heroPretitle, {
      opacity: 0,
      y: 20,
      letterSpacing: '1em',
    }, {
      opacity: 1,
      y: 0,
      letterSpacing: '0.5em',
      duration: 1,
      ease: 'power2.out',
    });
  }

  // Brand - main focus
  if (heroBrand) {
    tl.fromTo(heroBrand, {
      opacity: 0,
      y: 100,
      scale: 0.9,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.6,
      ease: 'power3.out',
    }, '-=0.6');
  }

  // Tagline
  if (heroTagline) {
    tl.fromTo(heroTagline, {
      opacity: 0,
      y: 30,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.8');
  }

  // Subtitle
  if (heroSubtitle) {
    tl.fromTo(heroSubtitle, {
      opacity: 0,
      y: 20,
    }, {
      opacity: 0.5,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.4');
  }

  if (scrollIndicator) {
    tl.fromTo(scrollIndicator, {
      opacity: 0,
      y: 20,
    }, {
      opacity: 0.6,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.4');
  }

  // Add parallax to hero box
  if (heroBox) {
    gsap.to(heroBox, {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });
  }
}

/* =========================================================================
   THREE.JS — HERO 3D VILLA
   ========================================================================= */
function initHero3D(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 5, 35);

  // Lighting — Cinematic
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xb8924a, 0.6);
  keyLight.position.set(15, 20, 10);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8888aa, 0.25);
  fillLight.position.set(-10, 5, -10);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.15);
  rimLight.position.set(0, -10, 20);
  scene.add(rimLight);

  // Main group
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Materials — Architectural Wireframe
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x1a1816,
    transparent: true,
    opacity: 0.12,
  });

  const solidMat = new THREE.MeshStandardMaterial({
    color: 0x1a1816,
    transparent: true,
    opacity: 0.03,
    roughness: 0.8,
    metalness: 0.1,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xb8924a,
    transparent: true,
    opacity: 0.15,
    roughness: 0.3,
    metalness: 0.6,
  });

  // Architectural Composition
  const linesGroup = new THREE.Group();
  const solidsGroup = new THREE.Group();
  mainGroup.add(linesGroup);
  mainGroup.add(solidsGroup);

  // Helper: Create architectural box
  function addBox(w, h, d, x, y, z, material = solidMat) {
    const geom = new THREE.BoxGeometry(w, h, d);
    const edges = new THREE.EdgesGeometry(geom);
    const line = new THREE.LineSegments(edges, lineMat);
    line.position.set(x, y, z);
    linesGroup.add(line);

    const mesh = new THREE.Mesh(geom, material);
    mesh.position.set(x, y, z);
    solidsGroup.add(mesh);

    return { line, mesh };
  }

  // Modern Villa Composition
  // Main volume
  addBox(12, 6, 8, 0, 0, 0);
  
  // Upper level (penthouse)
  addBox(7, 4, 6, -3.5, 5, 0);
  
  // Terrace extension
  addBox(5, 2, 8, 4.5, -2, 0);
  
  // Pool area
  addBox(10, 0.5, 5, -2, -3.5, 5);
  
  // Foundation
  addBox(18, 0.3, 14, 0, -3.5, 0, goldMat);

  // Vertical elements (columns)
  for (let i = 0; i < 5; i++) {
    const x = (i - 2) * 3.5;
    addBox(0.3, 6, 0.3, x, 0, 4);
  }

  // Grid floor
  const gridHelper = new THREE.GridHelper(50, 50, 0x1a1816, 0x1a1816);
  gridHelper.position.y = -3.7;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.06;
  mainGroup.add(gridHelper);

  // Technical extension lines
  const techLineMat = new THREE.LineBasicMaterial({
    color: 0x1a1816,
    transparent: true,
    opacity: 0.04,
  });

  for (let i = 0; i < 8; i++) {
    const x = (i - 3.5) * 5;
    const points = [
      new THREE.Vector3(x, -5, -15),
      new THREE.Vector3(x, 15, -15),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, techLineMat);
    linesGroup.add(line);
  }

  // Initial rotation
  mainGroup.rotation.x = 0.25;
  mainGroup.rotation.y = -Math.PI / 6;

  // Animation state
  let targetRotY = -Math.PI / 6;
  let currentRotY = -Math.PI / 6;
  let mouseX = 0;
  let mouseY = 0;
  let scrollProgress = 0;

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
    targetRotY = -Math.PI / 6 + mouseX * 0.15;
  });

  // Scroll tracking
  window.addEventListener('scroll', () => {
    const hero = document.getElementById('home');
    if (hero) {
      scrollProgress = Math.min(1, window.scrollY / (hero.offsetHeight * 0.8));
    }
  }, { passive: true });

  // Animation loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.0008;

    // Gentle floating
    mainGroup.position.y = Math.sin(time * 1.5) * 0.3;

    // Smooth rotation following mouse
    currentRotY += (targetRotY - currentRotY) * 0.03;
    mainGroup.rotation.y = currentRotY;

    // Reveal effect on scroll
    const revealScale = 0.85 + scrollProgress * 0.15;
    solidsGroup.scale.setScalar(revealScale);
    solidsGroup.children.forEach(child => {
      if (child.material) {
        child.material.opacity = 0.02 + scrollProgress * 0.04;
      }
    });

    // Camera approach
    camera.position.z = 35 - scrollProgress * 12;
    camera.lookAt(0, 1, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* =========================================================================
   THREE.JS — ABOUT BLUEPRINT CANVAS
   ========================================================================= */
function initBlueprint3D(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.parentElement.offsetWidth || 400, canvas.parentElement.offsetHeight || 400);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  // Primary color
  const primaryColor = 0x1a1816;
  const goldColor = 0xb8924a;

  // Create layered architectural forms
  // Outer icosahedron wireframe
  const outerGeom = new THREE.IcosahedronGeometry(3.5, 1);
  const outerEdges = new THREE.EdgesGeometry(outerGeom);
  const outerMat = new THREE.LineBasicMaterial({ 
    color: primaryColor, 
    transparent: true, 
    opacity: 0.12 
  });
  const outerWireframe = new THREE.LineSegments(outerEdges, outerMat);
  mainGroup.add(outerWireframe);

  // Middle dodecahedron
  const midGeom = new THREE.DodecahedronGeometry(2.5, 0);
  const midEdges = new THREE.EdgesGeometry(midGeom);
  const midMat = new THREE.LineBasicMaterial({ 
    color: primaryColor, 
    transparent: true, 
    opacity: 0.18 
  });
  const midWireframe = new THREE.LineSegments(midEdges, midMat);
  mainGroup.add(midWireframe);

  // Inner octahedron with gold accent
  const innerGeom = new THREE.OctahedronGeometry(1.8, 0);
  const innerEdges = new THREE.EdgesGeometry(innerGeom);
  const innerMat = new THREE.LineBasicMaterial({ 
    color: goldColor, 
    transparent: true, 
    opacity: 0.35 
  });
  const innerWireframe = new THREE.LineSegments(innerEdges, innerMat);
  mainGroup.add(innerWireframe);

  // Core sphere with subtle glow
  const coreGeom = new THREE.IcosahedronGeometry(0.8, 2);
  const coreEdges = new THREE.EdgesGeometry(coreGeom);
  const coreMat = new THREE.LineBasicMaterial({ 
    color: goldColor, 
    transparent: true, 
    opacity: 0.5 
  });
  const coreWireframe = new THREE.LineSegments(coreEdges, coreMat);
  mainGroup.add(coreWireframe);

  // Floating ring elements
  const ringGeom = new THREE.TorusGeometry(4.2, 0.02, 8, 64);
  const ringMat = new THREE.MeshBasicMaterial({ 
    color: primaryColor, 
    transparent: true, 
    opacity: 0.08 
  });
  const ring1 = new THREE.Mesh(ringGeom, ringMat);
  ring1.rotation.x = Math.PI / 2;
  mainGroup.add(ring1);

  const ring2 = new THREE.Mesh(ringGeom, ringMat.clone());
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.y = Math.PI / 4;
  mainGroup.add(ring2);

  // Particle-like vertices
  const particleGeom = new THREE.BufferGeometry();
  const particleCount = 50;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const radius = 2 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({ 
    color: goldColor, 
    size: 0.05, 
    transparent: true, 
    opacity: 0.4 
  });
  const particles = new THREE.Points(particleGeom, particleMat);
  mainGroup.add(particles);

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.004;

    // Smooth multi-axis rotation
    mainGroup.rotation.y = time;
    mainGroup.rotation.x = Math.sin(time * 0.3) * 0.15;
    mainGroup.rotation.z = Math.cos(time * 0.2) * 0.08;

    // Counter-rotate core for visual interest
    coreWireframe.rotation.y = -time * 1.5;
    innerWireframe.rotation.x = time * 0.8;

    // Animate rings
    ring1.rotation.z = time * 0.2;
    ring2.rotation.z = -time * 0.15;

    // Subtle floating motion
    mainGroup.position.y = Math.sin(time * 0.5) * 0.1;

    renderer.render(scene, camera);
  }

  animate();

  // Resize observer
  const resizeObserver = new ResizeObserver(() => {
    const parent = canvas.parentElement;
    if (parent) {
      const width = parent.offsetWidth;
      const height = parent.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
  });
  
  if (canvas.parentElement) {
    resizeObserver.observe(canvas.parentElement);
  }
}

/* =========================================================================
   CINEMATIC CURSOR SYSTEM — Global Effects Module
   ========================================================================= */
(function() {
  'use strict';

  // Feature detection
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Disable on touch or reduced motion
  if (isTouch || prefersReducedMotion) {
    // Ensure default cursor behavior
    document.body.classList.remove('has-custom-cursor');
    return;
  }

  // Enable custom cursor
  document.body.classList.add('has-custom-cursor');

  // Get cursor elements
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  
  if (!cursor || !cursorFollower) return;

  // Show cursor - add active class
  cursor.classList.add('active');
  cursorFollower.classList.add('active');

  // Mouse position tracking
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let followerX = 0;
  let followerY = 0;

  // Update global CSS variables
  function updateGlobalPosition(x, y) {
    const nx = x / window.innerWidth;
    const ny = y / window.innerHeight;
    document.documentElement.style.setProperty('--mx', nx.toFixed(3));
    document.documentElement.style.setProperty('--my', ny.toFixed(3));
  }

  // Mouse move handler
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateGlobalPosition(mouseX, mouseY);
  });

  // Smooth cursor animation using RAF
  function animateCursor() {
    // Smooth follow for inner cursor (faster)
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    // Smooth follow for outer ring (slower, more cinematic)
    followerX += (mouseX - followerX) * 0.08;
    followerY += (mouseY - followerY) * 0.08;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Cursor focus states for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .tilt3d');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('focus');
      cursorFollower.classList.add('focus');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('focus');
      cursorFollower.classList.remove('focus');
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('active');
    cursorFollower.classList.remove('active');
  });

  document.addEventListener('mouseenter', () => {
    cursor.classList.add('active');
    cursorFollower.classList.add('active');
  });

  /* =========================================================================
     TILT 3D EFFECTS — Per-element mouse tracking
     ========================================================================= */
  const tiltElements = document.querySelectorAll('.tilt3d');
  
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      
      el.style.setProperty('--px', px.toFixed(3));
      el.style.setProperty('--py', py.toFixed(3));
    });

    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--px', '0.5');
      el.style.setProperty('--py', '0.5');
    });
  });

  /* =========================================================================
     AMBIENT DRIFT — Subtle background parallax
     ========================================================================= */
  const ambientElements = document.querySelectorAll('.ambient-drift');
  
  if (ambientElements.length > 0) {
    let driftRAF = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      
      targetX = nx * 15; // Max 15px drift
      targetY = ny * 15;
    });

    function animateDrift() {
      currentX += (targetX - currentX) * 0.03;
      currentY += (targetY - currentY) * 0.03;

      ambientElements.forEach(el => {
        el.style.transform = `translate(${currentX}px, ${currentY}px)`;
      });

      driftRAF = requestAnimationFrame(animateDrift);
    }

    animateDrift();
  }

  // Console confirmation
  // Cinematic effects initialized
})();
/* =========================================================================
   BACK TO TOP BUTTON
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const backToTop = document.getElementById('back-to-top');
  
  if (backToTop) {
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });
    
    // Scroll to top on click
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
