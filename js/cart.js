/**
 * ====================================================================
 * Anisha Khanduja Studio - Cart & Checkout (cart.js)
 * ====================================================================
 * Handles localStorage cart persistence, quantity edition constraints,
 * slide-in cart drawer, and frictionless checkout via WhatsApp and UPI.
 *
 * CONFIGURATION:
 * Change the WhatsApp number, UPI ID, or free shipping threshold below!
 */

const CART_CONFIG = {
  // Studio WhatsApp contact
  whatsappNumber: "919897455555",
  
  // UPI ID (e.g. yourname@okaxis, yourname@upi)
  upiId: "anisha@upi",
  
  // Free shipping threshold in INR (₹)
  freeShippingThreshold: 1999,
  
  // Standard shipping rate if below threshold
  standardShippingFee: 150,

  // Local storage persistence key
  storageKey: "ak_studio_cart_v1",

  // Currency symbol
  currency: "₹"
};

class StudioCart {
  constructor() {
    this.items = this.loadCart();
    this.drawerOpen = false;
    this.initElements();
    this.bindEvents();
    this.render();
  }

  // Load cart from localStorage with try/catch safety
  loadCart() {
    try {
      const stored = localStorage.getItem(CART_CONFIG.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
      return [];
    }
  }

  // Save cart to localStorage
  saveCart() {
    try {
      localStorage.setItem(CART_CONFIG.storageKey, JSON.stringify(this.items));
    } catch (e) {
      console.warn("Could not save cart to localStorage", e);
    }
  }

  initElements() {
    this.cartDrawer = document.getElementById("cart-drawer");
    this.cartOverlay = document.getElementById("cart-overlay");
    this.cartTriggerBtn = document.getElementById("cart-trigger-btn");
    this.cartCloseBtn = document.getElementById("cart-close-btn");
    this.cartCountBadges = document.querySelectorAll(".cart-count");
    this.cartItemsContainer = document.getElementById("cart-items-container");
    this.cartSubtotalEl = document.getElementById("cart-subtotal-val");
    this.shippingBarFill = document.getElementById("shipping-bar-fill");
    this.shippingNoteEl = document.getElementById("shipping-note-text");
    this.whatsappCheckoutBtn = document.getElementById("whatsapp-checkout-btn");
    this.payNowCheckoutBtn = document.getElementById("pay-now-checkout-btn");
    this.cartEmptyState = document.getElementById("cart-empty-state");
    this.cartFooter = document.getElementById("cart-drawer-footer");
  }

  bindEvents() {
    if (this.cartTriggerBtn) {
      this.cartTriggerBtn.addEventListener("click", () => this.open());
    }

    if (this.cartCloseBtn) {
      this.cartCloseBtn.addEventListener("click", () => this.close());
    }

    if (this.cartOverlay) {
      this.cartOverlay.addEventListener("click", () => this.close());
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.drawerOpen) {
        this.close();
      }
    });

    // WhatsApp Checkout trigger
    if (this.whatsappCheckoutBtn) {
      this.whatsappCheckoutBtn.addEventListener("click", () => {
        this.checkoutViaWhatsApp();
      });
    }

