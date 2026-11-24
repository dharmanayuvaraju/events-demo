/**
 * A3Y Celebrations - Asset Manifest & Provenance Registry
 * 
 * Curated high-resolution celebration decor imagery illustrating wedding ceremonies,
 * floral installations, milestone staging, and spatial architecture.
 * 
 * DISCLAIMER & HONESTY NOTICE:
 * All imagery is licensed via Unsplash for editorial concept demonstration.
 * These assets illustrate design palettes and spatial layout; they do NOT
 * represent commercial work completed by A3Y Solutions.
 */

export interface PortfolioAsset {
  id: string;
  title: string;
  category: 'weddings' | 'milestones' | 'florals' | 'spatial';
  categoryLabel: string;
  imagePath: string;
  photographer: string;
  sourceUrl: string;
  license: string;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  caption: string;
  description: string;
  spec: {
    palette: string[];
    elements: string[];
    venue: string;
  };
}

export interface AccordionItem {
  id: string;
  index: string;
  category: string;
  title: string;
  shortDesc: string;
  imagePath: string;
  photographer: string;
  desktopHeight: number;
  route: string;
}

export const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: "acc-mandap",
    index: "01",
    category: "Ceremonies",
    title: "Traditional Ceremony Mandap",
    shortDesc: "Four-pillar sacred canopy with fresh golden marigold latkans and royal silk drapery.",
    imagePath: "/portfolio/photo_wedding_mandap_grand.jpg",
    photographer: "Photos Hobby",
    desktopHeight: 540,
    route: "/decorations#ceremonies",
  },
  {
    id: "acc-milestone",
    index: "02",
    category: "Milestones",
    title: "Festive Celebration Styling",
    shortDesc: "Organic party color palettes, celebration accents, and warm ambient styling.",
    imagePath: "/portfolio/photo_milestone_celebration.jpg",
    photographer: "Joanna Kosinska",
    desktopHeight: 500,
    route: "/decorations#milestones",
  },
  {
    id: "acc-canopy",
    index: "03",
    category: "Ceremonies",
    title: "Cascading Blossom Ceremony Canopy",
    shortDesc: "Dense white floral swags suspended over ceremonial seating with warm candlelight glow.",
    imagePath: "/portfolio/photo_floral_mandap_canopy.jpg",
    photographer: "Tom Pumford",
    desktopHeight: 530,
    route: "/decorations#ceremonies",
  },
  {
    id: "acc-arch",
    index: "04",
    category: "Ambient",
    title: "Grand Entrance Organic Archway",
    shortDesc: "Asymmetrical organic celebration archway framing guest arrival in warm tones.",
    imagePath: "/portfolio/photo_balloon_entrance_arch.jpg",
    photographer: "Rohan Makhecha",
    desktopHeight: 490,
    route: "/decorations#ambient",
  },
  {
    id: "acc-toran",
    index: "05",
    category: "Florals",
    title: "Temple Toran & Urli Staging",
    shortDesc: "Auspicious yellow and orange marigold garlands paired with brass urli floating petals.",
    imagePath: "/portfolio/photo_flower_temple_toran.jpg",
    photographer: "Siddhesh Mangore",
    desktopHeight: 520,
    route: "/decorations#florals",
  },
  {
    id: "acc-haldi",
    index: "06",
    category: "Florals",
    title: "Haldi Ceremonial Pavilion",
    shortDesc: "Vibrant yellow fabric canopy styled with marigold latkans and traditional ceremonial dais.",
    imagePath: "/portfolio/photo_haldi_ceremony.jpg",
    photographer: "Karan Somani",
    desktopHeight: 510,
    route: "/decorations#florals",
  },
  {
    id: "acc-reception",
    index: "07",
    category: "Ambient",
    title: "Evening Canopy Dining",
    shortDesc: "Suspended gossamer fabric canopy over dining tables with glowing fairy lights.",
    imagePath: "/portfolio/photo_dinner_canopy_evening.jpg",
    photographer: "Thomas William",
    desktopHeight: 535,
    route: "/decorations#ambient",
  },
];

