# Anisha Khanduja — Printmaking Art Studio Website ✦

A production-ready, static website built for **Anisha Khanduja**, showcasing original, limited-edition linocut relief prints.

Designed with a playful, modern art-zine aesthetic crossed with a boutique print shop. Lightweight, fast, mobile-first, zero-build (plain HTML, CSS, vanilla JS), and fully compatible with **GitHub Pages** and local browsing without CORS errors.

---

## 🎨 Brand & Design System

- **Brand Name:** Anisha Khanduja
- **Tagline:** *"Original, Handcrafted."*
- **Aesthetic:** Tactile, pastel, hand-carved, and playful.
- **Color Palette (defined in `css/tokens.css`):**
  - Background Cream: `#FFF8F0`
  - Blush Pink: `#F7D6E0`
  - Butter Yellow: `#FFF1B8`
  - Mint: `#CDEBDD`
  - Lavender: `#DCD3F5`
  - Peach: `#FFD9C2`
  - Sky: `#CFE4F7`
  - Ink (Text & Outlines): `#2B2530`
- **Typography:**
  - Display / Headings: `Fraunces`
  - Body / UI: `DM Sans`
  - Handwritten Accents: `Caveat`

---

## 📁 Project Structure

```
.
├── index.html                  # Main studio website
├── 404.html                    # Whimsical 404 error page
├── README.md                   # This maintenance and deployment guide
├── favicon.svg                 # Handcrafted studio favicon
├── css/
│   ├── tokens.css              # Colors, fonts, clamp() fluid scale, ink shadows
│   ├── base.css                # Resets, paper grain overlay, wobbly utilities
│   ├── components.css          # Header, hero, cards, badges, modal, drawer, accordion
│   ├── utilities.css           # Animations, responsive layout, prefers-reduced-motion
│   └── style.css               # Master stylesheet importing all files
├── js/
│   ├── main.js                 # App initialization, dynamic year, JSON-LD schema
│   ├── cart.js                 # LocalStorage cart, drawer UI, WhatsApp & UPI checkout
│   ├── gallery.js              # Shop cards, filter chips, sort, hash modal (#piece-id)
│   └── ui.js                   # Hero exhibition loupe inspector, mobile nav, custom cursor, scroll reveal
└── assets/
    ├── data/
    │   └── products.js         # Single source of truth for all artworks (4 authentic prints)
    └── img/
        ├── prints/             # Photos of original linocuts
        └── studio/             # Studio textures and artist portrait
```

---

## 🛠️ Step-by-Step Customization Guide

### 1. How to Add a New Artwork
You never need to touch `index.html` to add, edit, or remove artworks! The entire gallery, filters, and detail modal render dynamically from `assets/data/products.js`.

1. Place your artwork photo in `assets/img/prints/` (e.g. `assets/img/prints/my-new-print.jpg`).
2. Open `assets/data/products.js`.
3. Add a new object to the `STUDIO_PRODUCTS` array:

```javascript
{
  id: "piece-05",
  title: "Morning Garden",
  slug: "morning-garden",
  collection: "Botanicals & Nature",
  story: "A quiet study of dew-covered leaves in early morning light.",
  medium: "Hand-pulled linocut with Cranfield oil-based ink",
  paper: "250gsm Somerset Velvet Cotton Paper",
  dimensions: "10 × 12 inches (25.4 × 30.5 cm)",
  editionSize: 10,
  editionNumberAvailable: 5,
  price: 3200,
  currency: "₹",
  status: "available", // or "sold"
  dateAdded: "2026-10-01",
  paymentLink: "",      // Optional direct Razorpay/Stripe link
  images: [
    "assets/img/prints/my-new-print.jpg"
  ]
}
```

---

### 2. How to Change Colors and Fonts
All visual tokens are defined in **`css/tokens.css`**:

- **To adjust colors:**
  ```css
  :root {
    --bg-cream: #FFF8F0;
    --blush: #F7D6E0;
    --butter: #FFF1B8;
    --mint: #CDEBDD;
    --ink: #2B2530; /* Your near-black relief ink outline color */
  }
  ```
- **To change fonts:**
  Update the `--font-display`, `--font-body`, or `--font-hand` variables in `css/tokens.css` and update the Google Fonts `@import` link at the top of `css/style.css`.

---

### 3. Studio Contacts & Checkout Configuration
The studio contact details are integrated across the site:
- **WhatsApp:** `+91 98974 55555` (`https://wa.me/919897455555`)
- **Email:** `printmakingpainting@gmail.com`
- **Instagram:** `@printed.painted_` (`https://www.instagram.com/printed.painted_/`)

To update WhatsApp checkout settings, open **`js/cart.js`**:

```javascript
const CART_CONFIG = {
  // Studio WhatsApp contact (with country code, no + or spaces)
  whatsappNumber: "919897455555",
  
  // Replace with your UPI ID (Google Pay / PhonePe / BHIM)
  upiId: "anisha@upi",
  
  // Free shipping threshold in ₹
  freeShippingThreshold: 1999,
  
  // Standard shipping fee if below threshold
  standardShippingFee: 150
};
```

When customers click **"Order on WhatsApp"**, it automatically generates a pre-filled itemized message with print titles, quantities, sizes, and pricing directly into a WhatsApp chat with this number!

---

### 4. How to Add Direct Payment Links (Razorpay, Stripe, Instamojo)
If you have payment links generated from Razorpay or Stripe for specific prints:
1. Open `assets/data/products.js`.
2. Find the product and paste your payment link in the `paymentLink` property:
   ```javascript
   paymentLink: "https://rzp.io/l/your-link-here"
   ```
3. When a buyer clicks **"Buy Now"** on that artwork's detail modal, it will directly open your secure payment link in a new tab!

---

### 5. How to Deploy to GitHub Pages (Step by Step)

Because this website uses **pure relative paths** (`./`, `css/...`, `assets/...`), it runs seamlessly under repository subpaths such as `https://username.github.io/anisha-khanduja/`.

1. **Create a GitHub Repository:**
   - Log into [GitHub](https://github.com) and click **New Repository**.
   - Name your repo (e.g. `anisha-khanduja-prints` or `studio`).
   - Leave it **Public** (required for free GitHub Pages).

2. **Upload or Push Your Files:**
   - If using Git from your computer:
     ```bash
     git init
     git add .
     git commit -m "Launch Anisha Khanduja Studio website"
     git branch -M main
     git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
     git push -u origin main
     ```
   - *Or simply drag and drop the folder contents into GitHub's web interface.*

3. **Enable GitHub Pages:**
   - Go to your repository **Settings** tab.
   - Click on **Pages** in the left sidebar menu.
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Set the branch to **`main`** and folder to **`/ (root)`**.
   - Click **Save**.

4. **Your Live Site:**
   - In 1–2 minutes, GitHub will provide your live URL:
     `https://<YOUR_USERNAME>.github.io/<YOUR_REPO>/`
   - Share this link directly in your Instagram bio or WhatsApp catalog!

---

## ⚡ Accessibility & Performance Features

- **Semantic HTML5 & Accessible Landmarks:** Full ARIA dialog roles, focus management, and keyboard `Escape` closing on modals and cart drawer.
- **Prefers-Reduced-Motion:** Respects operating system accessibility settings by turning off marquee loops, reveal transforms, and transitions.
- **No Build Tools or CORS Hurdles:** Works immediately when opened directly in a browser (`file:///index.html`) or via VS Code Live Server.
- **SEO & Social Sharing:** Includes Open Graph tags, Twitter cards, and structured JSON-LD schema for search engines.

