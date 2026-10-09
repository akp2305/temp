/**
 * ====================================================================
 * Anisha Khanduja Studio - Gallery & Detail Modal (gallery.js)
 * ====================================================================
 * Renders Featured carousel, main Shop gallery, sticky filter chips,
 * sorting, favorites (localStorage), and deep-linkable detail modals (#piece-id).
 */

class StudioGallery {
  constructor(products = []) {
    this.products = products;
    this.currentFilter = "all";
    this.currentSort = "newest";
    this.favorites = this.loadFavorites();
    this.activeModalProduct = null;

    this.initElements();
    this.renderFilters();
    this.renderShop();
    this.bindEvents();
    this.checkUrlHashForModal();
  }

  loadFavorites() {
    try {
      const favs = localStorage.getItem("ak_studio_favs");
      return favs ? JSON.parse(favs) : [];
    } catch (e) {
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem("ak_studio_favs", JSON.stringify(this.favorites));
    } catch (e) {}
  }

  toggleFavorite(productId) {
    if (this.favorites.includes(productId)) {
      this.favorites = this.favorites.filter(id => id !== productId);
      if (window.studioCart) window.studioCart.showToast("Removed from saved favorites");
    } else {
      this.favorites.push(productId);
      if (window.studioCart) window.studioCart.showToast("Saved to favorites! ❤️");
    }
    this.saveFavorites();
    this.updateFavoriteButtons();
  }

  updateFavoriteButtons() {
    document.querySelectorAll(".fav-btn").forEach(btn => {
      const id = btn.dataset.id;
      if (this.favorites.includes(id)) {
        btn.classList.add("active");
        btn.setAttribute("aria-label", "Remove from favorites");
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-label", "Save to favorites");
      }
    });
  }

  initElements() {
    this.galleryContainer = document.getElementById("shop-artwork-grid");
    this.filterChipsContainer = document.getElementById("filter-chips-track");
    this.sortSelect = document.getElementById("shop-sort-select");
    
    // Modal elements
    this.modalOverlay = document.getElementById("artwork-modal-overlay");
    this.modalDialog = document.getElementById("artwork-modal-dialog");
  }

