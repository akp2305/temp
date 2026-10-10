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
  initMiniSlideshows();
  initInstaCarousel();
  initScrollReveal();
  initSmoothScroll();
  initPrintsHeroCarousel();
  initPrintsMediumDrilldown();
  initEnquiryForm();
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

  if (!stage || !img) return;

  const initialSrc = img.getAttribute("src") || "assets/img/prints/ordinary-objects-1.jpg";

  // Magnifier Loupe: Craft & Ink Texture Inspector
  if (lens) {
    const zoomFactor = 2.4;
    lens.style.backgroundImage = `url('${initialSrc}')`;

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
      const halfLens = (lens.offsetWidth ? lens.offsetWidth / 2 : 80);
      const bgW = rect.width * zoomFactor;
      const bgH = rect.height * zoomFactor;
      const bgX = -(x * zoomFactor - halfLens);
      const bgY = -(y * zoomFactor - halfLens);

      lens.style.backgroundSize = `${bgW}px ${bgH}px`;
      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    }

    // Desktop hover inspection (only on devices with a mouse/pointer)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      stage.addEventListener("mousemove", moveLoupe);
      stage.addEventListener("mouseenter", (e) => {
        lens.style.backgroundImage = `url('${img.currentSrc || img.src || initialSrc}')`;
        moveLoupe(e);
      });
      stage.addEventListener("mouseleave", () => {
        lens.classList.remove("active");
      });
    }

    // Touch inspection
    stage.addEventListener("touchstart", (e) => {
      lens.style.backgroundImage = `url('${img.currentSrc || img.src || initialSrc}')`;
      moveLoupe(e);
    }, { passive: true });
    stage.addEventListener("touchmove", moveLoupe, { passive: true });
    stage.addEventListener("touchend", () => {
      lens.classList.remove("active");
    });
  }
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

// 8. Automated Mini-Slideshows (Micro Spaces & Cyanotype)
function initMiniSlideshows() {
  const slideshows = document.querySelectorAll("[data-mini-slideshow]");
  if (!slideshows.length) return;

  slideshows.forEach((container) => {
    const slides = Array.from(container.querySelectorAll(".mini-slide"));
    const dots = Array.from(container.querySelectorAll(".mini-slide-dot"));
    if (slides.length <= 1) return;

    let current = 0;
    const intervalTime = parseInt(container.getAttribute("data-interval"), 10) || 3200;

    function showSlide(index) {
      slides.forEach((slide, idx) => {
        slide.classList.toggle("active", idx === index);
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === index);
      });
      current = index;
    }

    let timer = setInterval(() => {
      const next = (current + 1) % slides.length;
      showSlide(next);
    }, intervalTime);

    container.addEventListener("mouseenter", () => {
      if (timer) clearInterval(timer);
    });

    container.addEventListener("mouseleave", () => {
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        const next = (current + 1) % slides.length;
        showSlide(next);
      }, intervalTime);
    });
  });
}

// 10. Full Horizontal Hero Carousel (Prints & Paintings Pages)
function initPrintsHeroCarousel() {
  const carousels = document.querySelectorAll(".prints-hero-carousel");
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".prints-hero-slide"));
    const dots = Array.from(carousel.querySelectorAll(".prints-hero-dot"));
    const prevBtn = carousel.querySelector(".prints-hero-prev") || document.getElementById("prints-hero-prev") || document.getElementById("paintings-hero-prev");
    const nextBtn = carousel.querySelector(".prints-hero-next") || document.getElementById("prints-hero-next") || document.getElementById("paintings-hero-next");
    if (slides.length <= 1) return;

    let current = 0;
    let timer = null;
    let hoverResumeTimeout = null;
    const interval = 3500;

    function show(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      slides.forEach((s, idx) => s.classList.toggle("active", idx === index));
      dots.forEach((d, idx) => d.classList.toggle("active", idx === index));
      current = index;
    }

    function startTimer() {
      stopTimer();
      timer = setInterval(() => {
        show(current + 1);
      }, interval);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        show(current - 1);
        startTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        show(current + 1);
        startTimer();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        show(idx);
        startTimer();
      });
    });

    // Touch swipe support
    let touchStartX = 0;
    carousel.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopTimer();
    }, { passive: true });

    carousel.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          show(current + 1);
        } else {
          show(current - 1);
        }
      }
      startTimer();
    }, { passive: true });

    // Hover: pause briefly, but auto-resume after 2.5s so slides keep cycling
    carousel.addEventListener("mouseenter", () => {
      stopTimer();
      clearTimeout(hoverResumeTimeout);
      hoverResumeTimeout = setTimeout(startTimer, 2500);
    });
    carousel.addEventListener("mouseleave", () => {
      clearTimeout(hoverResumeTimeout);
      startTimer();
    });

    startTimer();
  });
}

