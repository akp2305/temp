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
        "name": "Anisha Khanduja Studio",
        "description": "Contemporary Artist · Printmaker · Painter. Limited-edition relief linocut prints and paintings on canvas.",
        "artist": {
          "@type": "Person",
          "name": "Anisha Khanduja",
          "jobTitle": "Contemporary Artist · Printmaker · Painter"
        }
      },
      ...products.map(p => ({
        "@type": "VisualArtwork",
        "name": p.title,
        "description": p.story,
        "image": p.images[0],
        "artMedium": p.medium,
        "artform": "Printmaking",
        "creator": {
          "@type": "Person",
          "name": "Anisha Khanduja"
        }
      }))
    ]
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

