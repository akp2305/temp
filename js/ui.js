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
  initCarveReveal();
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

// 3. Interactive Carve → Print Reveal Component
function initCarveReveal() {
  const container = document.getElementById("carve-reveal-container");
  const blockLayer = document.getElementById("carve-layer-block");
  const sliderLine = document.getElementById("carve-slider-line");
  const sliderHandle = document.getElementById("carve-slider-handle");
  const toggleBtn = document.getElementById("carve-toggle-btn");

  if (!container || !blockLayer || !sliderLine || !sliderHandle) return;

  let isDragging = false;
  let currentPercent = 50;
  let isToggled = false;

  function updatePosition(percent) {
    percent = Math.max(0, Math.min(100, percent));
    currentPercent = percent;
    // clip-path: inset(top right bottom left) -> reveal block layer on the left
    blockLayer.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    sliderLine.style.left = `${percent}%`;
    sliderHandle.style.left = `${percent}%`;
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const percent = (offset / rect.width) * 100;
    updatePosition(percent);
  }

  function startDrag(e) {
    isDragging = true;
    onPointerMove(e);
  }

  function stopDrag() {
    isDragging = false;
  }

  // Pointer & Touch drag events
  container.addEventListener("mousedown", startDrag);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", stopDrag);

  container.addEventListener("touchstart", startDrag, { passive: true });
  window.addEventListener("touchmove", onPointerMove, { passive: true });
  window.addEventListener("touchend", stopDrag);

  // Accessible Tap Toggle Button
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      isToggled = !isToggled;
      const targetPercent = isToggled ? 95 : 5;
      updatePosition(targetPercent);
      toggleBtn.innerHTML = isToggled 
        ? `<span>⇄ Switch to Inked Print</span>` 
        : `<span>⇄ Switch to Carved Block</span>`;
    });
  }

  // Initial position
  updatePosition(50);
}

// 4. Custom Desktop Ink Cursor (Fine pointers only)
function initCustomCursor() {
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const cursor = document.getElementById("custom-cursor");
  if (!cursor) return;

  let mouseX = -100;
  let mouseY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    cursor.classList.add("visible");
  }, { passive: true });

  window.addEventListener("mousedown", () => {
    cursor.classList.add("active");
  });

  window.addEventListener("mouseup", () => {
    cursor.classList.remove("active");
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("visible");
  });
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