    // Pay Now / UPI trigger
    if (this.payNowCheckoutBtn) {
      this.payNowCheckoutBtn.addEventListener("click", () => {
        this.openUpiModal();
      });
    }
  }

  open() {
    if (!this.cartDrawer || !this.cartOverlay) return;
    this.drawerOpen = true;
    this.cartDrawer.classList.add("open");
    this.cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  close() {
    if (!this.cartDrawer || !this.cartOverlay) return;
    this.drawerOpen = false;
    this.cartDrawer.classList.remove("open");
    this.cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  addItem(product, qty = 1) {
    if (!product || product.status === "sold") {
      this.showToast("This print is sold out!");
      return;
    }

    const maxAvailable = product.editionNumberAvailable || 1;
    const existingIndex = this.items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      const currentQty = this.items[existingIndex].quantity;
      if (currentQty + qty > maxAvailable) {
        this.showToast(`Only ${maxAvailable} print(s) available in this edition.`);
        return;
      }
      this.items[existingIndex].quantity += qty;
    } else {
      this.items.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        dimensions: product.dimensions,
        medium: product.medium,
        editionSize: product.editionSize,
        maxAvailable: maxAvailable,
        quantity: Math.min(qty, maxAvailable),
        paymentLink: product.paymentLink || ""
      });
    }

    this.saveCart();
    this.render();
    this.bumpCartIcon();
    this.showToast(`Added "${product.title}" to cart! ✦`);
    this.open();
  }

  updateQuantity(productId, newQty) {
    const item = this.items.find(i => i.id === productId);
    if (!item) return;

    if (newQty <= 0) {
      this.removeItem(productId);
      return;
    }

    if (newQty > item.maxAvailable) {
      this.showToast(`Limit reached: Only ${item.maxAvailable} available.`);
      return;
    }

    item.quantity = newQty;
    this.saveCart();
    this.render();
  }

  removeItem(productId) {
    const item = this.items.find(i => i.id === productId);
    this.items = this.items.filter(i => i.id !== productId);
    this.saveCart();
    this.render();
    if (item) {
      this.showToast(`Removed "${item.title}" from cart.`);
    }
  }

  clear() {
    this.items = [];
    this.saveCart();
    this.render();
  }

  getCount() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  bumpCartIcon() {
    this.cartCountBadges.forEach(badge => {
      badge.classList.remove("bump");
      // Force reflow
      void badge.offsetWidth;
      badge.classList.add("bump");
    });
  }

  showToast(message) {
    let toast = document.getElementById("studio-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "studio-toast";
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: var(--ink);
        color: var(--bg-cream);
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-pill);
        border: var(--border-thin);
        box-shadow: 4px 4px 0 var(--terracotta);
        font-size: var(--text-sm);
        font-weight: 700;
        z-index: 99999;
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        pointer-events: none;
        white-space: nowrap;
      `;
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.transform = "translateX(-50%) translateY(0)";

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.transform = "translateX(-50%) translateY(100px)";
    }, 2800);
  }

  render() {
    const count = this.getCount();
    const subtotal = this.getSubtotal();

    // Update count badges
    this.cartCountBadges.forEach(badge => {
      badge.textContent = count;
      badge.setAttribute("aria-label", `${count} items in cart`);
    });

    // Update subtotal
    if (this.cartSubtotalEl) {
      this.cartSubtotalEl.textContent = `${CART_CONFIG.currency}${subtotal.toLocaleString("en-IN")}`;
    }

    // Free shipping progress bar
    if (this.shippingBarFill && this.shippingNoteEl) {
      if (subtotal >= CART_CONFIG.freeShippingThreshold) {
        this.shippingBarFill.style.width = "100%";
        this.shippingNoteEl.innerHTML = `🎉 <strong>You unlocked Free Shipping across India!</strong>`;
      } else {
        const remaining = CART_CONFIG.freeShippingThreshold - subtotal;
        const percent = Math.min(100, Math.round((subtotal / CART_CONFIG.freeShippingThreshold) * 100));
        this.shippingBarFill.style.width = `${percent}%`;
        this.shippingNoteEl.innerHTML = `Add <strong>${CART_CONFIG.currency}${remaining.toLocaleString("en-IN")}</strong> more for Free Shipping!`;
      }
    }

    // Render items list or empty state
    if (!this.cartItemsContainer) return;

    if (this.items.length === 0) {
      if (this.cartEmptyState) this.cartEmptyState.style.display = "flex";
      if (this.cartFooter) this.cartFooter.style.display = "none";
      this.cartItemsContainer.innerHTML = "";
      return;
    }

    if (this.cartEmptyState) this.cartEmptyState.style.display = "none";
    if (this.cartFooter) this.cartFooter.style.display = "flex";

    this.cartItemsContainer.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-thumb">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.title}</h4>
          <span class="cart-item-specs">${item.dimensions || "Limited Edition"}</span>
          <span class="cart-item-price">${CART_CONFIG.currency}${(item.price * item.quantity).toLocaleString("en-IN")}</span>
        </div>
        <div class="cart-item-controls">
          <div class="qty-control" role="group" aria-label="Quantity for ${item.title}">
            <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity" ${item.quantity >= item.maxAvailable ? 'disabled title="Max available reached"' : ''}>+</button>
          </div>
          <button class="remove-item-btn" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `).join("");

    // Attach listeners for line items
    this.cartItemsContainer.querySelectorAll(".qty-minus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.items.find(i => i.id === id);
        if (item) this.updateQuantity(id, item.quantity - 1);
      });
    });

    this.cartItemsContainer.querySelectorAll(".qty-plus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const item = this.items.find(i => i.id === id);
        if (item) this.updateQuantity(id, item.quantity + 1);
      });
    });

    this.cartItemsContainer.querySelectorAll(".remove-item-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        this.removeItem(id);
      });
    });
  }

  // Generate WhatsApp Order URL
  checkoutViaWhatsApp() {
    if (this.items.length === 0) return;

    const subtotal = this.getSubtotal();
    const isFreeShipping = subtotal >= CART_CONFIG.freeShippingThreshold;
    const shippingAmount = isFreeShipping ? "FREE" : `${CART_CONFIG.currency}${CART_CONFIG.standardShippingFee}`;
    const total = isFreeShipping ? subtotal : subtotal + CART_CONFIG.standardShippingFee;

    let text = `Hello Anisha! 👋\n\nI would love to purchase original linocut prints from your studio:\n\n`;

    this.items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.title}*\n`;
      text += `   Qty: ${item.quantity} × ${CART_CONFIG.currency}${item.price.toLocaleString("en-IN")} = ${CART_CONFIG.currency}${(item.price * item.quantity).toLocaleString("en-IN")}\n`;
      text += `   Size: ${item.dimensions || "Standard"}\n\n`;
    });

    text += `──────────────\n`;
    text += `*Subtotal:* ${CART_CONFIG.currency}${subtotal.toLocaleString("en-IN")}\n`;
    text += `*Shipping:* ${shippingAmount} (Delivery across India)\n`;
    text += `*Estimated Total:* ${CART_CONFIG.currency}${total.toLocaleString("en-IN")}\n\n`;
    text += `Please share payment details (UPI/Account) and delivery timeframe. Thank you!`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${CART_CONFIG.whatsappNumber}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  // Open UPI / Instant Pay Modal
  openUpiModal() {
    let upiModal = document.getElementById("upi-modal");
    if (!upiModal) {
      upiModal = document.createElement("div");
      upiModal.id = "upi-modal";
      upiModal.className = "modal-overlay";
      upiModal.innerHTML = `
        <div class="modal-dialog upi-dialog">
          <button class="modal-close-btn" id="upi-close-btn" aria-label="Close payment modal">&times;</button>
          <span class="eyebrow" style="margin-inline:auto;">Instant Payment</span>
          <h3 style="margin-top:0.5rem; margin-bottom:0.5rem; font-family:var(--font-display);">Direct UPI Transfer</h3>
          <p style="font-size:var(--text-xs); color:var(--ink-light); margin-bottom:1rem;">
            Pay directly via Google Pay, PhonePe, Paytm, or BHIM. Zero payment gateway commissions!
          </p>

          <div class="upi-id-badge">
            <span id="upi-id-text">${CART_CONFIG.upiId}</span>
            <button class="btn btn-sm btn-primary" id="copy-upi-btn" style="padding:0.25rem 0.65rem; font-size:0.75rem;">Copy</button>
          </div>

          <!-- QR code placeholder (SVG) -->
          <div class="upi-qr-box">
            <svg viewBox="0 0 140 140" width="140" height="140" fill="var(--ink)">
              <!-- Outer frame -->
              <rect width="140" height="140" fill="#ffffff"/>
              <!-- Position markers -->
              <rect x="10" y="10" width="40" height="40" fill="none" stroke="var(--ink)" stroke-width="8"/>
              <rect x="22" y="22" width="16" height="16" fill="var(--ink)"/>
              <rect x="90" y="10" width="40" height="40" fill="none" stroke="var(--ink)" stroke-width="8"/>
              <rect x="102" y="22" width="16" height="16" fill="var(--ink)"/>
              <rect x="10" y="90" width="40" height="40" fill="none" stroke="var(--ink)" stroke-width="8"/>
              <rect x="22" y="102" width="16" height="16" fill="var(--ink)"/>
              <!-- Grid simulation -->
              <rect x="60" y="20" width="16" height="8"/>
              <rect x="60" y="36" width="8" height="14"/>
              <rect x="76" y="28" width="8" height="24"/>
              <rect x="20" y="60" width="30" height="10"/>
              <rect x="60" y="60" width="20" height="20"/>
              <rect x="90" y="60" width="15" height="10"/>
              <rect x="110" y="60" width="20" height="8"/>
              <rect x="90" y="80" width="12" height="24"/>
              <rect x="60" y="90" width="18" height="14"/>
              <rect x="110" y="96" width="20" height="24"/>
              <rect x="60" y="115" width="24" height="15"/>
              <!-- Center studio stamp motif -->
              <circle cx="70" cy="70" r="10" fill="#D45D48"/>
            </svg>
          </div>

          <div style="font-size:var(--text-xs); color:var(--ink-muted); line-height:1.4; margin-bottom:1.5rem;">
            After making payment, simply share a quick screenshot with your shipping address on WhatsApp.
          </div>

          <button class="btn btn-whatsapp btn-full" id="upi-confirm-wa-btn">
            Confirm Address on WhatsApp
          </button>
        </div>
      `;
      document.body.appendChild(upiModal);

      // Close handlers
      upiModal.querySelector("#upi-close-btn").addEventListener("click", () => {
        upiModal.classList.remove("open");
      });
      upiModal.addEventListener("click", (e) => {
        if (e.target === upiModal) upiModal.classList.remove("open");
      });

      // Copy UPI ID button
      upiModal.querySelector("#copy-upi-btn").addEventListener("click", () => {
        navigator.clipboard.writeText(CART_CONFIG.upiId).then(() => {
          this.showToast("UPI ID copied to clipboard! ✦");
        });
      });

      // Confirm on WhatsApp button
      upiModal.querySelector("#upi-confirm-wa-btn").addEventListener("click", () => {
        this.checkoutViaWhatsApp();
      });
    }

    upiModal.classList.add("open");
  }
}

// Instantiate globally
let studioCart;
document.addEventListener("DOMContentLoaded", () => {
  studioCart = new StudioCart();
  window.studioCart = studioCart;
});

