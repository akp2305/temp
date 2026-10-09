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
  initInstaCarousel();
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
      image: "assets/img/prints/ordinary-objects-1.jpg"
    },
    {
      id: "piece-02",
      title: "Moon",
      meta: "Original relief print on 300gsm Indian Khadi cotton rag paper · 2024",
      image: "assets/img/prints/moon.jpg"
    },
    {
      id: "piece-03",
      title: "Ordinary Objects - III",
      meta: "Original relief linocut on 280gsm Fabriano Rosaspina archival paper · 2024",
      image: "assets/img/prints/ordinary-objects-3.png"
    },
    {
      id: "piece-04",
      title: "Shelter",
      meta: "Two-plate relief linocut on 250gsm Somerset Satin cotton paper · 2024",
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
      if (priceEl) priceEl.textContent = "Price on Request";
      if (detailsBtn) detailsBtn.dataset.openModal = art.id;

      const waInquireBtn = document.getElementById("hero-inquire-wa-btn");
      if (waInquireBtn) {
        waInquireBtn.href = `https://wa.me/919897455555?text=${encodeURIComponent(`Hi Anisha! I'd love to inquire about the price and availability of "${art.title}".`)}`;
      }
      
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

// 7. Interactive Instagram Posts & Reels Slideshow
function initInstaCarousel() {
  const carousel = document.getElementById("insta-carousel");
  const track = document.getElementById("insta-track");
  const prevBtn = document.getElementById("insta-prev-btn");
  const nextBtn = document.getElementById("insta-next-btn");
  const dotsContainer = document.getElementById("insta-dots");

  if (!carousel || !track) return;

  const slides = Array.from(track.querySelectorAll(".insta-slide"));
  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const autoplayDelay = 4500;

  function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 991) return 2;
    return 3;
  }

  function getMaxIndex() {
    const visible = getVisibleCount();
    return Math.max(0, slides.length - visible);
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    const totalSteps = getMaxIndex() + 1;
    
    for (let i = 0; i < totalSteps; i++) {
      const dot = document.createElement("button");
      dot.className = `insta-dot ${i === currentIndex ? "active" : ""}`;
      dot.setAttribute("type", "button");
      dot.setAttribute("aria-label", `Go to Instagram slide ${i + 1}`);
      dot.addEventListener("click", () => {
        goToSlide(i);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll(".insta-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  function updateSlidePosition() {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    if (currentIndex < 0) currentIndex = 0;

    const firstSlide = slides[0];
    const slideWidth = firstSlide.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
    const offset = currentIndex * (slideWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function nextSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex >= maxIdx) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updateSlidePosition();
  }

  function prevSlide() {
    const maxIdx = getMaxIndex();
    if (currentIndex <= 0) {
      currentIndex = maxIdx;
    } else {
      currentIndex--;
    }
    updateSlidePosition();
  }

  function goToSlide(index) {
    const maxIdx = getMaxIndex();
    currentIndex = Math.min(Math.max(0, index), maxIdx);
    updateSlidePosition();
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoplay();
    });
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    pauseAutoplay();
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resetAutoplay();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function pauseAutoplay() {
    stopAutoplay();
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  carousel.addEventListener("mouseenter", pauseAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      renderDots();
      updateSlidePosition();
    }, 100);
  });

  renderDots();
  updateSlidePosition();
  startAutoplay();
}


