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
    title: "Traditional Sacred Mandap",
    shortDesc: "Four-pillar ceremonial canopy with cascading white blossoms, golden drapery, and candlelit aisle.",
    imagePath: "/portfolio/photo_wedding_mandap_grand.jpg",
    photographer: "Photos Hobby",
    desktopHeight: 540,
    route: "/decorations#ceremonies",
  },
  {
    id: "acc-milestone",
    index: "02",
    category: "Milestones",
    title: "Banquet Celebration & Toast",
    shortDesc: "Guests raising a toast at an illuminated evening dining table under warm fairy lights.",
    imagePath: "/portfolio/photo_milestone_celebration.jpg",
    photographer: "Alasdair Elmes",
    desktopHeight: 500,
    route: "/decorations#milestones",
  },
  {
    id: "acc-canopy",
    index: "03",
    category: "Ceremonies",
    title: "Open-Air Ceremony Canopy",
    shortDesc: "Outdoor garden ceremony setting with flowing ivory fabric drapery, botanical swags, and signing table.",
    imagePath: "/portfolio/photo_hero_ceremony_venue.jpg",
    photographer: "Matthew",
    desktopHeight: 530,
    route: "/decorations#ceremonies",
  },
  {
    id: "acc-table",
    index: "04",
    category: "Florals",
    title: "Wildflower Table Arrangement",
    shortDesc: "Long reception dining table styled with garden wildflowers, glassware, and linen napkins.",
    imagePath: "/portfolio/photo_floral_mandap_canopy.jpg",
    photographer: "Tom Pumford",
    desktopHeight: 490,
    route: "/decorations#florals",
  },
  {
    id: "acc-toran",
    index: "05",
    category: "Florals",
    title: "Temple Torans & Marigold Garlands",
    shortDesc: "Auspicious golden marigold garlands and white jasmine cascades suspended in natural light.",
    imagePath: "/portfolio/photo_flower_temple_toran.jpg",
    photographer: "Sangram Rakate",
    desktopHeight: 520,
    route: "/decorations#florals",
  },
  {
    id: "acc-haldi",
    index: "06",
    category: "Milestones",
    title: "Poolside Celebration & Send-Off",
    shortDesc: "Poolside terrace gathering with ceremonial balloon send-off.",
    imagePath: "/portfolio/photo_haldi_ceremony.jpg",
    photographer: "Álvaro CvG",
    desktopHeight: 510,
    route: "/decorations#milestones",
  },
  {
    id: "acc-reception",
    index: "07",
    category: "Ambient",
    title: "Evening Canopy Dining",
    shortDesc: "Dining tables arranged beneath mature trees with warm suspended fairy lights and candle glow.",
    imagePath: "/portfolio/photo_dinner_canopy_evening.jpg",
    photographer: "Matthew Buchanan",
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
    title: "Open-Air Ceremony Canopy",
    category: "weddings",
    categoryLabel: "Ceremonial Pavilions",
    imagePath: "/portfolio/photo_hero_ceremony_venue.jpg",
    photographer: "Matthew",
    sourceUrl: "https://unsplash.com/photos/1737236119003-b9ff5b2b5c16",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 985, aspectRatio: "16/10" },
    caption: "Outdoor garden ceremony setting with flowing ivory fabric drapery, botanical swags, and signing table",
    description: "Garden ceremony canopy framed with flowing white drapes, lush foliage arrangements, and an elegant white ceremony table on a lawn.",
    spec: {
      palette: ["#FAF7F2", "#2E3D31", "#C29B68"],
      elements: ["White Fabric Drapery", "Botanical Swags", "Ceremony Table", "Garden Lawn"],
      venue: "Garden Courtyard / Estate Lawn",
    },
  },
  {
    id: "asset-wed-canopy",
    title: "Spring Table Floral Setting",
    category: "florals",
    categoryLabel: "Living Botanicals",
    imagePath: "/portfolio/photo_floral_mandap_canopy.jpg",
    photographer: "Tom Pumford",
    sourceUrl: "https://unsplash.com/photos/1519225421980-715cb0215aed",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Long reception dining table styled with garden wildflowers, glassware, and linen napkins",
    description: "Intimate reception tablescape styled with glass bottle wildflower centerpieces, soft linen runners, and gingham napkin accents.",
    spec: {
      palette: ["#FAF7F2", "#1F2921", "#C29B68"],
      elements: ["Wildflower Bottle Arrangements", "Gingham Napkin Accents", "Glassware Setting", "Linen Runners"],
      venue: "Rustic Hall / Country Barn",
    },
  },
  {
    id: "asset-milestone-festive",
    title: "Banquet Celebration & Toast",
    category: "milestones",
    categoryLabel: "Milestone Staging",
    imagePath: "/portfolio/photo_milestone_celebration.jpg",
    photographer: "Alasdair Elmes",
    sourceUrl: "https://unsplash.com/photos/1511285560929-80b456fea0bc",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Guests raising a toast at an illuminated evening dining table under warm fairy lights",
    description: "Atmospheric dinner celebration featuring guests toasting with champagne glasses against warm bokeh fairy lights and table arrangements.",
    spec: {
      palette: ["#FAF7F2", "#1F2921", "#C29B68"],
      elements: ["Evening Banquet Seating", "Fairy Light Canopies", "Table Floral Accents"],
      venue: "Historic Hall / Dining Pavilion",
    },
  },
  {
    id: "asset-milestone-pastel",
    title: "Celebration Helium Balloons",
    category: "milestones",
    categoryLabel: "Milestone Staging",
    imagePath: "/portfolio/photo_birthday_pastel_ring.jpg",
    photographer: "Adi Goldstein",
    sourceUrl: "https://unsplash.com/photos/1530103862676-de8c9debad1d",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Vibrant ceiling helium balloons with hanging ribbons for festive celebrations",
    description: "Celebratory cluster of colorful ceiling helium balloons with long satin ribbons creating an energetic party atmosphere.",
    spec: {
      palette: ["#FAF7F2", "#E9563F", "#C29B68", "#1F2921"],
      elements: ["Ceiling Helium Balloon Cluster", "Satin Ribbons", "Vibrant Color Palette"],
      venue: "Party Room / Event Space",
    },
  },
  {
    id: "asset-florals-toran",
    title: "Temple Torans & Marigold Garlands",
    category: "florals",
    categoryLabel: "Living Botanicals",
    imagePath: "/portfolio/photo_flower_temple_toran.jpg",
    photographer: "Sangram Rakate",
    sourceUrl: "https://unsplash.com/photos/1789971649660-eefc756ee5dd",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    caption: "Auspicious golden marigold garlands and white jasmine cascades suspended in natural light",
    description: "Traditional auspicious floral torans crafted with dense golden marigold strings and delicate white jasmine tassels.",
    spec: {
      palette: ["#E5AC32", "#FAF7F2", "#286548"],
      elements: ["Fresh Golden Marigold Garlands", "White Jasmine Tassels", "Natural Foliage Framing"],
      venue: "Entrance Foyer / Courtyard Veranda",
    },
  },
  {
    id: "asset-florals-haldi",
    title: "Poolside Celebration & Send-Off",
    category: "milestones",
    categoryLabel: "Milestone Staging",
    imagePath: "/portfolio/photo_haldi_ceremony.jpg",
    photographer: "Álvaro CvG",
    sourceUrl: "https://unsplash.com/photos/1519741497674-611481863552",
    license: "Unsplash License (Free commercial & personal use)",
    dimensions: { width: 1600, height: 1068, aspectRatio: "3/2" },
    caption: "Poolside terrace gathering with ceremonial balloon send-off",
    description: "Celebratory poolside gathering with lanterns and guests participating in a white and red balloon release.",
    spec: {
      palette: ["#FAF7F2", "#1F2921", "#E9563F"],
      elements: ["Poolside Lantern Staging", "Balloon Release Accents", "Outdoor Gathering Area"],
      venue: "Poolside Terrace / Estate Lawn",
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