export const ASSETS_MANIFEST: PortfolioAsset[] = [
  {
    id: "asset-wed-grand-mandap",
    title: "Traditional Ceremony Mandap & Silk Swags",
    category: "weddings",
    categoryLabel: "Ceremonial Pavilions",
    imagePath: "/portfolio/photo_wedding_mandap_grand.jpg",
    photographer: "Photos Hobby",
    sourceUrl: "https://unsplash.com/photos/1587271407850-8d438ca9fdf2",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Sacred ceremony mandap platform with fresh cascading floral canopies, chandelier, and ceremonial golden drapes",
    description: "Traditional wedding mandap adorned with fresh golden marigold and jasmine garlands, rich royal silk fabric drapery, brass ceremonial lamps, and regal seating.",
    spec: {
      palette: ["#1F2921", "#C29B68", "#FAF7F2", "#E9563F"],
      elements: ["Four-Pillar Mandap Structure", "Fresh Marigold & Jasmine Hangings", "Silk Drapery", "Brass Diya Staging"],
      venue: "Convention Center / Kalyana Mandapam",
    },
  },
  {
    id: "asset-wed-aisle",
    title: "Scenic Ceremony Aisle & Floral Arches",
    category: "weddings",
    categoryLabel: "Ceremonial Pavilions",
    imagePath: "/portfolio/photo_scenic_aisle_ceremony.jpg",
    photographer: "Sandy Millar",
    sourceUrl: "https://unsplash.com/photos/611481863552",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1800, height: 1200, aspectRatio: "3/2" },
    caption: "Open-air ceremonial aisle lined with delicate blossom clusters and warm ambient pillar lights",
    description: "Open-air wedding ceremony aisle framed with natural timber arches, cascading ivory floral arrangements, and warm lantern lighting.",
    spec: {
      palette: ["#FAF7F2", "#2E3D31", "#C29B68"],
      elements: ["Timber Aisle Pillars", "Ivory Rose & Hydrangea Clusters", "Linen Runner", "Warm Ambient Lanterns"],
      venue: "Garden Courtyard / Estate Lawn",
    },
  },
  {
    id: "asset-wed-canopy",
    title: "Cascading Blossom Ceremony Canopy",
    category: "weddings",
    categoryLabel: "Ceremonial Pavilions",
    imagePath: "/portfolio/photo_floral_mandap_canopy.jpg",
    photographer: "Tom Pumford",
    sourceUrl: "https://unsplash.com/photos/715cb0215aed",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Pillar framework with dense cascading white blossoms and warm amber ambient ceremony illumination",
    description: "Four-pillar ceremony mandap decorated with dense white blossom cascades, golden fabric swags, and welcoming entrance aisle walkway.",
    spec: {
      palette: ["#1F2921", "#FAF7F2", "#C29B68"],
      elements: ["Mandap Pillar Framework", "Cascading Floral Garlands", "Ceremonial Seating Dais", "Aisle Walkway Pillars"],
      venue: "Community Hall / Temple Premises",
    },
  },
  {
    id: "asset-milestone-festive",
    title: "Milestone Celebration & Party Staging",
    category: "milestones",
    categoryLabel: "Milestone Staging",
    imagePath: "/portfolio/photo_milestone_celebration.jpg",
    photographer: "Joanna Kosinska",
    sourceUrl: "https://unsplash.com/photos/1527529482837",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Grand celebration entrance portal and party styling with organic color palettes",
    description: "Festive milestone celebration decor featuring curated color accents, statement entry framing, and celebratory styling.",
    spec: {
      palette: ["#FAF7F2", "#E9563F", "#C29B68", "#1F2921"],
      elements: ["Festive Palette Accents", "Celebration Table Decor", "Curated Party Styling"],
      venue: "Private Residence / Clubhouse",
    },
  },
  {
    id: "asset-milestone-pastel",
    title: "Pastel Organic Balloon Installation",
    category: "milestones",
    categoryLabel: "Milestone Staging",
    imagePath: "/portfolio/photo_birthday_pastel_ring.jpg",
    photographer: "Adi Goldstein",
    sourceUrl: "https://unsplash.com/photos/de8c9debad1d",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Organic pastel balloon styling installation for festive celebrations",
    description: "Modern celebratory balloon decor with multi-sized pastel balloon clusters and warm ambient tones.",
    spec: {
      palette: ["#FAF7F2", "#E9563F", "#C29B68", "#1F2921"],
      elements: ["Multi-Size Organic Balloon Garland", "Chrome & Pastel Color Mix"],
      venue: "Clubhouse / Private Hall",
    },
  },
  {
    id: "asset-florals-toran",
    title: "Auspicious Fresh Marigold Garlands & Torans",
    category: "florals",
    categoryLabel: "Botanical Architecture",
    imagePath: "/portfolio/photo_flower_temple_toran.jpg",
    photographer: "Siddhesh Mangore",
    sourceUrl: "https://unsplash.com/photos/1607190074257",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Ceremonial strands of auspicious fresh yellow and orange marigolds with door torans",
    description: "Traditional festive decor featuring dense strings of fresh yellow and orange marigolds, fragrant jasmine latkans, green mango leaf door torans, and brass urli flower floating arrangements.",
    spec: {
      palette: ["#286548", "#E5AC32", "#FAF7F2", "#1F2921"],
      elements: ["Fresh Marigold Latkans", "Mango Leaf Door Toran", "Brass Urli Floral Displays", "Ceremonial Stage Garlands"],
      venue: "Temple Hall / Traditional Courtyard",
    },
  },
  {
    id: "asset-florals-haldi",
    title: "Haldi Ceremonial Pavilion & Drapery",
    category: "florals",
    categoryLabel: "Botanical Architecture",
    imagePath: "/portfolio/photo_haldi_ceremony.jpg",
    photographer: "Karan Somani",
    sourceUrl: "https://unsplash.com/photos/80b456fea0bc",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1068, aspectRatio: "3/2" },
    caption: "Vibrant yellow ceremonial tent canopy styled with marigold latkans and brass urli bowls",
    description: "Vibrant yellow fabric tent canopy styled with marigold latkans, floral background curtains, brass urlis with flower petals, and festive wooden ceremonial seating.",
    spec: {
      palette: ["#E5AC32", "#286548", "#FAF7F2"],
      elements: ["Yellow Drapery Tent", "Fresh Marigold Garlands", "Flower-Filled Brass Urlis", "Ceremonial Low Seating"],
      venue: "Terrace / Courtyard / Banquet Hall",
    },
  },
  {
    id: "asset-spatial-arch",
    title: "Grand Entrance Celebration Archway",
    category: "spatial",
    categoryLabel: "Ambient Illumination",
    imagePath: "/portfolio/photo_balloon_entrance_arch.jpg",
    photographer: "Rohan Makhecha",
    sourceUrl: "https://unsplash.com/photos/4698179dc6ce",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Asymmetrical organic celebration garland entrance archway in marigold, coral, and pearl tones",
    description: "Statement party entryway arch constructed with multi-sized organic balloon clusters in golden marigold, coral, and pearl tones, anchored with non-marking weighted bases.",
    spec: {
      palette: ["#C29B68", "#1F2921", "#FAF7F2"],
      elements: ["High-Density Organic Arch", "Chrome & Matte Color Mixing", "Free-Standing Framework", "Entrance Focal Styling"],
      venue: "Banquet Foyer / Entrance Portal",
    },
  },
  {
    id: "asset-spatial-dinner",
    title: "Evening Canopy Dining & Fairy Lights",
    category: "spatial",
    categoryLabel: "Ambient Illumination",
    imagePath: "/portfolio/photo_dinner_canopy_evening.jpg",
    photographer: "Thomas William",
    sourceUrl: "https://unsplash.com/photos/1511795409834",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1800, height: 1200, aspectRatio: "3/2" },
    caption: "Warm evening canopy dining arrangement with fairy light swags and fine table decor",
    description: "Atmospheric evening dinner setup featuring suspended gossamer fabric swags, warm fairy lights, floral runner centerpieces, and intimate mood lighting.",
    spec: {
      palette: ["#1F2921", "#C29B68", "#FAF7F2"],
      elements: ["Suspended Fabric Swags", "Micro-Fairy Light Canopy", "Linen Tablescape", "Taper Candle Staging"],
      venue: "Private Garden / Open-Air Pavilion",
    },
  },
  {
    id: "asset-spatial-reception",
    title: "Illuminated Banquet Reception Canopy",
    category: "spatial",
    categoryLabel: "Ambient Illumination",
    imagePath: "/portfolio/photo_reception_stage_evening.jpg",
    photographer: "Al Elmes",
    sourceUrl: "https://unsplash.com/photos/1464366400600",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Warm outdoor evening reception setting featuring long banquet tables illuminated under hanging festive lights",
    description: "Warm outdoor reception dinner setup with banquet tables, fine glassware, rustic timber accents, and canopy fairy illumination.",
    spec: {
      palette: ["#1F2921", "#C29B68", "#FAF7F2"],
      elements: ["Warm Hanging Festive Lights", "Timber Dining Tables", "Glassware Setting", "Ambient Staging"],
      venue: "Estate Lawn / Vineyard / Garden Courtyard",
    },
  },
];
