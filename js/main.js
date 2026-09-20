/**
 * ====================================================================
 * Anisha Khanduja Studio - Main Application Bootstrap (main.js)
 * ====================================================================
 * Injects SEO structured data (JSON-LD), handles newsletter mock submit,
 * and sets dynamic copyright year.
 */

document.addEventListener("DOMContentLoaded", () => {
  setCopyrightYear();
  initNewsletter();
  injectStructuredData();
});

// Dynamic year in footer
function setCopyrightYear() {
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// Newsletter signup micro-interaction
function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value) return;

    if (window.studioCart) {
      window.studioCart.showToast("Welcome to the Print Club! Check your inbox soon. 💌");
    }
    input.value = "";
  });
}

// Inject JSON-LD Structured Data for ArtGallery & Products
function injectStructuredData() {
  const products = window.STUDIO_PRODUCTS || [];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VisualArtwork",
        "@id": "https://anishakhanduja.com/#studio",
        "name": "Anisha Khanduja Printmaking Studio",
        "description": "Original, handcrafted limited-edition linocut prints hand-pulled on archival cotton rag paper.",
        "artist": {
          "@type": "Person",
          "name": "Anisha Khanduja",
          "jobTitle": "Printmaker & Visual Artist"
        }
      },
      ...products.map(p => ({
        "@type": "Product",
        "name": p.title,
        "description": p.story,
        "image": p.images[0],
        "offers": {
          "@type": "Offer",
          "price": p.price,
          "priceCurrency": "INR",
          "availability": p.status === "available" 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock"
        }
      }))
    ]
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

