/* =========================================================================
   LUXURY SCRIPT v2 — IH Atelier
   Production-Ready | Cinematic | Refined Animations
   ========================================================================= */

// Prevent FOUC - removed to prevent blank page locally
// document.documentElement.style.visibility = 'hidden';
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

document.addEventListener('DOMContentLoaded', () => {

  // Single source of truth: true only on real pointer devices (desktop/laptop).
  // Touch phones/tablets return false even if they occasionally fire mouse events.
  const isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* =========================================================================
     PAGE LOADER — Cinematic Reveal
     ========================================================================= */
  const pageLoader = document.querySelector('.page-loader');
  if (pageLoader) {
    // body.loading (set in HTML) triggers CSS logo animation automatically.
    // After page load + brief hold, fade out loader and reveal content.
    let loaderHidden = false;
    const hideLoader = () => {
      if (loaderHidden) return;
      loaderHidden = true;
      pageLoader.style.transition = 'opacity 0.6s ease';
      pageLoader.style.opacity = '0';
      pageLoader.style.pointerEvents = 'none';
      setTimeout(() => {
        pageLoader.style.display = 'none';
        document.body.classList.remove('loading');
        initHeroAnimations();
      }, 600);
    };
    // Wait for full page load, then hold for ~1.2s so logo animation completes
    window.addEventListener('load', () => setTimeout(hideLoader, 1200));
    // Hard fallback in case load fires very late
    setTimeout(hideLoader, 4000);
  } else {
    initHeroAnimations();
  }

  /* =========================================================================
     LENIS SMOOTH SCROLL — Premium Feel
     ========================================================================= */
  // Lenis smooth scroll — desktop/pointer only; touch devices use native momentum
  let lenis;
  const isTouchDevice = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
  if (typeof Lenis !== 'undefined' && !isTouchDevice) {
    lenis = new Lenis({
      duration: 1.0,
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

  /* =========================================================================
     NAVIGATION — Blur + Scale + Page Transition
     ========================================================================= */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    // rAF-gate: coalesce to one update per animation frame max
    let _navTicking = false;
    window.addEventListener('scroll', () => {
      if (_navTicking) return;
      _navTicking = true;
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
        _navTicking = false;
      });
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
    let overDark = false; // cached — only updated on mousemove
    let mouseMoved = false;

    const DARK_CURSOR_SELECTOR = '.black-banner, .hero-overlay, .footer, .quote-section, [data-cursor-invert], .ih-group-watermark';

    // rAF handle — null when loop is idle (demand-driven, not infinite)
    let cursorRAF = null;
    const scheduleCursorUpdate = () => {
      if (!cursorRAF) cursorRAF = requestAnimationFrame(updateCursor);
    };

    // Half-sizes match CSS: cursor=10px → 5, follower=44px → 22
    const CURSOR_HALF = 5;
    const FOLLOWER_HALF = 22;

    const updateCursor = () => {
      cursorRAF = null;
      const dx = mouseX - followerX;
      const dy = mouseY - followerY;
      followerX += dx * 0.12;
      followerY += dy * 0.12;

      // translate3d triggers GPU compositing — faster than translate(calc(...))
      follower.style.transform = `translate3d(${followerX - FOLLOWER_HALF}px,${followerY - FOLLOWER_HALF}px,0)`;

      // Keep looping only while follower is still catching up (> 0.05px away)
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        cursorRAF = requestAnimationFrame(updateCursor);
      }
    };

    const applyCursorColor = (dark) => {
      if (dark) {
        cursor.style.setProperty('background-color', '#f7f5f1', 'important');
        cursor.style.setProperty('box-shadow', '0 0 12px rgba(247, 245, 241, 0.5)', 'important');
        follower.style.setProperty('border-color', 'rgba(247, 245, 241, 0.7)', 'important');
      } else {
        cursor.style.removeProperty('background-color');
        cursor.style.removeProperty('box-shadow');
        follower.style.removeProperty('border-color');
        cursor.style.setProperty('background-color', 'var(--ink)');
        cursor.style.setProperty('box-shadow', '0 0 12px rgba(11, 11, 12, 0.4)');
        follower.style.setProperty('border-color', 'rgba(11, 11, 12, 0.4)');
      }
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

    let _efpTimer = null;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorVisible) showCursor();

      // Dot cursor: update instantly in mousemove (not rAF) so it never lags
      // behind the physical pointer — critical on high-refresh-rate Windows screens
      cursor.style.transform = `translate3d(${mouseX - CURSOR_HALF}px,${mouseY - CURSOR_HALF}px,0)`;

      // Follower ring: rAF-driven lerp for the intentional trailing effect
      scheduleCursorUpdate();

      // Throttle elementFromPoint to ~10fps — avoids forced layout on every mousemove
      if (!_efpTimer) {
        _efpTimer = setTimeout(() => {
          const el = document.elementFromPoint(mouseX, mouseY);
          if (el) {
            const nowDark = el.closest(DARK_CURSOR_SELECTOR) !== null;
            if (nowDark !== overDark) {
              overDark = nowDark;
              applyCursorColor(overDark);
            }
            
            // Fallback for hover states (e.g. when returning to window or window is inactive)
            const isHoverable = el.closest('a, button, .gallery-item, .project-card, .tilt-card, input, textarea') !== null;
            if (isHoverable) {
              cursor.classList.add('expanded');
              follower.classList.add('expanded');
            } else {
              cursor.classList.remove('expanded');
              follower.classList.remove('expanded');
            }

            const isText = el.closest('input[type="text"], input[type="email"], textarea') !== null;
            if (isText) cursor.classList.add('text-mode');
            else cursor.classList.remove('text-mode');
          }
          _efpTimer = null;
        }, 100);
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      const leftWindow = !e.relatedTarget || !document.documentElement.contains(e.relatedTarget);
      if (leftWindow) hideCursor();
    });

    document.addEventListener('mouseenter', () => { showCursor(); });

    // No longer call updateCursor() here — loop now starts on first mousemove

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
     THREE.JS — Cinematic 3D Hero (only on pages that have the canvas)
     ========================================================================= */
  const heroCanvas = document.getElementById('hero-canvas');

  // Skip 3D entirely on touch/mobile — saves ~1.5 MB of GPU work and battery
  if (heroCanvas && typeof THREE !== 'undefined' && !isTouchDevice) {
    // Defer Three.js init slightly so CSS and layout paint first
    requestAnimationFrame(() => initHero3D(heroCanvas));
  }

  /* =========================================================================
     THREE.JS — About Blueprint Canvas
     ========================================================================= */
  const blueprintCanvas = document.getElementById('about-blueprint-canvas');

  if (blueprintCanvas && typeof THREE !== 'undefined' && !isTouchDevice) {
    requestAnimationFrame(() => initBlueprint3D(blueprintCanvas));
  }

  /* =========================================================================
     GSAP SCROLL ANIMATIONS
     ========================================================================= */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 1 });

    // Reveal animations — always start from invisible even if already in viewport
    document.querySelectorAll('.reveal-up, .reveal-3d').forEach((el, i) => {
      const is3d = el.classList.contains('reveal-3d');
      const rect = el.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight;

      gsap.fromTo(el, {
        opacity: 0,
        y: 50,
        rotateX: is3d ? 12 : 0,
        transformPerspective: is3d ? 1200 : 'none',
      }, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.0,
        ease: 'power3.out',
        delay: alreadyVisible ? (i % 3) * 0.08 : 0,
        scrollTrigger: alreadyVisible ? null : {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
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

    // Project cards stagger (exclude carousel cards — carousel manages their own states)
    document.querySelectorAll('.project-card:not(.carousel-card)').forEach((card, i) => {
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

    // Parallax effects — skip on touch devices to avoid scroll jank
    if (isPointerFine) {
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
  }

  /* =========================================================================
     MAGNETIC BUTTONS — Premium Interaction (desktop/pointer only)
     ========================================================================= */
  // Magnetic pull is meaningless on touch — skip entirely to avoid wasted listeners
  if (isPointerFine) {
    const magneticBtns = document.querySelectorAll('.nav-cta, .explore-btn, .lux-project-cta, .nav-arrow, .nav-arrow-light');

    magneticBtns.forEach(btn => {
      // Cache rect on enter — avoids a layout read on every mousemove tick
      let cachedRect = null;
      btn.addEventListener('mouseenter', () => {
        cachedRect = btn.getBoundingClientRect();
      }, { passive: true });

      btn.addEventListener('mousemove', (e) => {
        if (!cachedRect) cachedRect = btn.getBoundingClientRect();
        const x = e.clientX - cachedRect.left - cachedRect.width / 2;
        const y = e.clientY - cachedRect.top - cachedRect.height / 2;

        gsap.to(btn, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.4,
          ease: 'power2.out',
        });
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        cachedRect = null;
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)',
        });
      }, { passive: true });
    });
  }

  /* =========================================================================
     CLIENT LOGOS — Seamless loop (exact pixel step so no jump at Joyalukkas)
     ========================================================================= */
  const logosContainer = document.querySelector('.client-logos-container');
  const logosTrack = document.querySelector('.client-logos-track');
  const logosSlide = document.querySelector('.client-logos-slide');
  if (logosContainer && logosTrack && logosSlide) {
    const updateLogosStep = () => {
      const slideWidth = logosContainer.offsetWidth;
      const margin = parseFloat(getComputedStyle(logosSlide).marginRight) || 0;
      logosTrack.style.setProperty('--logos-step', `-${slideWidth + margin}px`);
    };
    updateLogosStep();
    // Debounced resize — avoids the raw CSS recalc on every resize event
    let _logosResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(_logosResizeTimer);
      _logosResizeTimer = setTimeout(updateLogosStep, 150);
    }, { passive: true });
  }

  /* =========================================================================
     GALLERY NAVIGATION
     ========================================================================= */
  const galleryTrack = document.getElementById('gallery-track');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (galleryTrack && galleryItems.length > 0) {
    const totalItems = galleryItems.length;
    const hasClones = totalItems > 5; // index.html has 10 (5+5 clones), index-v2 has 5
    const originalCount = hasClones ? 5 : totalItems;
    let currentIndex = Math.min(2, Math.floor(totalItems / 2)); // Start at middle
    let resetTimeout = null;
    let cachedItemWidth = 300; // fallback value
    let pendingUpdate = null;

    const updateItemWidth = () => {
      const gap = 24;
      cachedItemWidth = (galleryItems[0]?.offsetWidth || 300) + gap;
    };

    // Initialize cached width on load
    updateItemWidth();

    // Update cached width on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateItemWidth, 150);
    }, { passive: true });

    const updateGallery = (animate = true) => {
      // Cancel any pending update to avoid duplicate work
      if (pendingUpdate) cancelAnimationFrame(pendingUpdate);

      pendingUpdate = requestAnimationFrame(() => {
        galleryItems.forEach((item, i) => {
          item.classList.toggle('active', i === currentIndex);
        });

        const offset = -((currentIndex - 1) * cachedItemWidth);
        if (animate) {
          galleryTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        } else {
          galleryTrack.style.transition = 'none';
        }
        // translate3d promotes the track to its own compositor layer — no repaint on slide
        galleryTrack.style.transform = `translate3d(${offset}px,0,0)`;
        pendingUpdate = null;
      });
    };

    const nextSlide = () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
        resetTimeout = null;
      }

      currentIndex++;

      if (hasClones) {
        // Seamless loop: when we reach the clone zone, animate then jump back
        updateGallery();
        if (currentIndex >= originalCount + 2) {
          resetTimeout = setTimeout(() => {
            currentIndex = currentIndex - originalCount;
            updateGallery(false);
            resetTimeout = null;
          }, 510);
        }
      } else {
        // No clones: wrap at boundaries so we never go past visible items
        currentIndex = ((currentIndex % totalItems) + totalItems) % totalItems;
        updateGallery();
      }
    };

    const prevSlide = () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
        resetTimeout = null;
      }

      currentIndex--;

      if (hasClones) {
        updateGallery();
        if (currentIndex < 0) {
          resetTimeout = setTimeout(() => {
            currentIndex = currentIndex + originalCount;
            updateGallery(false);
            resetTimeout = null;
          }, 510);
        }
      } else {
        currentIndex = ((currentIndex % totalItems) + totalItems) % totalItems;
        updateGallery();
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && prevBtn) prevSlide();
      if (e.key === 'ArrowRight' && nextBtn) nextSlide();
    });

    // Auto-advance — pauses when tab is hidden to avoid queued jumps on return
    let galleryInterval = setInterval(nextSlide, 6000);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(galleryInterval);
        galleryInterval = null;
      } else if (!galleryInterval) {
        galleryInterval = setInterval(nextSlide, 6000);
      }
    });
  }

  /* =========================================================================
     PROJECTS INFINITE CAROUSEL — Center-Focus with Infinite Loop
     ========================================================================= */
  const carouselViewport = document.querySelector('.projects-carousel-viewport');
  const carouselTrack = document.getElementById('projects-carousel-track');

  if (carouselViewport && carouselTrack && typeof gsap !== 'undefined') {
    const carouselCards = Array.from(carouselTrack.querySelectorAll('.carousel-card'));
    // Layout: [clone_B1, clone_B2, real_0, real_1, real_2, clone_A1, clone_A2] = 7 total
    const totalCards = carouselCards.length;
    const realCount = 5;                          // 5 real projects
    const clonesPerSide = (totalCards - realCount) / 2; // = 2

    let activeIndex = clonesPerSide; // Start on real card 0
    let isAnimating = false;

    // Total horizontal space each card occupies (width + both margins)
    const getCardStep = () => {
      const card = carouselCards[0];
      const s = getComputedStyle(card);
      return card.offsetWidth + parseFloat(s.marginLeft) + parseFloat(s.marginRight);
    };

    // x value that centers card[index] inside the viewport
    const getTrackX = (index) => {
      const step = getCardStep();
      const cardW = carouselCards[0].offsetWidth;
      return carouselViewport.offsetWidth / 2 - cardW / 2 - index * step;
    };

    // Update scale / opacity of every card; optionally animated
    const applyCardStates = (animate) => {
      const dur = animate ? 0.55 : 0;
      const ease = 'power2.inOut';
      carouselCards.forEach((card, i) => {
        const dist = Math.abs(i - activeIndex);
        if (dist === 0) {
          gsap.to(card, { scale: 1.07, opacity: 1, duration: dur, ease, overwrite: 'auto' });
          card.style.zIndex = '3';
          card.classList.add('carousel-is-active');
        } else if (dist === 1) {
          gsap.to(card, { scale: 0.93, opacity: 0.75, duration: dur, ease, overwrite: 'auto' });
          card.style.zIndex = '2';
          card.classList.remove('carousel-is-active');
        } else {
          gsap.to(card, { scale: 0.88, opacity: 0.45, duration: dur, ease, overwrite: 'auto' });
          card.style.zIndex = '1';
          card.classList.remove('carousel-is-active');
        }
      });
    };

    // Translate the track; onDone fires after the tween completes
    const slideTrack = (index, animate, onDone) => {
      gsap.to(carouselTrack, {
        x: getTrackX(index),
        duration: animate ? 0.65 : 0,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: onDone || (() => { isAnimating = false; }),
      });
    };

    // After animating into the clone zone, silently teleport to the matching real card
    const handleCloneJump = () => {
      if (activeIndex < clonesPerSide) {
        activeIndex += realCount;           // wrapped past left edge
      } else if (activeIndex >= clonesPerSide + realCount) {
        activeIndex -= realCount;           // wrapped past right edge
      }
      slideTrack(activeIndex, false);       // instant reposition (no transition)
      applyCardStates(false);
      isAnimating = false;
    };

    const goNext = () => {
      if (isAnimating) return;
      isAnimating = true;
      activeIndex++;
      applyCardStates(true);
      slideTrack(activeIndex, true, () => {
        if (activeIndex >= clonesPerSide + realCount) {
          handleCloneJump();
        } else {
          isAnimating = false;
        }
      });
    };

    const goPrev = () => {
      if (isAnimating) return;
      isAnimating = true;
      activeIndex--;
      applyCardStates(true);
      slideTrack(activeIndex, true, () => {
        if (activeIndex < clonesPerSide) {
          handleCloneJump();
        } else {
          isAnimating = false;
        }
      });
    };

    // Bootstrap — double rAF ensures layout is fully painted before measuring
    requestAnimationFrame(() => requestAnimationFrame(() => {
      slideTrack(activeIndex, false);
      applyCardStates(false);
    }));

    // Re-center on resize (no animation, just snap)
    let projResizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(projResizeTimer);
      projResizeTimer = setTimeout(() => slideTrack(activeIndex, false), 150);
    }, { passive: true });

    // Arrow buttons
    const projPrevBtn = document.getElementById('proj-prev');
    const projNextBtn = document.getElementById('proj-next');
    if (projPrevBtn) projPrevBtn.addEventListener('click', goPrev);
    if (projNextBtn) projNextBtn.addEventListener('click', goNext);

    // Touch / swipe
    let touchStartX = 0;
    let touchStartT = 0;
    carouselViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartT = Date.now();
    }, { passive: true });
    carouselViewport.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50 && Date.now() - touchStartT < 400) {
        dx < 0 ? goNext() : goPrev();
      }
    }, { passive: true });
  }

  /* =========================================================================
     3D TILT EFFECT ON CARDS (desktop/pointer only)
     ========================================================================= */
  // Touch events can fire synthetic mouse events — guarding avoids unnecessary
  // GSAP layout work on every tap on mobile.
  if (isPointerFine) {
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
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      }, { passive: true });
    });
  }

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
   HERO ANIMATIONS — Entrance Sequence
   ========================================================================= */
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const heroBrand = document.querySelector('.hero-brand');
  const heroTagline = document.querySelector('.hero-tagline');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const heroBox = document.querySelector('.hero-box');

  const tl = gsap.timeline({ delay: 0.3 });

  if (heroBrand) {
    tl.fromTo(heroBrand, {
      opacity: 0,
      y: 80,
      scale: 0.95,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.4,
      ease: 'power3.out',
    });
  }

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

  // Hero parallax — skip on touch to prevent scroll jank
  if (heroBox && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
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
    color: 0x6b7a8c,
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

  // Mouse tracking — desktop only; touch devices have no mouse to track
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5);
      mouseY = (e.clientY / window.innerHeight - 0.5);
      targetRotY = -Math.PI / 6 + mouseX * 0.15;
    }, { passive: true });
  }

  // Scroll tracking — cache offsetHeight so scroll handler never triggers layout
  const heroEl = document.getElementById('home');
  let heroH = heroEl ? heroEl.offsetHeight : window.innerHeight;
  window.addEventListener('resize', () => {
    heroH = heroEl ? heroEl.offsetHeight : window.innerHeight;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollProgress = Math.min(1, window.scrollY / (heroH * 0.8 || 1));
  }, { passive: true });

  // Animation loop — fully cancels when tab hidden or canvas off-screen
  let heroAnimRAF = null;
  let time = 0;

  function animate() {
    heroAnimRAF = requestAnimationFrame(animate);
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

  // Pause / resume helpers
  const pauseHero  = () => { if (heroAnimRAF) { cancelAnimationFrame(heroAnimRAF); heroAnimRAF = null; } };
  const resumeHero = () => { if (!heroAnimRAF) animate(); };

  // Stop loop when tab goes to background; restart on focus
  document.addEventListener('visibilitychange', () =>
    document.hidden ? pauseHero() : resumeHero());

  // Stop loop when canvas scrolls fully out of view
  new IntersectionObserver(([entry]) =>
    entry.isIntersecting ? resumeHero() : pauseHero(),
    { threshold: 0 }
  ).observe(canvas);

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
  const goldColor = 0x6b7a8c;

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
  let blueprintRAF = null;

  function animate() {
    blueprintRAF = requestAnimationFrame(animate);
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

  // Pause / resume helpers
  const pauseBlueprint  = () => { if (blueprintRAF) { cancelAnimationFrame(blueprintRAF); blueprintRAF = null; } };
  const resumeBlueprint = () => { if (!blueprintRAF) animate(); };

  // Stop render loop when tab is hidden
  document.addEventListener('visibilitychange', () =>
    document.hidden ? pauseBlueprint() : resumeBlueprint());

  // Stop render loop when canvas scrolls out of view
  new IntersectionObserver(([entry]) =>
    entry.isIntersecting ? resumeBlueprint() : pauseBlueprint(),
    { threshold: 0 }
  ).observe(canvas);

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