// 11. Prints Page Medium Profile Category Drilldown
function initPrintsMediumDrilldown() {
  const profileCards = Array.from(document.querySelectorAll(".print-profile-card"));
  const panels = Array.from(document.querySelectorAll(".prints-medium-panel"));
  if (profileCards.length === 0 || panels.length === 0) return;

  function closeAllMediums() {
    profileCards.forEach(card => {
      card.classList.remove("active");
      card.setAttribute("aria-selected", "false");
      const exp = card.querySelector(".print-profile-explore");
      if (exp) exp.innerHTML = exp.innerHTML.replace(/↑|&uarr;/, "&darr;");
    });
    panels.forEach(panel => {
      panel.classList.remove("active");
    });
  }

  function openMedium(mediumName, shouldScroll = false) {
    profileCards.forEach(card => {
      const match = card.getAttribute("data-medium") === mediumName;
      card.classList.toggle("active", match);
      card.setAttribute("aria-selected", match ? "true" : "false");
      const exp = card.querySelector(".print-profile-explore");
      if (exp) {
        if (match) {
          exp.innerHTML = exp.innerHTML.replace(/↓|&darr;/, "&uarr;");
        } else {
          exp.innerHTML = exp.innerHTML.replace(/↑|&uarr;/, "&darr;");
        }
      }
    });

    panels.forEach(panel => {
      const match = panel.getAttribute("data-medium-panel") === mediumName;
      panel.classList.toggle("active", match);
    });

    if (shouldScroll) {
      const targetPanel = panels.find(p => p.getAttribute("data-medium-panel") === mediumName);
      if (targetPanel) {
        targetPanel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  function toggleMedium(mediumName, shouldScroll = false) {
    const isCurrentlyActive = profileCards.some(
      card => card.getAttribute("data-medium") === mediumName && card.classList.contains("active")
    );

    if (isCurrentlyActive) {
      closeAllMediums();
      return;
    }

    openMedium(mediumName, shouldScroll);
  }

  profileCards.forEach(card => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const medium = card.getAttribute("data-medium");
      toggleMedium(medium, true);
    });
  });

  // Default: activate linocut initially with open arrow
  openMedium("linocut", false);
}

// 10. Contact Enquiry Form Handler (Delivers directly to printmakingpainting@gmail.com)
function initEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  const statusEl = document.getElementById("enquiry-status");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = form.querySelector("#enquiry-name");
    const emailInput = form.querySelector("#enquiry-email");
    const typeInput = form.querySelector("#enquiry-type");
    const messageInput = form.querySelector("#enquiry-message");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const type = typeInput ? typeInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.className = "form-status-msg";
        statusEl.style.display = "block";
        statusEl.style.backgroundColor = "rgba(180, 50, 50, 0.1)";
        statusEl.style.color = "#8b2020";
        statusEl.style.border = "1px solid rgba(180, 50, 50, 0.25)";
        statusEl.textContent = "Please fill in all required fields (Name, Email, and Message).";
      }
      return;
    }

    // Set loading state on button
    const originalBtnText = submitBtn ? submitBtn.innerHTML : "Send Enquiry ✦";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Sending enquiry... ✦";
    }

    if (statusEl) {
      statusEl.style.display = "none";
    }

    const payload = {
      name: name,
      email: email,
      enquiry_type: type || "Artwork / General Enquiry",
      message: message,
      _subject: `New Enquiry from ${name} [${type || 'Studio Artwork'}]`,
      _template: "table"
    };

    try {
      // POST directly to FormSubmit endpoint configured for printmakingpainting@gmail.com
      const response = await fetch("https://formsubmit.co/ajax/printmakingpainting@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (statusEl) {
        statusEl.className = "form-status-msg success";
        statusEl.style.display = "block";
        statusEl.style.backgroundColor = "";
        statusEl.style.color = "";
        statusEl.style.border = "";

        const isActivationNotice = result && result.message && result.message.toLowerCase().includes("activation");

        statusEl.innerHTML = `
          <strong>Thank you, ${escapeHtml(name)}! ✦</strong><br>
          Your enquiry regarding <em>${escapeHtml(type || "artworks")}</em> has been sent to <strong>printmakingpainting@gmail.com</strong>. Anisha will get back to you shortly.<br>
          ${isActivationNotice ? '<p style="margin: 0.5rem 0 0; font-size: 0.82rem; color: var(--forest-primary);"><em>Notice: If this is your first submission, FormSubmit has sent a 1-click activation link to printmakingpainting@gmail.com.</em></p>' : ''}
          <span style="display: inline-block; margin-top: 0.65rem; font-size: 0.88rem;">
            Need an immediate response? <a href="https://wa.me/919897455555?text=${encodeURIComponent(`Hi Anisha, I sent an enquiry regarding ${type || 'artworks'}: ${message}`)}" target="_blank" rel="noopener" style="color: var(--forest-ink); font-weight: 600; text-decoration: underline;">Continue on WhatsApp Studio &rarr;</a>
          </span>
        `;
      }

      form.reset();

    } catch (err) {
      console.warn("FormSubmit fetch error:", err);
      // Fallback: Show friendly confirmation with direct mailto fallback
      if (statusEl) {
        statusEl.className = "form-status-msg success";
        statusEl.style.display = "block";
        statusEl.innerHTML = `
          <strong>Thank you, ${escapeHtml(name)}! ✦</strong><br>
          Your message is prepared. You can also send directly via email:<br>
          <a href="mailto:printmakingpainting@gmail.com?subject=${encodeURIComponent(`Enquiry: ${type || 'Artwork'} - ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nEnquiry Type: ${type}\n\nMessage:\n${message}`)}" class="btn btn-secondary btn-sm" style="margin-top: 0.65rem; display: inline-flex;">
            Open in Gmail / Mail App ↗
          </a>
        `;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[m]));
}



