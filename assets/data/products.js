/**
 * ====================================================================
 * Anisha Khanduja Studio - Artworks Data File (products.js)
 * ====================================================================
 * Single source of truth for all artworks in the gallery, modals, and exhibitions.
 * Sourced directly from the official Studio Art Catalogue.
 */

const STUDIO_PRODUCTS = [
  // --------------------------------------------------------------------
  // LINOCUT RELIEF PRINTS
  // --------------------------------------------------------------------
  {
    id: "moon",
    slug: "moon",
    title: "Moon",
    category: "linocut",
    theme: "Symbols",
    year: "2026",
    medium: "Linocut on paper",
    paper: "300gsm Handcrafted Indian Khadi Cotton Rag Paper",
    dimensions: "Frame: 20 × 17 cm · Print: 8.2 × 6.7 cm",
    frameDimensions: "20 × 17 cm",
    printDimensions: "8.2 × 6.7 cm",
    edition: "Limited Edition of 6",
    editionSize: 6,
    timeTaken: "3 hours · Hand carving and printing",
    story: "Moon is a small linocut print that began as a rough idea carved into a block. It is the first piece in a series made for Shiva, and the moon was chosen as the softest way in. Small in scale, it carries the whole series.",
    status: "available",
    images: [
      "assets/img/prints/moon.jpg"
    ]
  },
  {
    id: "ordinary-objects-1",
    slug: "ordinary-objects-1",
    title: "Ordinary Objects 1",
    category: "linocut",
    theme: "Micro spaces in macro environment",
    year: "Carved|2021; Printed|2026",
    medium: "Linocut on Paper",
    paper: "250gsm Somerset Velvet 100% Cotton Rag Paper",
    dimensions: "Frame: 61 × 52 cm · Print: 44.2 × 29.2 cm",
    frameDimensions: "61 × 52 cm",
    printDimensions: "44.2 × 29.2 cm",
    edition: "Limited Edition of 8",
    editionSize: 8,
    timeTaken: "45 hours · Hand carving and printing",
    story: "Ordinary Objects 1 is a linocut that grew out of the Covid period, when being homebound changed the way familiar surroundings were seen. Objects passed countless times began to occupy the small spaces of home, micro spaces within a macro environment. The piece observes a lamp and a few mismatched mugs closely, and honours the printmaking process itself, where the final image comes through adjustments and unsuccessful impressions rather than one perfect attempt.",
    status: "available",
    images: [
      "assets/img/prints/ordinary-objects-1.jpg"
    ]
  },
  {
    id: "ordinary-objects-3",
    slug: "ordinary-objects-3",
    title: "Ordinary Objects 3",
    category: "linocut",
    theme: "Micro spaces in macro environment",
    year: "Carved|2025; Printed|2026",
    medium: "Linocut on Paper",
    paper: "280gsm Fabriano Rosaspina Fine Art Paper",
    dimensions: "Frame: 61 × 52 cm · Print: 44.2 × 29.2 cm",
    frameDimensions: "61 × 52 cm",
    printDimensions: "44.2 × 29.2 cm",
    edition: "Limited Edition of 7",
    editionSize: 7,
    timeTaken: "44 hours · Hand carving and printing",
    story: "Ordinary Objects 3 continues the Micro Spaces in Macro Environment series, looking closely at the familiar spaces and objects that usually pass unnoticed: a candle, a flower, a few bottles on a shelf, a checkered floor. Documenting them reveals the ordinary things that make a home a home. Every texture, line of hatching and shade was carved by hand, one cut at a time, with no undo once the block is cut. The closer you look, the less ordinary it becomes.",
    status: "available",
    images: [
      "assets/img/prints/ordinary-objects-3.jpg"
    ]
  },
  {
    id: "shelter",
    slug: "shelter",
    title: "Shelter",
    category: "linocut",
    theme: "Symbols",
    year: "2026",
    medium: "Linocut on paper",
    paper: "250gsm Somerset Satin 100% Cotton Paper",
    dimensions: "Frame: 31.5 × 23 cm",
    frameDimensions: "31.5 × 23 cm",
    printDimensions: "21 × 15 cm",
    edition: "Edition of 6",
    editionSize: 6,
    timeTaken: "10 hours · Hand carving and printing",
    story: "Shelter looks at fatherhood through the ordinary things fathers carry: a shirt pocket, always full, and an umbrella held over. Brought together in one print, these two forms speak of protection, provision and the quiet things that often go unnoticed. It is also an expression of gratitude for everything received while standing under someone's shelter. Each print is given a name before it leaves the studio, and the edition was made in six.",
    status: "available",
    images: [
      "assets/img/prints/shelter.jpg"
    ]
  },

  // --------------------------------------------------------------------
  // CYANOTYPE SUN PRINTS
  // --------------------------------------------------------------------
  {
    id: "cyanotype-circle",
    slug: "cyanotype-circle",
    title: "Circle",
    category: "cyanotype",
    theme: "Celestial & Botanical Geometry",
    year: "2026",
    medium: "Cyanotype on Paper",
    paper: "300gsm Watercolor Paper",
    dimensions: "Frame: 30 × 30 cm · Print: 20 cm diameter",
    frameDimensions: "30 × 30 cm",
    printDimensions: "20 cm diameter",
    edition: "Limited Edition of 2",
    editionSize: 2,
    timeTaken: "~8 hours solar exposure & wash",
    story: "An exploration of circular stillness and Prussian blue tonal depth exposed under natural sunlight. Using hand-brushed light-sensitive emulsion and organic masks, each circular impression captures subtle solar gradients and the quiet energy of the sun.",
    status: "available",
    images: [
      "assets/img/prints/cyanotype-circle.png",
      "assets/img/prints/cyanotype-food.png"
    ]
  },
  {
    id: "cyanotype-circle-1",
    slug: "cyanotype-circle-1",
    title: "Cyanotype Circle",
    category: "cyanotype",
    theme: "Celestial & Botanical Geometry",
    year: "2026",
    medium: "Cyanotype on Paper",
    paper: "300gsm Watercolor Paper",
    dimensions: "Frame: 30 × 30 cm · Print: 20 cm diameter",
    frameDimensions: "30 × 30 cm",
    printDimensions: "20 cm diameter",
    edition: "Limited Edition (Circle)",
    editionSize: 2,
    timeTaken: "~8 hours solar exposure",
    story: "Hand-coated light-sensitive emulsion exposed under direct solar rays on fine art paper, capturing organic shadows in deep Prussian blue.",
    status: "available",
    images: [
      "assets/img/prints/cyanotype-circle.png"
    ]
  },
  {
    id: "cyanotype-circle-2",
    slug: "cyanotype-circle-2",
    title: "Cyanotype Food",
    category: "cyanotype",
    theme: "Celestial & Botanical Geometry",
    year: "2026",
    medium: "Cyanotype on Paper",
    paper: "300gsm Watercolor Paper",
    dimensions: "Frame: 30 × 30 cm · Print: 20 cm diameter",
    frameDimensions: "30 × 30 cm",
    printDimensions: "20 cm diameter",
    edition: "Limited Edition (Food)",
    editionSize: 2,
    timeTaken: "~8 hours solar exposure",
    story: "Complementary circular celestial study developed with sun exposure and pure water wash, balancing geometric restraint with natural variation.",
    status: "available",
    images: [
      "assets/img/prints/cyanotype-food.png"
    ]
  },
  {
    id: "cyanotype-series-1",
    slug: "cyanotype-series-1",
    title: "Cyanotype Series I",
    category: "cyanotype",
    theme: "Botanical impression & shadow play",
    year: "2026",
    medium: "Cyanotype on Paper",
    paper: "300gsm Fine Art Paper",
    dimensions: "Frame: 35 × 28 cm · Print: 25 × 18 cm",
    frameDimensions: "35 × 28 cm",
    printDimensions: "25 × 18 cm",
    edition: "Cyanotype Series of 5",
    editionSize: 5,
    timeTaken: "~6 hours solar exposure",
    story: "Natural botanical specimens pressed in sunlight, revealing intricate organic silhouettes and delicate leaf textures in Prussian blue.",
    status: "available",
    images: [
      "assets/img/prints/cyanotype-series-1.jpg"
    ]
  },
  {
    id: "cyanotype-series-2",
    slug: "cyanotype-series-2",
    title: "Cyanotype Series II",
    category: "cyanotype",
    theme: "Botanical impression & shadow play",
    year: "2026",
    medium: "Cyanotype on Paper",
    paper: "300gsm Fine Art Paper",
    dimensions: "Frame: 35 × 28 cm · Print: 25 × 18 cm",
    frameDimensions: "35 × 28 cm",
    printDimensions: "25 × 18 cm",
    edition: "Cyanotype Series of 5",
    editionSize: 5,
    timeTaken: "~6 hours solar exposure",
    story: "Sun-exposed botanical composition on heavyweight fine art paper, exploring the rhythm of natural foliage against sunlight.",
    status: "available",
    images: [
      "assets/img/prints/cyanotype-series-2.jpg"
    ]
  },
  {
    id: "cyanotype-series-3",
    slug: "cyanotype-series-3",
    title: "Cyanotype Series III",
    category: "cyanotype",
    theme: "Botanical impression & shadow play",
    year: "2026",
    medium: "Cyanotype on Paper",
    paper: "300gsm Fine Art Paper",
    dimensions: "Frame: 35 × 28 cm · Print: 25 × 18 cm",
    frameDimensions: "35 × 28 cm",
    printDimensions: "25 × 18 cm",
    edition: "Cyanotype Series of 5",
    editionSize: 5,
    timeTaken: "~6 hours solar exposure",
    story: "Exploration of translucent leaf structures and rich Prussian blue gradients captured during midday solar exposure.",
    status: "available",
    images: [
      "assets/img/prints/cyanotype-series-3.jpg"
    ]
  },
  {
    id: "cyanotype-series-4",
    slug: "cyanotype-series-4",
    title: "Cyanotype Series IV",
    category: "cyanotype",
    theme: "Botanical impression & shadow play",
    year: "2026",
    medium: "Cyanotype on Paper",
    paper: "300gsm Fine Art Paper",
    dimensions: "Frame: 35 × 28 cm · Print: 25 × 18 cm",
    frameDimensions: "35 × 28 cm",
    printDimensions: "25 × 18 cm",
    edition: "Cyanotype Series of 5",
    editionSize: 5,
    timeTaken: "~6 hours solar exposure",
    story: "Direct contact solar photogram capturing fleeting botanical memory with delicate feathering and edge contrast.",
    status: "available",
    images: [
      "assets/img/prints/cyanotype-series-4.jpg"
    ]
  },
  {
    id: "cyanotype-series-5",
    slug: "cyanotype-series-5",
    title: "Cyanotype Series V",
    category: "cyanotype",
    theme: "Botanical impression & shadow play",
    year: "2026",
    medium: "Cyanotype on Paper",
    paper: "300gsm Fine Art Paper",
    dimensions: "Frame: 35 × 28 cm · Print: 25 × 18 cm",
    frameDimensions: "35 × 28 cm",
    printDimensions: "25 × 18 cm",
    edition: "Cyanotype Series of 5",
    editionSize: 5,
    timeTaken: "~6 hours solar exposure",
    story: "Concluding plate in the five-part botanical sun series, embodying the quiet transformation of light into deep indigo tone.",
    status: "available",
    images: [
      "assets/img/prints/cyanotype-series-5.jpg"
    ]
  },

  {
    id: "fish-painting",
    slug: "marking-the-fish",
    title: "Marking The Fish",
    category: "paintings",
    theme: "Inbetween",
    year: "2026",
    medium: "Acrylic on Paper",
    dimensions: "80.5 × 60.5 cm",
    edition: "Original Work",
    editionSize: 1,
    timeTaken: "35 hours",
    story: "Fish Painting treats contemporary art as a way of using different techniques to bring a subject to life, rather than following a single style. Traditional pattern-making meets bold, unapologetic colour across the body of the fish, with a tiny painting within the larger one waiting for those who zoom in. It is a celebration of Indian maximalism, patterns and colour, and of Indian contemporary art's ability to hold the old and the new at once.",
    status: "available",
    images: [
      "assets/img/paintings/marking-the-fish.png"
    ]
  },
  {
    id: "forest-painting",
    slug: "foliage",
    title: "Foliage",
    category: "paintings",
    theme: "Inbetween",
    year: "2021",
    medium: "Acrylic on paper",
    dimensions: "79 × 58.6 cm",
    edition: "Original Work",
    editionSize: 1,
    timeTaken: "75 hours",
    story: "Forest Painting is less about painting nature and more about painting light moving through it. Hours of work went into discovering that nature has its own unique shades and knows how to balance itself perfectly-imperfectly. Look closely and the greens split into entirely different shades, tones and textures.",
    status: "available",
    images: [
      "assets/img/paintings/forest-painting.jpg"
    ]
  }
];

// Attach globally for browser use without build steps
if (typeof window !== "undefined") {
  window.STUDIO_PRODUCTS = STUDIO_PRODUCTS;
}

// Module export fallback for Node / test environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = STUDIO_PRODUCTS;
}
