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
    if (this.currentSort === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (this.currentSort === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (this.currentSort === "newest") {
      list.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
    }

    return list;
  }

  renderCardHtml(product, isFeatured = false) {
    const isSold = product.status === "sold";
    const isFav = this.favorites.includes(product.id);

    // Dynamic sticker badge
    let badgeHtml = "";
    if (isSold) {
      badgeHtml = `<span class="sticker sticker-sold sticker-rotate-left">Sold Out</span>`;
    } else if (product.editionNumberAvailable === 1) {
      badgeHtml = `<span class="sticker sticker-limited sticker-rotate-right">Last 1 Left!</span>`;
    } else if (product.featured) {
      badgeHtml = `<span class="sticker sticker-edition sticker-rotate-alt">Ed. of ${product.editionSize}</span>`;
    } else {
      badgeHtml = `<span class="sticker sticker-new sticker-rotate-left">Limited Ed.</span>`;
    }

    return `
      <article class="artwork-card ${isSold ? 'is-sold' : ''}" data-id="${product.id}">
        <div class="card-media-wrap" data-open-modal="${product.id}">
          <img class="card-img" src="${product.images[0]}" alt="${product.title} - original linocut print" loading="lazy" width="400" height="420">
          <div class="card-badges">
            ${badgeHtml}
          </div>
          <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${product.id}" aria-label="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
        <div class="card-body">
          <span class="card-collection">${product.collection}</span>
          <h3 class="card-title" data-open-modal="${product.id}" style="cursor:pointer;">${product.title}</h3>
          <p class="card-specs">${product.dimensions} · Relief Print</p>
          <div class="card-footer">
            <div class="card-price-block">
              <span class="card-price">${product.currency}${product.price.toLocaleString("en-IN")}</span>
              <span class="card-edition-note">
                ${isSold ? 'Archived (Edition Sold)' : `${product.editionNumberAvailable} of ${product.editionSize} available`}
              </span>
            </div>
            <div class="card-actions">
              ${isSold ? `
                <button class="btn btn-sm btn-secondary" data-ask-reprint="${product.id}">Inquire</button>
              ` : `
                <button class="btn btn-sm btn-primary add-to-cart-btn" data-id="${product.id}">
                  Add to Cart
                </button>
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
        const id = el.dataset.openModal || el.closest(".artwork-card").dataset.id;
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

    // Recommendations (excluding this item)
    const recs = this.products
      .filter(p => p.id !== product.id && p.status === "available")
      .slice(0, 3);

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
          <div class="modal-trust-box">
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4"/><path d="M8 8V4a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v4"/></svg>
              <span><strong>Plastic-free Packaging:</strong> Shipped flat in rigid heavy-board mailer with archival tissue</span>
            </div>
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span><strong>Fast Dispatch:</strong> Hand-packed and dispatched within 48 hours</span>
            </div>
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span><strong>Certificate of Authenticity:</strong> Numbered and pencil-signed by Anisha Khanduja</span>
            </div>
          </div>
        </div>

        <!-- Info column -->
        <div class="modal-info-col">
          <div class="modal-edition-badge">
            <span class="sticker ${isSold ? 'sticker-sold' : 'sticker-edition'}">
              ${isSold ? 'Sold Out Edition' : `Edition of ${product.editionSize} · ${product.editionNumberAvailable} available`}
            </span>
          </div>
          <h2 class="modal-title">${product.title}</h2>
          <div class="modal-price-row">
            <span class="modal-price">${product.currency}${product.price.toLocaleString("en-IN")}</span>
            <span style="font-size:var(--text-xs); color:var(--ink-muted);">Includes taxes & complimentary studio stickers</span>
          </div>

          <p class="modal-story">${product.story}</p>

          <div class="modal-specs-list">
            <div class="modal-spec-item">
              <span class="spec-label">Print Medium</span>
              <span class="spec-val">${product.medium}</span>
            </div>
            <div class="modal-spec-item">
              <span class="spec-label">Paper Stock</span>
              <span class="spec-val">${product.paper}</span>
            </div>
            <div class="modal-spec-item">
              <span class="spec-label">Dimensions</span>
              <span class="spec-val">${product.dimensions}</span>
            </div>
            <div class="modal-spec-item">
              <span class="spec-label">Framing</span>
              <span class="spec-val">Sold unframed (standard frame sizes)</span>
            </div>
          </div>

          <div class="modal-actions">
            ${isSold ? `
              <button class="btn btn-whatsapp btn-lg" id="modal-wa-reprint-btn">
                Ask About a Custom Reprint on WhatsApp
              </button>
            ` : `
              <div class="modal-actions-row">
                <button class="btn btn-primary btn-lg" style="flex:1;" id="modal-add-cart-btn">
                  Add to Cart ✦
                </button>
                <button class="btn btn-ink btn-lg" id="modal-buy-now-btn">
                  Buy Now
                </button>
              </div>
            `}
            <button class="btn btn-secondary btn-sm" id="modal-ask-btn" style="margin-top:0.25rem;">
              💬 Ask a Question About This Print
            </button>
          </div>

          <!-- Recommendations in modal -->
          ${recs.length > 0 ? `
            <div style="margin-top:1.5rem; padding-top:1.25rem; border-top:var(--border-thin);">
              <h4 style="font-size:var(--text-sm); margin-bottom:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--ink-muted);">You Might Also Like</h4>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem;">
                ${recs.map(r => `
                  <div class="rec-item" data-rec-id="${r.id}" style="cursor:pointer; border:var(--border-thin); border-radius:var(--radius-xs); overflow:hidden; background:var(--surface-pure); padding:4px;">
                    <img src="${r.images[0]}" alt="${r.title}" style="aspect-ratio:1; object-fit:cover; border-radius:3px;">
                    <div style="font-size:0.7rem; font-weight:700; margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${r.title}</div>
                    <div style="font-size:0.65rem; color:var(--ink-muted);">${r.currency}${r.price.toLocaleString("en-IN")}</div>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";

    // Close button event
    dialog.querySelector("#modal-close-btn").addEventListener("click", () => this.closeModal());

    // Thumbnail switcher
    dialog.querySelectorAll(".modal-thumb").forEach(thumb => {
      thumb.addEventListener("click", () => {
        dialog.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        const activeImg = dialog.querySelector("#modal-active-img");
        if (activeImg) activeImg.src = thumb.dataset.thumbSrc;
      });
    });

    // Add to cart
    const addBtn = dialog.querySelector("#modal-add-cart-btn");
    if (addBtn) {
      addBtn.addEventListener("click", () => {
        if (window.studioCart) {
          window.studioCart.addItem(product, 1);
        }
      });
    }

    // Buy now
    const buyBtn = dialog.querySelector("#modal-buy-now-btn");
    if (buyBtn) {
      buyBtn.addEventListener("click", () => {
        if (product.paymentLink) {
          window.open(product.paymentLink, "_blank");
        } else if (window.studioCart) {
          window.studioCart.addItem(product, 1);
          window.studioCart.open();
        }
      });
    }

    // Ask on WhatsApp
    const askBtn = dialog.querySelector("#modal-ask-btn");
    if (askBtn) {
      askBtn.addEventListener("click", () => {
        const msg = encodeURIComponent(`Hi Anisha! I'm looking at your print "${product.title}" (${product.currency}${product.price}) and had a quick question: `);
        window.open(`https://wa.me/919897455555?text=${msg}`, "_blank");
      });
    }

    // Ask reprint (if sold)
    const reprintBtn = dialog.querySelector("#modal-wa-reprint-btn");
    if (reprintBtn) {
      reprintBtn.addEventListener("click", () => {
        const msg = encodeURIComponent(`Hi Anisha! I saw that "${product.title}" is sold out. Could you please let me know if a reprint, new edition, or commission is possible?`);
        window.open(`https://wa.me/919897455555?text=${msg}`, "_blank");
      });
    }

    // Recommendation item clicks
    dialog.querySelectorAll(".rec-item").forEach(item => {
      item.addEventListener("click", () => {
        const recId = item.dataset.recId;
        const target = this.products.find(p => p.id === recId);
        if (target) {
          this.openModal(target, true);
        }
      });
    });
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

// Instantiate once DOM and products are ready
let studioGallery;
document.addEventListener("DOMContentLoaded", () => {
  const products = window.STUDIO_PRODUCTS || [];
  studioGallery = new StudioGallery(products);
  window.studioGallery = studioGallery;
});
