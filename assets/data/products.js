/**
 * ====================================================================
 * Anisha Khanduja Studio - Artworks Data File (products.js)
 * ====================================================================
 * Single source of truth for the entire shop, gallery, featured carousel,
 * search filters, and detail modals.
 *
 * HOW TO ADD A NEW ARTWORK:
 * Simply copy one of the objects below, give it a unique `id` (e.g. "piece-09"),
 * fill in your title, story, paper, size, price, and image paths, and save this file!
 * The gallery, filter chips, and cart will update automatically.
 *
 * NOTE ON IMAGES:
 * Put your photos in `assets/img/prints/` and use relative paths like
 * "assets/img/prints/my-artwork.jpg". You can provide multiple angles
 * (e.g. [full print, close-up texture, framed wall mockup]).
 *
 * NOTE ON STATUS:
 * - "available"   : Customer can add to cart and purchase
 * - "sold"        : Displays "Sold" sticker badge; disables add-to-cart; shows "Ask for custom variation"
 * - "coming-soon" : Displays preview badge
 */

const STUDIO_PRODUCTS = [
  {
    id: "piece-01",
    title: "Ordinary Objects - I",
    slug: "ordinary-objects-1",
    collection: "Still Life & Interiors",
    story: "A slow meditation on morning rituals and everyday companions. The steam rising from ceramic mugs, an umbrella resting quietly against striped panels, and the warm geometry of domestic light. Carved with rhythmic vertical gouge marks that evoke the gentle pulse of the morning.",
    medium: "Hand-pulled relief linocut using Cranfield Caligo Safe Wash Oil-Based Relief Ink in Carbon Black",
    paper: "250gsm Somerset Velvet 100% Cotton Rag Paper with hand-torn deckled edges",
    dimensions: "12 × 16 inches (30.5 × 40.6 cm)",
    editionSize: 8,
    editionNumberAvailable: 2,
    price: 3400,
    currency: "₹",
    status: "available",
    featured: true,
    dateAdded: "2026-09-01",
    paymentLink: "", // TODO: Paste your Razorpay / Stripe / Instamojo payment link here (optional)
    images: [
      "assets/img/prints/ordinary-objects-1.jpg",
      "assets/img/studio/carved-lino-plate.svg"
    ]
  },
  {
    id: "piece-02",
    title: "Moon",
    slug: "moon",
    collection: "Celestial & Minimalist",
    story: "The crescent moon suspended in deep velvet relief. Carved with bold, expressive gouge marks that catch the ambient light, celebrating the raw texture of the linoleum matrix and the quiet serenity of the night sky.",
    medium: "Original hand-carved relief print, hand-burnished with traditional Japanese bamboo baren",
    paper: "300gsm Handcrafted Indian Khadi Cotton Rag Paper",
    dimensions: "10 × 10 inches (25.4 × 25.4 cm)",
    editionSize: 6,
    editionNumberAvailable: 3,
    price: 2600,
    currency: "₹",
    status: "available",
    featured: true,
    dateAdded: "2026-09-05",
    paymentLink: "", // TODO: Paste payment link
    images: [
      "assets/img/prints/moon.jpg"
    ]
  },
  {
    id: "piece-03",
    title: "Ordinary Objects - III",
    slug: "ordinary-objects-3",
    collection: "Still Life & Interiors",
    story: "Checkered tile patterns meeting botanical shadows. A candle flickers beside wild pomegranate branches, casting linocut rays across the studio shelves laden with apothecary bottles and rain umbrellas. An intimate interior study.",
    medium: "Original linocut relief print with Charbonnel oil-based relief ink in deep graphite black",
    paper: "280gsm Fabriano Rosaspina Fine Art Paper (acid-free, archival)",
    dimensions: "14 × 18 inches (35.5 × 45.7 cm)",
    editionSize: 7,
    editionNumberAvailable: 1,
    price: 3800,
    currency: "₹",
    status: "available",
    featured: true,
    dateAdded: "2026-09-08",
    paymentLink: "", // TODO: Paste payment link
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
    status: "sold", // Marked sold for social proof and custom request demonstration
    featured: true,
    dateAdded: "2026-08-20",
    paymentLink: "",
    images: [
      "assets/img/prints/shelter.png"
    ]
  },
  {
    id: "piece-05",
    title: "Midnight Flora",
    slug: "midnight-flora",
    collection: "Botanicals & Nature",
    story: "Wild fern fronds unfurling under the stars. Drawn from midnight strolls in the monsoon gardens, where foliage casts dramatic, high-contrast silhouettes. Each leaflet is carved by hand with fine U-gouges.",
    medium: "Hand-pressed relief print using non-toxic water-washable relief inks",
    paper: "220gsm Lokta Himalayan Handmade Paper with organic bark inclusions",
    dimensions: "11 × 14 inches (27.9 × 35.5 cm)",
    editionSize: 15,
    editionNumberAvailable: 4,
    price: 2800,
    currency: "₹",
    status: "available",
    featured: true,
    dateAdded: "2026-09-10",
    paymentLink: "",
    images: [
      "assets/img/prints/midnight-flora.svg"
    ]
  },
  {
    id: "piece-06",
    title: "Chai at Twilight",
    slug: "chai-at-twilight",
    collection: "Still Life & Interiors",
    story: "Steaming cutting chai glasses beside a stovetop kettle as twilight sets over the courtyard. A homage to evening conversations, warm cardamom spices, and the quiet comfort of taking time to pause.",
    medium: "Original linocut print with Cranfield oil-based ink",
    paper: "250gsm Somerset Velvet Cotton Paper",
    dimensions: "10 × 12 inches (25.4 × 30.5 cm)",
    editionSize: 10,
    editionNumberAvailable: 2,
    price: 2900,
    currency: "₹",
    status: "available",
    featured: false,
    dateAdded: "2026-09-12",
    paymentLink: "",
    images: [
      "assets/img/prints/chai-at-twilight.svg"
    ]
  },
  {
    id: "piece-07",
    title: "Monsoon Terrace",
    slug: "monsoon-terrace",
    collection: "Architecture & Spaces",
    story: "Potted monstera leaves enjoying the rain through an arched terrace colonnade. Diagonal relief cuts capture the gentle rhythm of monsoon showers washing over old brickwork.",
    medium: "Relief linocut printed on heavy cotton rag",
    paper: "300gsm Fabriano Artistico Extra White Paper",
    dimensions: "12 × 16 inches (30.5 × 40.6 cm)",
    editionSize: 12,
    editionNumberAvailable: 6,
    price: 3600,
    currency: "₹",
    status: "available",
    featured: false,
    dateAdded: "2026-09-15",
    paymentLink: "",
    images: [
      "assets/img/prints/monsoon-terrace.svg"
    ]
  },
  {
    id: "piece-08",
    title: "The Weaver's Sparrow",
    slug: "weavers-sparrow",
    collection: "Botanicals & Nature",
    story: "A native Indian sparrow perched on a blooming acacia branch. The feather textures and wood grain relief are achieved with microscopic hairline cuts, honoring the delicate wildlife that shares our cities.",
    medium: "Single-block linocut hand-pulled with a vintage cast-iron book press",
    paper: "250gsm Somerset Velvet Rag",
    dimensions: "9 × 12 inches (22.8 × 30.5 cm)",
    editionSize: 8,
    editionNumberAvailable: 2,
    price: 2400,
    currency: "₹",
    status: "available",
    featured: false,
    dateAdded: "2026-09-16",
    paymentLink: "",
    images: [
      "assets/img/prints/weavers-sparrow.svg"
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