  bindEvents() {
    // Sort dropdown change
    if (this.sortSelect) {
      this.sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.renderShop();
      });
    }

    // URL Hash deep-linking for artwork detail modals
    window.addEventListener("hashchange", () => {
      this.checkUrlHashForModal();
    });

    // Close modal on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modalOverlay && this.modalOverlay.classList.contains("open")) {
        this.closeModal();
      }
    });

    // Close modal when clicking backdrop
    if (this.modalOverlay) {
      this.modalOverlay.addEventListener("click", (e) => {
        if (e.target === this.modalOverlay) {
          this.closeModal();
        }
      });
    }
  }

  // Dynamic filter chips based on collections in products.js
  renderFilters() {
    if (!this.filterChipsContainer) return;

    // Extract unique collections
    const collections = Array.from(new Set(this.products.map(p => p.collection).filter(Boolean)));

    const filters = [
      { id: "all", label: "All Prints" },
      { id: "available", label: "Available Now" },
      { id: "sold", label: "Archived / Sold" },
      ...collections.map(c => ({ id: `col:${c}`, label: c }))
    ];

    this.filterChipsContainer.innerHTML = filters.map(f => `
      <button class="filter-chip ${f.id === this.currentFilter ? 'active' : ''}" data-filter="${f.id}">
        ${f.label}
      </button>
    `).join("");

    this.filterChipsContainer.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", (e) => {
        this.filterChipsContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        this.currentFilter = chip.dataset.filter;
        this.renderShop();
      });
    });
  }

  getFilteredAndSortedProducts() {
    let list = [...this.products];

    // Filter
    if (this.currentFilter === "available") {
      list = list.filter(p => p.status === "available");
    } else if (this.currentFilter === "sold") {
      list = list.filter(p => p.status === "sold");
    } else if (this.currentFilter.startsWith("col:")) {
      const colName = this.currentFilter.replace("col:", "");
      list = list.filter(p => p.collection === colName);
    }

    // Sort
    if (this.currentSort === "title-asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default to newest
      list.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
    }

    return list;
  }

  getMediumSummary(product) {
    if (product.id === "piece-01") return "Relief linocut on 250gsm Somerset Velvet cotton rag";
    if (product.id === "piece-02") return "Relief print on 300gsm Indian Khadi handmade rag";
    if (product.id === "piece-03") return "Relief linocut on 280gsm Fabriano Rosaspina paper";
    if (product.id === "piece-04") return "Two-plate relief linocut on Somerset Satin paper";
    return "Original relief linocut on archival cotton rag";
  }

  renderCardHtml(product, isFeatured = false) {
    const isSold = product.status === "sold";
    const mediumText = this.getMediumSummary(product);
    const plateIndex = product.id.replace("piece-0", "Plate ");

    return `
      <article class="portfolio-plate ${isSold ? 'is-archived' : ''}" data-id="${product.id}">
        <div class="plate-media-frame" data-open-modal="${product.id}" title="Click to view artwork details and full plate">
          <div class="plate-mat">
            <img class="plate-img" src="${product.images[0]}" alt="${product.title} — original linocut print by Anisha Khanduja" loading="lazy" width="480" height="520">
          </div>
          <div class="plate-inspect-hint">Inspect Plate ↗</div>
        </div>
        <div class="plate-caption">
          <div class="plate-caption-header">
            <span class="plate-num">${plateIndex}</span>
            <span class="plate-edition-tag">${isSold ? 'Archived · Sold Out' : `Edition of ${product.editionSize}`}</span>
          </div>
          <h3 class="plate-title" data-open-modal="${product.id}">${product.title}</h3>
          <p class="plate-medium-year">${mediumText} · 2024</p>
          <p class="plate-dimensions">${product.dimensions}</p>
          <div class="plate-footer-row">
            <span class="plate-price-tag">Price on Request</span>
            <div class="plate-actions">
              <button class="plate-text-btn" data-open-modal="${product.id}">
                View Details ↗
              </button>
              ${isSold ? `
                <a class="plate-subtle-btn plate-wa-btn" href="https://wa.me/919897455555?text=${encodeURIComponent(`Hi Anisha! I saw that "${product.title}" is archived/sold out. Could you please let me know if a reprint or custom commission is possible?`)}" target="_blank" rel="noopener">
                  Inquire 💬
                </a>
              ` : `
                <a class="plate-subtle-btn plate-wa-btn" href="https://wa.me/919897455555?text=${encodeURIComponent(`Hi Anisha! I'd love to inquire about the price and availability of "${product.title}".`)}" target="_blank" rel="noopener">
                  DM for Price 💬
                </a>
              `}
            </div>
          </div>
        </div>
      </article>
    `;
  }

  renderShop() {
    if (!this.galleryContainer) return;
    const items = this.getFilteredAndSortedProducts();

    if (items.length === 0) {
      this.galleryContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <h3 style="font-family: var(--font-display); margin-bottom: 0.5rem;">No artworks found in this category</h3>
          <p style="color: var(--ink-light); margin-bottom: 1.5rem;">Try choosing another collection or resetting filters.</p>
          <button class="btn btn-secondary" id="reset-filter-btn">View All Prints</button>
        </div>
      `;
      const resetBtn = this.galleryContainer.querySelector("#reset-filter-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          this.currentFilter = "all";
          this.renderFilters();
          this.renderShop();
        });
      }
      return;
    }

    this.galleryContainer.innerHTML = items.map(p => this.renderCardHtml(p)).join("");
    this.attachCardEventListeners(this.galleryContainer);
  }

  attachCardEventListeners(container) {
    // Open modal triggers
    container.querySelectorAll("[data-open-modal]").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.dataset.openModal || (el.closest(".portfolio-plate, .artwork-card") && el.closest(".portfolio-plate, .artwork-card").dataset.id);
        const product = this.products.find(p => p.id === id);
        if (product) this.openModal(product);
      });
    });

    // Add to cart buttons
    container.querySelectorAll(".add-to-cart-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const product = this.products.find(p => p.id === id);
        if (product && window.studioCart) {
          window.studioCart.addItem(product, 1);
        }
      });
    });

    // Favorite buttons
    container.querySelectorAll(".fav-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.toggleFavorite(id);
      });
    });

    // Inquire reprint buttons
    container.querySelectorAll("[data-ask-reprint]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.askReprint;
        const product = this.products.find(p => p.id === id);
        if (product) {
          const msg = encodeURIComponent(`Hi Anisha! I saw that your linocut print "${product.title}" is sold out. Could you let me know if a similar edition or custom variation is possible?`);
          const phone = "919897455555";
          window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
        }
      });
    });
  }

  // Check URL hash like #piece-01 or #piece-moon
  checkUrlHashForModal() {
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      if (this.activeModalProduct) this.closeModal(false);
      return;
    }

    const product = this.products.find(p => p.id === hash || p.slug === hash);
    if (product) {
      this.openModal(product, false);
    }
  }

  openModal(product, updateHash = true) {
    if (!product) return;
    this.activeModalProduct = product;

    if (updateHash) {
      history.pushState(null, "", `#${product.slug || product.id}`);
    }

    const modalOverlay = this.modalOverlay || document.getElementById("artwork-modal-overlay");
    if (!modalOverlay) return;

    const dialog = this.modalDialog || modalOverlay.querySelector(".modal-dialog");
    if (!dialog) return;

    const isSold = product.status === "sold";
    const mainImg = product.images[0];

    // Edition badge formatting (no undefined values)
    let editionBadgeHtml = "";
    if (isSold) {
      editionBadgeHtml = `<div class="modal-edition-badge"><span class="sticker sticker-sold">Sold Out Edition</span></div>`;
    } else if (product.edition) {
      editionBadgeHtml = `<div class="modal-edition-badge"><span class="sticker sticker-edition">${product.edition}</span></div>`;
    } else if (product.editionSize && product.editionNumberAvailable) {
      editionBadgeHtml = `<div class="modal-edition-badge"><span class="sticker sticker-edition">Edition of ${product.editionSize} · ${product.editionNumberAvailable} available</span></div>`;
    } else if (product.editionSize) {
      editionBadgeHtml = `<div class="modal-edition-badge"><span class="sticker sticker-edition">Edition of ${product.editionSize}</span></div>`;
    }

    dialog.innerHTML = `
      <button class="modal-close-btn" id="modal-close-btn" aria-label="Close artwork details">&times;</button>
      <div class="modal-content-grid">
        <!-- Gallery column -->
        <div class="modal-gallery-col">
          <div class="modal-main-img-wrap">
            <img class="modal-main-img" id="modal-active-img" src="${mainImg}" alt="${product.title}">
          </div>
          ${product.images.length > 1 ? `
            <div class="modal-thumbnails">
              ${product.images.map((img, idx) => `
                <div class="modal-thumb ${idx === 0 ? 'active' : ''}" data-thumb-src="${img}">
                  <img src="${img}" alt="Thumbnail ${idx + 1}">
                </div>
              `).join("")}
            </div>
          ` : ''}
        </div>

        <!-- Info column -->
        <div class="modal-info-col">
          ${editionBadgeHtml}
          <h2 class="modal-title">${product.title}</h2>
          <div class="modal-price-row">
            <span class="modal-price">Price on Request</span>
            <span style="font-size:var(--text-xs); color:var(--ink-muted);">Direct studio inquiry via WhatsApp</span>
          </div>

          <p class="modal-story">${product.story || ''}</p>

          <div class="modal-specs-list">
            ${product.medium ? `
              <div class="modal-spec-item">
                <span class="spec-label">Medium</span>
                <span class="spec-val">${product.medium}</span>
              </div>
            ` : ''}
            ${product.year ? `
              <div class="modal-spec-item">
                <span class="spec-label">Year</span>
                <span class="spec-val">${product.year}</span>
              </div>
            ` : ''}
            ${product.edition ? `
              <div class="modal-spec-item">
                <span class="spec-label">Edition</span>
                <span class="spec-val">${product.edition}</span>
              </div>
            ` : ''}
            ${product.dimensions ? `
              <div class="modal-spec-item">
                <span class="spec-label">Dimensions</span>
                <span class="spec-val">${product.dimensions}</span>
              </div>
            ` : ''}
            ${product.theme ? `
              <div class="modal-spec-item">
                <span class="spec-label">Theme</span>
                <span class="spec-val">${product.theme}</span>
              </div>
            ` : ''}
            ${product.timeTaken ? `
              <div class="modal-spec-item">
                <span class="spec-label">Studio Time</span>
                <span class="spec-val">${product.timeTaken}</span>
              </div>
            ` : ''}
          </div>

          <div class="modal-actions">
            ${isSold ? `
              <a class="btn btn-whatsapp btn-lg" style="width:100%; justify-content:center;" href="https://wa.me/919897455555?text=${encodeURIComponent(`Hi Anisha! I saw that "${product.title}" is archived/sold out. Could you please let me know if a reprint or custom commission is possible?`)}" target="_blank" rel="noopener">
                Ask About Reprint / Commission on WhatsApp 💬
              </a>
            ` : `
              <div class="modal-actions-row">
                <a class="btn btn-whatsapp btn-lg" style="flex:1; justify-content:center;" href="https://wa.me/919897455555?text=${encodeURIComponent(`Hi Anisha! I'd love to inquire about the price and availability of "${product.title}".`)}" target="_blank" rel="noopener">
                  DM on WhatsApp for Price 💬
                </a>
              </div>
            `}
            <button class="btn btn-secondary btn-sm" id="modal-bottom-close-btn" style="margin-top:0.25rem;">
              ✕ Close Preview & Return to Gallery
            </button>
          </div>
        </div>
      </div>
    `;

    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";

    // Close button events
    const closeBtn = dialog.querySelector("#modal-close-btn");
    if (closeBtn) closeBtn.addEventListener("click", () => this.closeModal());
    const bottomClose = dialog.querySelector("#modal-bottom-close-btn");
    if (bottomClose) bottomClose.addEventListener("click", () => this.closeModal());

    // Thumbnail switcher
    dialog.querySelectorAll(".modal-thumb").forEach(thumb => {
      thumb.addEventListener("click", () => {
        dialog.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        const activeImg = dialog.querySelector("#modal-active-img");
        if (activeImg) activeImg.src = thumb.dataset.thumbSrc;
      });
    });

    // Ask on WhatsApp (if present)
    const askBtn = dialog.querySelector("#modal-ask-btn");
    if (askBtn) {
      askBtn.addEventListener("click", () => {
        const msg = encodeURIComponent(`Hi Anisha! I'm looking at your print "${product.title}" and had a quick question about price and framing: `);
        window.open(`https://wa.me/919897455555?text=${msg}`, "_blank");
      });
    }

    // Recommendation item clicks
    dialog.querySelectorAll(".rec-item").forEach(item => {
      item.addEventListener("click", () => {
        const recId = item.dataset.recId;
        const target = this.products.find(p => p.id === recId || p.slug === recId);
        if (target) {
          this.openModal(target, true);
        }
      });
    });
  }

  openModalById(idOrSlug) {
    const product = this.products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (product) {
      this.openModal(product, true);
    }
  }

  closeModal(clearHash = true) {
    const modalOverlay = document.getElementById("artwork-modal-overlay");
    if (modalOverlay) {
      modalOverlay.classList.remove("open");
    }
    this.activeModalProduct = null;
    document.body.style.overflow = "";

    if (clearHash && window.location.hash) {
      history.pushState(null, "", window.location.pathname + window.location.search);
    }
  }
}

// Global delegated listener for any data-artwork-id trigger across all pages
document.addEventListener("click", (e) => {
  const trigger = e.target.closest("[data-artwork-id]");
  if (trigger) {
    const artworkId = trigger.getAttribute("data-artwork-id");
    if (artworkId && window.studioGallery) {
      e.preventDefault();
      window.studioGallery.openModalById(artworkId);
    }
  }
});

// Instantiate once DOM and products are ready
let studioGallery;
document.addEventListener("DOMContentLoaded", () => {
  const products = window.STUDIO_PRODUCTS || [];
  studioGallery = new StudioGallery(products);
  window.studioGallery = studioGallery;
});
