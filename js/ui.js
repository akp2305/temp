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
    if (mobileClose) mobileClose.focus();
  }

  function closeMenu() {
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileOverlay.classList.remove("open");
    mobilePanel.classList.remove("open");
    document.body.style.overflow = "";
    menuToggle.focus();
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

  // Close menu on Escape key for keyboard & assistive devices
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobilePanel.classList.contains("open")) {
      closeMenu();
    }
  });
}

// 3. Interactive Hero Artwork Spotlight & Craft Loupe Inspector
function initHeroShowcase() {
  const stage = document.getElementById("hero-showcase-stage");
  const img = document.getElementById("hero-showcase-img");
  const lens = document.getElementById("hero-loupe-lens");
  const titleEl = document.getElementById("hero-showcase-title");
  const metaEl = document.getElementById("hero-showcase-meta-text");
  const priceEl = document.getElementById("hero-showcase-price");
  const detailsBtn = document.getElementById("hero-view-details-btn");
  const pills = document.querySelectorAll(".showcase-pill");

  if (!stage || !img) return;

  const artworks = [
    {
      id: "piece-01",
      title: "Ordinary Objects - I",
      meta: "Hand-pulled relief linocut on 250gsm Somerset Velvet 100% cotton rag paper · 2024",
      price: "₹3,400",
      image: "assets/img/prints/ordinary-objects-1.jpg"
    },
    {
      id: "piece-02",
      title: "Moon",
      meta: "Original relief print on 300gsm Indian Khadi cotton rag paper · 2024",
      price: "₹2,600",
      image: "assets/img/prints/moon.jpg"
    },
    {
      id: "piece-03",
      title: "Ordinary Objects - III",
      meta: "Original relief linocut on 280gsm Fabriano Rosaspina archival paper · 2024",
      price: "₹3,800",
      image: "assets/img/prints/ordinary-objects-3.png"
    },
    {
      id: "piece-04",
      title: "Shelter",
      meta: "Two-plate relief linocut on 250gsm Somerset Satin cotton paper · 2024",
      price: "₹3,200",
      image: "assets/img/prints/shelter.png"
    }
  ];

  let currentIndex = 0;
  let isHovered = false;

  function switchArtwork(index) {
    if (index < 0 || index >= artworks.length) return;
    currentIndex = index;
    const art = artworks[currentIndex];

    // Fade transition
    img.classList.add("fade-out");
    setTimeout(() => {
      img.src = art.image;
      img.alt = `${art.title} — original linocut print by Anisha Khanduja`;
      if (titleEl) titleEl.textContent = art.title;
      if (metaEl) metaEl.textContent = art.meta;
      if (priceEl) priceEl.textContent = art.price;
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
      const isTouch = !!e.touches;
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left;
      // On touch devices, position lens slightly above finger so thumb doesn't obstruct view
      const y = isTouch ? (clientY - rect.top - 70) : (clientY - rect.top);

      if (x < 0 || x > rect.width || y < -40 || y > rect.height + 40) {
        lens.classList.remove("active");
        return;
      }

      lens.classList.add("active");
      lens.style.left = `${Math.max(20, Math.min(rect.width - 20, x))}px`;
      lens.style.top = `${Math.max(20, Math.min(rect.height - 20, y))}px`;

      // Position zoomed image inside lens
      const bgW = rect.width * zoomFactor;
      const bgH = rect.height * zoomFactor;
      const bgX = -(x * zoomFactor - 75);
      const bgY = -(y * zoomFactor - 75);

      lens.style.backgroundSize = `${bgW}px ${bgH}px`;
      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    }

    // Desktop hover inspection (only on devices with a mouse/pointer)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
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
    }
  }

  // Initial setup with Object 1
  switchArtwork(0);
}

// 4. Scroll Reveal with IntersectionObserver
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

