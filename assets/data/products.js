/**
 * ====================================================================
 * Anisha Khanduja Studio - Artworks Data File (products.js)
 * ====================================================================
 * Single source of truth for all artworks in the gallery and cart.
 * Contains only the authentic original linocut editions by Anisha Khanduja.
 */

const STUDIO_PRODUCTS = [
  {
    id: "piece-01",
    title: "Ordinary Objects - I",
    slug: "ordinary-objects-1",
    collection: "Still Life & Interiors",
    story: "A quiet meditation on morning rituals and everyday companions. The steam rising from ceramic mugs, an umbrella resting gently against striped panels, and the warm geometry of domestic light. Carved with rhythmic vertical gouge marks that capture the soft morning pulse.",
    medium: "Hand-pulled relief linocut using Cranfield Caligo Safe Wash Oil-Based Relief Ink in Carbon Black",
    paper: "250gsm Somerset Velvet 100% Cotton Rag Paper with hand-torn deckled edges",
    dimensions: "12 × 16 inches (30.5 × 40.6 cm)",
    editionSize: 8,
    editionNumberAvailable: 2,
    price: 3400,
    currency: "₹",
    status: "available",
    dateAdded: "2026-09-01",
    paymentLink: "",
    images: [
      "assets/img/prints/ordinary-objects-1.jpg"
    ]
  },
  {
    id: "piece-02",
    title: "Moon",
    slug: "moon",
    collection: "Celestial & Minimalist",
    story: "The crescent moon suspended in deep velvet relief. Carved with bold, expressive gouge marks that catch the ambient light, celebrating the raw texture of the linoleum matrix and the quiet stillness of the night sky.",
    medium: "Original hand-carved relief print, hand-burnished with traditional Japanese bamboo baren",
    paper: "300gsm Handcrafted Indian Khadi Cotton Rag Paper",
    dimensions: "10 × 10 inches (25.4 × 25.4 cm)",
    editionSize: 6,
    editionNumberAvailable: 3,
    price: 2600,
    currency: "₹",
    status: "available",
    dateAdded: "2026-09-05",
    paymentLink: "",
    images: [
      "assets/img/prints/moon.jpg"
    ]
  },
  {
    id: "piece-03",
    title: "Ordinary Objects - III",
    slug: "ordinary-objects-3",
    collection: "Still Life & Interiors",
    story: "Checkered tile patterns meeting botanical shadows. A candle flickers beside wild pomegranate branches, casting linocut rays across studio shelves laden with apothecary bottles and rain umbrellas. An intimate interior study.",
    medium: "Original linocut relief print with Charbonnel oil-based relief ink in deep graphite black",
    paper: "280gsm Fabriano Rosaspina Fine Art Paper (acid-free, archival)",
    dimensions: "14 × 18 inches (35.5 × 45.7 cm)",
    editionSize: 7,
    editionNumberAvailable: 1,
    price: 3800,
    currency: "₹",
    status: "available",
    dateAdded: "2026-09-08",
    paymentLink: "",
    images: [
      "assets/img/prints/ordinary-objects-3.png"
    ]
  },
  {
    id: "piece-04",
    title: "Shelter",
    slug: "shelter",
    collection: "Still Life & Interiors",
    story: "A diptych study in sanctuary: an umbrella arching against a downpour paired with a grounded monolithic doorway. Symbolizing protection, inner warmth, and quiet retreat from the bustling world.",
    medium: "Two-plate linocut print, hand-inked and individually pressed on warm cream stock",
    paper: "250gsm Somerset Satin 100% Cotton Paper",
    dimensions: "11 × 15 inches (28 × 38 cm)",
    editionSize: 6,
    editionNumberAvailable: 0,
    price: 3200,
    currency: "₹",
    status: "sold",
    dateAdded: "2026-08-20",
    paymentLink: "",
    images: [
      "assets/img/prints/shelter.png"
    ]
  }
];

// Attach globally for browser use without build steps or CORS
if (typeof window !== "undefined") {
  window.STUDIO_PRODUCTS = STUDIO_PRODUCTS;
}

// Module export fallback for Node / test environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = STUDIO_PRODUCTS;
}
