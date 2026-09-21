/**
 * ====================================================================
 * Anisha Khanduja Studio - Interactive UI Effects (ui.js)
 * ====================================================================
 * Manages mobile navigation, carve-to-print interactive reveal,
 * scroll-reveal animations, and desktop custom ink cursor.
 */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileNav();
  initHeroShowcase();
  initCustomCursor();
  initScrollReveal();
  initSmoothScroll();
});

// 1. Sticky Header
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }, { passive: true });
}

// 2. Mobile Navigation Overlay
function initMobileNav() {
  const menuToggle = document.getElementById("menu-toggle-btn");
  const mobileOverlay = document.getElementById("mobile-nav-overlay");
  const mobilePanel = document.getElementById("mobile-nav-panel");
  const mobileClose = document.getElementById("mobile-nav-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuToggle || !mobileOverlay || !mobilePanel) return;

  function openMenu() {
    menuToggle.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileOverlay.classList.add("open");
    mobilePanel.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileOverlay.classList.remove("open");
    mobilePanel.classList.remove("open");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = mobilePanel.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  if (mobileClose) mobileClose.addEventListener("click", closeMenu);
  mobileOverlay.addEventListener("click", closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}

// 3. Interactive Hero Artwork Spotlight & Craft Loupe Inspector
function initHeroShowcase() {
  const stage = document.getElementById("hero-showcase-stage");
  const img = document.getElementById("hero-showcase-img");
  const lens = document.getElementById("hero-loupe-lens");
  const titleEl = document.getElementById("hero-showcase-title");
  const metaEl = document.getElementById("hero-showcase-meta-text");
  const detailsBtn = document.getElementById("hero-view-details-btn");
  const pills = document.querySelectorAll(".showcase-pill");

  if (!stage || !img) return;

  const artworks = [
    {
      id: "piece-01",
      title: "Ordinary Objects - I",
      meta: "A/P Edition of 8 · Somerset Velvet Paper",
      price: "₹3,400",
      image: "assets/img/prints/ordinary-objects-1.jpg"
    },
    {
      id: "piece-02",
      title: "Moon",
      meta: "A/P Edition of 6 · Indian Khadi Cotton Rag",
      price: "₹2,600",
      image: "assets/img/prints/moon.jpg"
    },
    {
      id: "piece-03",
      title: "Ordinary Objects - III",
      meta: "A/P Edition of 7 · Fabriano Rosaspina Paper",
      price: "₹3,800",
      image: "assets/img/prints/ordinary-objects-3.png"
    },
    {
      id: "piece-04",
      title: "Shelter",
      meta: "A/P Edition of 6 · Somerset Satin Paper",
      price: "₹3,200",
      image: "assets/img/prints/shelter.png"
    }
  ];

  let currentIndex = 0;
  let autoTimer = null;
  let isHovered = false;

  function switchArtwork(index) {
    if (index < 0 || index >= artworks.length) return;
    currentIndex = index;
    const art = artworks[currentIndex];

    // Fade transition
    img.classList.add("fade-out");
    setTimeout(() => {
      img.src = art.image;
      img.alt = `${art.title} - original linocut print`;
      if (titleEl) titleEl.textContent = art.title;
      if (metaEl) metaEl.textContent = `${art.meta} · ${art.price}`;
      if (detailsBtn) detailsBtn.dataset.openModal = art.id;
      
      // Update loupe background if lens exists
      if (lens) {
        lens.style.backgroundImage = `url('${art.image}')`;
      }

      img.classList.remove("fade-out");
    }, 180);

    // Update active pill
    pills.forEach((p, idx) => {
      if (idx === currentIndex) {
        p.classList.add("active");
      } else {
        p.classList.remove("active");
      }
    });
  }

  // Pill click handlers
  pills.forEach((pill, idx) => {
    pill.addEventListener("click", () => {
      switchArtwork(idx);
      resetAutoPlay();
    });
  });

  // Open modal when clicking details button or stage
  if (detailsBtn) {
    detailsBtn.addEventListener("click", () => {
      const art = artworks[currentIndex];
      if (window.studioGallery) {
        const prod = window.studioGallery.products.find(p => p.id === art.id);
        if (prod) window.studioGallery.openModal(prod);
      }
    });
  }

  // Magnifier Loupe: Craft & Ink Texture Inspector
  if (lens) {
    const zoomFactor = 2.4;

    function moveLoupe(e) {
      const rect = stage.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
        lens.classList.remove("active");
        return;
      }

      lens.classList.add("active");
      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;

      // Position zoomed image inside lens
      const bgW = rect.width * zoomFactor;
      const bgH = rect.height * zoomFactor;
      const bgX = -(x * zoomFactor - 75);
      const bgY = -(y * zoomFactor - 75);

      lens.style.backgroundSize = `${bgW}px ${bgH}px`;
      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    }

    stage.addEventListener("mousemove", moveLoupe);
    stage.addEventListener("mouseenter", (e) => {
      isHovered = true;
      lens.style.backgroundImage = `url('${artworks[currentIndex].image}')`;
      moveLoupe(e);
    });
    stage.addEventListener("mouseleave", () => {
      isHovered = false;
      lens.classList.remove("active");
    });

    stage.addEventListener("touchmove", moveLoupe, { passive: true });
    stage.addEventListener("touchend", () => {
      lens.classList.remove("active");
    });
  }

  // Gentle auto-rotation every 6s
  function startAutoPlay() {
    autoTimer = setInterval(() => {
      if (!isHovered && !document.hidden) {
        const next = (currentIndex + 1) % artworks.length;
        switchArtwork(next);
      }
    }, 6000);
  }

  function resetAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
    startAutoPlay();
  }

  startAutoPlay();
  // Initial setup
  switchArtwork(0);
}

// 4. Interactive Drawing Cursor Effect (Skiper UI skiper59 style)
// Canvas-based line drawing with smooth quadratic Bézier curves,
// dynamic velocity tapering, fading decay trail, and spring follower cursor.
const SKIPER_CURSOR_CONFIG = {
  type: "drawAlways",           // "drawAlways" (draws on mouse movement) | "drawOnHold" (draws only on mouse down)
  strokeColor: "#2B2530",       // Authentic relief ink color
  strokeWidth: 2.8,             // Base stroke width in pixels
  minWidth: 1.2,                // Minimum stroke thickness
  maxWidth: 4.8,                // Peak stroke thickness
  fadeDuration: 1100,           // Trail fade-out duration in milliseconds (1.1s)
  followEffect: true,           // Smooth quadratic spline curve interpolation
  customCursor: true,           // Custom precision dot & spring follower ring
  springDelay: 0.18,            // Lerp factor for follower ring
  hoverSelector: "a, button, input, textarea, select, summary, [role='button'], .btn, .chip, .card-pressable, .insta-item, .cart-item-remove, .modal-close"
};

// Expose on window for easy developer inspection and customization
window.SKIPER_CURSOR_CONFIG = SKIPER_CURSOR_CONFIG;

function initCustomCursor() {
  // Only enable for desktop mice/trackpads
  if (!window.matchMedia("(pointer: fine)").matches) return;
  // Respect reduced motion accessibility setting
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("cursor-drawing-canvas");
  const cursorContainer = document.getElementById("custom-cursor");
  if (!canvas || !cursorContainer) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dotEl = cursorContainer.querySelector(".cursor-dot");
  const ringEl = cursorContainer.querySelector(".cursor-ring");

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = window.devicePixelRatio || 1;

  let mouseX = -200;
  let mouseY = -200;
  let ringX = -200;
  let ringY = -200;
  let isMouseDown = false;
  let isVisible = false;
  let isDrawing = false;
  let animId = null;

  // Track active strokes: array of point arrays
  let strokes = [];
  let currentStroke = null;
  let lastPointTime = 0;

  // Helper: parse Hex / RGB color string into { r, g, b }
  function parseColor(colorStr) {
    if (colorStr.startsWith("#")) {
      let hex = colorStr.slice(1);
      if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
      const num = parseInt(hex, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }
    return { r: 43, g: 37, b: 48 };
  }

  let rgb = parseColor(SKIPER_CURSOR_CONFIG.strokeColor);

  // Resize canvas to match window & DPI
  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  resizeCanvas();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 150);
  }, { passive: true });

  // Start a new stroke path
  function startNewStroke(x, y, now) {
    currentStroke = [];
    strokes.push(currentStroke);
    addPointToStroke(x, y, now);
  }

  // Append a point to the active stroke with dynamic thickness
  function addPointToStroke(x, y, now) {
    if (!currentStroke) {
      currentStroke = [];
      strokes.push(currentStroke);
    }

    const cfg = SKIPER_CURSOR_CONFIG;
    let strokeW = cfg.strokeWidth;

    if (currentStroke.length > 0) {
      const prev = currentStroke[currentStroke.length - 1];
      const dist = Math.hypot(x - prev.x, y - prev.y);
      const dt = Math.max(1, now - prev.time);
      const velocity = dist / dt;

      // Dynamic width: slightly thicker on hold, slightly tapered on fast movement
      const holdBoost = isMouseDown ? 1.5 : 0;
      const speedTaper = Math.min(velocity * 0.25, 1.2);
      strokeW = Math.max(cfg.minWidth, Math.min(cfg.maxWidth, cfg.strokeWidth + holdBoost - speedTaper));
    }

    currentStroke.push({
      x,
      y,
      time: now,
      width: strokeW
    });

    lastPointTime = now;
  }

  // Animation render loop
  function loop() {
    const now = performance.now();
    const cfg = SKIPER_CURSOR_CONFIG;

    // 1. Follower ring spring lerp
    if (cfg.customCursor && ringEl) {
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      ringX += dx * cfg.springDelay;
      ringY += dy * cfg.springDelay;
      ringEl.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    }

    // 2. Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 3. Prune expired points from strokes
    let hasLivePoints = false;

    for (let s = 0; s < strokes.length; s++) {
      const stroke = strokes[s];
      while (stroke.length > 0 && (now - stroke[0].time) >= cfg.fadeDuration) {
        stroke.shift();
      }

      if (stroke.length === 0) continue;
      hasLivePoints = true;

      // Draw stroke
      if (stroke.length === 1) {
        const p = stroke[0];
        const alpha = Math.max(0, 1 - (now - p.time) / cfg.fadeDuration);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(3)})`;
        ctx.fill();
      } else if (cfg.followEffect) {
        // Draw smooth quadratic spline curves segment by segment
        for (let i = 0; i < stroke.length - 1; i++) {
          const p0 = stroke[i];
          const p1 = stroke[i + 1];
          const midX = (p0.x + p1.x) / 2;
          const midY = (p0.y + p1.y) / 2;

          const age = now - p0.time;
          const alpha = Math.max(0, 1 - (age / cfg.fadeDuration));
          const segWidth = p0.width * (0.35 + 0.65 * alpha);

          ctx.beginPath();
          if (i === 0) {
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(midX, midY);
          } else {
            const prevP = stroke[i - 1];
            const prevMidX = (prevP.x + p0.x) / 2;
            const prevMidY = (prevP.y + p0.y) / 2;
            ctx.moveTo(prevMidX, prevMidY);
            ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
          }

          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = segWidth;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();

          // Connect smoothly to the last point
          if (i === stroke.length - 2) {
            ctx.beginPath();
            ctx.moveTo(midX, midY);
            ctx.lineTo(p1.x, p1.y);
            const p1Alpha = Math.max(0, 1 - ((now - p1.time) / cfg.fadeDuration));
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p1Alpha.toFixed(3)})`;
            ctx.lineWidth = p1.width * (0.35 + 0.65 * p1Alpha);
            ctx.stroke();
          }
        }
      } else {
        // Straight line fallback
        for (let i = 0; i < stroke.length - 1; i++) {
          const p0 = stroke[i];
          const p1 = stroke[i + 1];
          const alpha = Math.max(0, 1 - ((now - p0.time) / cfg.fadeDuration));
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(3)})`;
          ctx.lineWidth = p0.width;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      }
    }

    // Remove empty strokes
    strokes = strokes.filter(s => s.length > 0);

    // If there are points to render or the follower ring is still catching up, keep looping
    const ringSettling = Math.hypot(mouseX - ringX, mouseY - ringY) > 0.4;

    if (hasLivePoints || ringSettling || isDrawing) {
      animId = requestAnimationFrame(loop);
    } else {
      animId = null;
    }
  }

  function startLoopIfNeeded() {
    if (!animId) {
      animId = requestAnimationFrame(loop);
    }
  }

  // Mouse movement handler
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const now = performance.now();

    if (!isVisible) {
      isVisible = true;
      cursorContainer.classList.add("visible");
      ringX = mouseX;
      ringY = mouseY;
    }

    // Direct dot tracking
    if (dotEl) {
      dotEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }

    const cfg = SKIPER_CURSOR_CONFIG;
    const canDraw = cfg.type === "drawAlways" || (cfg.type === "drawOnHold" && isMouseDown);

    if (canDraw) {
      isDrawing = true;
      if (!currentStroke || (now - lastPointTime > 120) || (currentStroke.length > 0 && Math.hypot(mouseX - currentStroke[currentStroke.length - 1].x, mouseY - currentStroke[currentStroke.length - 1].y) > 75)) {
        startNewStroke(mouseX, mouseY, now);
      } else {
        const lastP = currentStroke[currentStroke.length - 1];
        if (Math.hypot(mouseX - lastP.x, mouseY - lastP.y) >= 3) {
          addPointToStroke(mouseX, mouseY, now);
        }
      }
    }

    startLoopIfNeeded();
  }, { passive: true });

  // Mouse down / up handlers
  window.addEventListener("mousedown", (e) => {
    isMouseDown = true;
    cursorContainer.classList.add("is-active");

    const cfg = SKIPER_CURSOR_CONFIG;
    if (cfg.type === "drawOnHold") {
      isDrawing = true;
      startNewStroke(e.clientX, e.clientY, performance.now());
    } else {
      addPointToStroke(e.clientX, e.clientY, performance.now());
    }

    startLoopIfNeeded();
  });

  window.addEventListener("mouseup", () => {
    isMouseDown = false;
    cursorContainer.classList.remove("is-active");
    if (SKIPER_CURSOR_CONFIG.type === "drawOnHold") {
      isDrawing = false;
      currentStroke = null;
    }
  });

  // Window enter / leave handlers
  document.addEventListener("mouseleave", () => {
    isVisible = false;
    cursorContainer.classList.remove("visible");
    currentStroke = null;
  });

  document.addEventListener("mouseenter", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    ringX = mouseX;
    ringY = mouseY;
    isVisible = true;
    cursorContainer.classList.add("visible");
  });

  // Interactive element hover detection
  document.addEventListener("mouseover", (e) => {
    const cfg = SKIPER_CURSOR_CONFIG;
    if (!cfg.customCursor) return;
    const hit = e.target.closest(cfg.hoverSelector);
    if (hit) {
      cursorContainer.classList.add("is-hovering");
    } else {
      cursorContainer.classList.remove("is-hovering");
    }
  });

  // Re-sync stroke color if dynamically updated
  try {
    Object.defineProperty(SKIPER_CURSOR_CONFIG, "strokeColor", {
      get() { return this._strokeColor || "#2B2530"; },
      set(val) {
        this._strokeColor = val;
        rgb = parseColor(val);
      }
    });
    SKIPER_CURSOR_CONFIG.strokeColor = "#2B2530";
  } catch (err) {
    // Silent catch if already defined
  }
}

// 5. Scroll Reveal with IntersectionObserver
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (elements.length === 0) return;

  // Respect reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach(el => el.classList.add("is-revealed"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(el => observer.observe(el));
}

// 6. Smooth Scroll for internal hash links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      // Ignore hash triggers meant for modals like #piece-01
      if (targetId.startsWith("#piece-")) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

