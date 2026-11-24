/**
 * Asset Manifest and Source Metadata
 * 
 * Curated high-resolution celebration decor portfolio for Colors Events & Entertainment
 * (Kukatpally, Hyderabad), combining authentic local venue setups and high-definition
 * celebration design references across the four core themes:
 * - Birthday Decorations
 * - Wedding Decorations
 * - Balloon Decorations
 * - Flower Decorations
 */

export interface PortfolioAsset {
  id: string;
  title: string;
  category: 'birthday' | 'wedding' | 'balloons' | 'flowers';
  categoryLabel: string;
  status: 'verified_maps_photo' | 'curated_portfolio_photo';
  statusLabel: string;
  badgeLabel: string;
  imagePath: string;
  sourceUrl?: string;
  provenance: string;
  legalNotice: string;
  dimensions: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  description: string;
  spec: {
    palette: string[];
    decorElements: string[];
    recommendedVenue: string;
  };
}

export const ASSETS_MANIFEST: PortfolioAsset[] = [
  // =========================================================================
  // CHAPTER 01: BIRTHDAY DECORATIONS
  // =========================================================================
  {
    id: "decor-bday-pastel-ring",
    title: "Pastel Balloon Ring & Cake Plinth Staging",
    category: "birthday",
    categoryLabel: "Milestone Birthday",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Milestone Styling",
    imagePath: "/portfolio/photo_birthday_pastel_ring.jpg",
    provenance: "High-resolution celebration photography illustrating modern pastel ring arches, multi-tier balloon clusters, and cake plinth pedestals.",
    legalNotice: "High-definition celebration decor showcase matching Kukatpally apartment clubhouses and birthday party halls.",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    description: "Modern organic balloon ring setup featuring soft coral, blush, ivory, and champagne chrome accents, paired with cylindrical cake plinths and warm ambient backlighting.",
    spec: {
      palette: ["#ED654C", "#FFF8EE", "#E5AC32", "#FFFFFF"],
      decorElements: ["Round Metallic Frame", "Multi-Size Organic Balloon Garland", "Acrylic Cake Pedestals", "Warm LED Sign Glow"],
      recommendedVenue: "Clubhouse / Party Hall, Kukatpally",
    },
  },
  {
    id: "decor-bday-safari-stage",
    title: "1st Birthday Safari Stage with 3D Animal Props",
    category: "birthday",
    categoryLabel: "Milestone Birthday",
    status: "verified_maps_photo",
    statusLabel: "Verified Kukatpally Setup",
    badgeLabel: "Kukatpally Venue Setup",
    imagePath: "/portfolio/maps_photo_stage_2.jpg",
    sourceUrl: "https://www.google.com/maps/place/Colors+Events+%26+Entertainment/@17.5034253,78.4039148,3a,75y/data=!3m8!1e2!3m6!1sCIABIhCjjwr3E528bMKygOHeh2qL!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9QcorFGxEnx7KhqDtlYpuk3LEhYood0gcuorGriOGsqQf4L0sh_3icp2dvsNS3ieyi_69HvyjC7he7u8w49hoxsEVyJCiYaUEWz9tGV-56v6nqMjcHxczs_8vA5nxzN7AHtmLDAhNWhqT98%3Dw657-h298-k-no!7i1600!8i725!4m9!3m8!1s0x3bcb9163e430fd79:0x4611ced020726bcf!8m2!3d17.5034253!4d78.4039148!10e5!14m1!1BCgIgAQ!16s%2Fg%2F11l6yr5f2c",
    provenance: "Authentic Google Maps Listing Photography from Colors Events & Entertainment, Kukatpally.",
    legalNotice: "Verified business installation showcasing jungle safari 1st birthday milestone stage execution in Kukatpally.",
    dimensions: { width: 1600, height: 725, aspectRatio: "16/7" },
    description: "Grand 1st birthday safari celebration stage featuring 3D life-sized animal props (Giraffe, Elephant, Zebra, Lion), illuminated marquee letters, multi-color balloon garland borders, and ceiling swags.",
    spec: {
      palette: ["#ED654C", "#E5AC32", "#2F7A4F", "#FFF8EE"],
      decorElements: ["3D Safari Animal Cutouts", "Illuminated Marquee Letters", "Multi-Tier Balloon Stage Border", "Fabric Swag Ceiling"],
      recommendedVenue: "Banquet Hall, Kukatpally / Shamshiguda",
    },
  },
  {
    id: "decor-bday-cradle-ring",
    title: "Personalized Milestone Ring & Balloon Halo",
    category: "birthday",
    categoryLabel: "Milestone Birthday",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Milestone Styling",
    imagePath: "/portfolio/photo_baby_cradle_decor.jpg",
    provenance: "High-resolution celebration photography illustrating floral balloon rings for cradle ceremonies and milestone celebrations.",
    legalNotice: "High-definition decor showcase matching intimate apartment ceremonies.",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    description: "Intimate celebration ring decorated with organic pastel balloon groupings, delicate faux blossom accents, and customizable family name backdrop disc.",
    spec: {
      palette: ["#FFF8EE", "#ED654C", "#E5AC32"],
      decorElements: ["Circular Arch Structure", "Double-Stuffed Pastel Balloons", "Botanical Floral Accents", "Name Plaque Disc"],
      recommendedVenue: "Home Living Room / Terrace, Tulasi Nagar",
    },
  },
  {
    id: "decor-bday-kids-party",
    title: "Vibrant Thematic Birthday Arch & Props",
    category: "birthday",
    categoryLabel: "Kids Birthday",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Thematic Staging",
    imagePath: "/portfolio/photo_kids_birthday.jpg",
    provenance: "High-resolution celebration photography showing energetic multi-tone party styling.",
    legalNotice: "High-definition celebration reference photography.",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "High-energy kids birthday celebration setup featuring multi-colored balloon arches, celebratory bunting, and themed photo focal stations.",
    spec: {
      palette: ["#ED654C", "#E5AC32", "#2F7A4F", "#244AD3"],
      decorElements: ["Multi-tone Balloon Clusters", "Festive Floor Bunting", "Number Milestone Box", "Entrance Arch"],
      recommendedVenue: "Gated Community Clubhouse, Kukatpally",
    },
  },

  // =========================================================================
  // CHAPTER 02: WEDDING DECORATIONS
  // =========================================================================
  {
    id: "decor-wed-grand-mandap",
    title: "Grand Indian Wedding Stage & Traditional Floral Mandap",
    category: "wedding",
    categoryLabel: "Wedding Ceremony",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Grand Ceremony Mandap",
    imagePath: "/portfolio/photo_wedding_mandap_grand.jpg",
    provenance: "High-resolution celebration photography featuring grand traditional Indian wedding stage styling with authentic marigold flowers and ceremonial mandap.",
    legalNotice: "High-definition traditional wedding decor showcase matching marriage halls across Kukatpally and Hyderabad.",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    description: "Spectacular traditional Indian wedding mandap adorned with fresh golden marigold and jasmine garlands, rich royal silk fabric drapery, brass ceremonial lamps, and regal bride & groom seating.",
    spec: {
      palette: ["#244AD3", "#E5AC32", "#FFF8EE", "#ED654C"],
      decorElements: ["Four-Pillar Mandap Structure", "Fresh Marigold & Jasmine Hangings", "Silk Backdrop Drapery", "Brass Diya & Urli Staging"],
      recommendedVenue: "Convention Center / Kalyana Mandapam, Kukatpally",
    },
  },
  {
    id: "decor-wed-floral-canopy",
    title: "Ceremony Mandap Canopy with Cascading White & Gold Florals",
    category: "wedding",
    categoryLabel: "Wedding Ceremony",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Cascading Mandap",
    imagePath: "/portfolio/photo_floral_mandap_canopy.jpg",
    provenance: "High-resolution wedding photography showing ceremonial mandap pillars and cascading floral canopy.",
    legalNotice: "High-definition wedding decor reference photography matching traditional rituals.",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    description: "Four-pillar ceremony mandap decorated with dense white blossom cascades, golden fabric swags, and welcoming entrance aisle walkway.",
    spec: {
      palette: ["#244AD3", "#FFF8EE", "#E5AC32"],
      decorElements: ["Mandap Pillar Framework", "Cascading Floral Garlands", "Ceremonial Seating Dais", "Aisle Walkway Pillars"],
      recommendedVenue: "Community Hall / Temple Premises, Kukatpally",
    },
  },
  {
    id: "decor-wed-reception-stage",
    title: "Evening Reception Stage with Floral Arch & Warm Lighting",
    category: "wedding",
    categoryLabel: "Reception Staging",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Reception Staging",
    imagePath: "/portfolio/photo_reception_stage_evening.jpg",
    provenance: "High-resolution stage photography showing evening reception stage lighting and floral backdrop arches.",
    legalNotice: "High-definition evening decor reference photography matching local banquet halls.",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    description: "Warm ambient reception stage with pleated fabric backdrop, grand floral archway, couple stage sofa, and warm floodlighting.",
    spec: {
      palette: ["#244AD3", "#E5AC32", "#FFF8EE"],
      decorElements: ["Warm Stage Floodlights", "Pleated Velvet Drapery", "Floral Side Pedestals", "Couple Stage Chairs"],
      recommendedVenue: "Party Hall / Reception Venue, Kukatpally",
    },
  },
  {
    id: "decor-wed-maps-stage",
    title: "Panoramic Celebration Dais & Backdrop",
    category: "wedding",
    categoryLabel: "Stage & Ceremony",
    status: "verified_maps_photo",
    statusLabel: "Verified Kukatpally Setup",
    badgeLabel: "Kukatpally Venue Setup",
    imagePath: "/portfolio/maps_photo_1.jpg",
    sourceUrl: "https://www.google.com/maps/place/Colors+Events+%26+Entertainment/@17.5034253,78.4039148,3a,75y/data=!3m8!1e2!3m6!1sCIABIhCjjwr3E528bMKygOHeh2qL!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9QcorFGxEnx7KhqDtlYpuk3LEhYood0gcuorGriOGsqQf4L0sh_3icp2dvsNS3ieyi_69HvyjC7he7u8w49hoxsEVyJCiYaUEWz9tGV-56v6nqMjcHxczs_8vA5nxzN7AHtmLDAhNWhqT98%3Dw657-h298-k-no!7i1600!8i725!4m9!3m8!1s0x3bcb9163e430fd79:0x4611ced020726bcf!8m2!3d17.5034253!4d78.4039148!10e5!14m1!1BCgIgAQ!16s%2Fg%2F11l6yr5f2c",
    provenance: "Authentic Google Maps Listing Photography from Colors Events & Entertainment, Kukatpally.",
    legalNotice: "Claimed business photography uploaded to official Google Maps listing.",
    dimensions: { width: 1200, height: 544, aspectRatio: "16/7" },
    description: "Wide panoramic view of high-impact celebration stage decoration with saturated color coordination, thematic props, and ceremonial entrance styling.",
    spec: {
      palette: ["#244AD3", "#E5AC32", "#ED654C", "#FFF8EE"],
      decorElements: ["Wide Stage Drape Waves", "Curated Arch Elements", "Ceremonial Dais Framing", "Accent Lighting"],
      recommendedVenue: "Community Hall, Mahankali Nagar / Kukatpally",
    },
  },

  // =========================================================================
  // CHAPTER 03: BALLOON DECORATIONS
  // =========================================================================
  {
    id: "decor-balloon-entrance-arch",
    title: "Grand Entrance Organic Balloon Garland Archway",
    category: "balloons",
    categoryLabel: "Balloon Styling",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Organic Balloon Arch",
    imagePath: "/portfolio/photo_balloon_entrance_arch.jpg",
    provenance: "High-resolution celebration photography showing high-density organic balloon garland installations for entrances and celebratory stages.",
    legalNotice: "High-definition balloon installation showcase matching Hyderabad party venues.",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    description: "Statement party entryway arch constructed with multi-sized organic balloon clusters in golden marigold, coral, and pearl tones, anchored with non-marking weighted bases.",
    spec: {
      palette: ["#E5AC32", "#ED654C", "#FFF8EE", "#211D24"],
      decorElements: ["High-Density Organic Arch", "Chrome & Matte Color Mixing", "Free-Standing Framework", "Entrance Focal Styling"],
      recommendedVenue: "Banquet Foyer / Home Entrance, Kukatpally",
    },
  },
  {
    id: "decor-balloon-garland-cascade",
    title: "High-Density Organic Balloon Cascade",
    category: "balloons",
    categoryLabel: "Balloon Styling",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Balloon Architecture",
    imagePath: "/portfolio/photo_balloon_garland.jpg",
    provenance: "High-resolution celebration photography showing organic balloon cascades.",
    legalNotice: "High-definition celebration reference photography.",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "Volumetric balloon cascade designed for backdrop framing, cake plinth side cascades, and photo booth staging.",
    spec: {
      palette: ["#E5AC32", "#ED654C", "#211D24"],
      decorElements: ["Double-Layer Balloon Garland", "Matte & Chrome Accents", "Rigid Arch Base", "Non-Damaging Ties"],
      recommendedVenue: "Home Entrance / Banquet Foyer, Mahankali Nagar",
    },
  },
  {
    id: "decor-balloon-entrance-portal",
    title: "Celebration Venue Entrance Balloon Portal",
    category: "balloons",
    categoryLabel: "Balloon Styling",
    status: "verified_maps_photo",
    statusLabel: "Verified Kukatpally Setup",
    badgeLabel: "Kukatpally Venue Setup",
    imagePath: "/portfolio/maps_balloon_entrance.jpg",
    provenance: "Colors Events & Entertainment venue setup records, Kukatpally.",
    legalNotice: "Verified business installation showcasing venue entrance framing.",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "Spiraling party entrance balloon portal guiding guests from hall entrance to main ceremonial stage.",
    spec: {
      palette: ["#E5AC32", "#ED654C", "#244AD3"],
      decorElements: ["Spiral Balloon Columns", "Connecting Overhead Arch", "Welcome Display Pedestal", "Floor Spotlights"],
      recommendedVenue: "Party Hall Entry, Kukatpally",
    },
  },

  // =========================================================================
  // CHAPTER 04: FLOWER DECORATIONS
  // =========================================================================
  {
    id: "decor-flower-temple-toran",
    title: "Traditional Fresh Marigold Strings & Auspicious Floral Decor",
    category: "flowers",
    categoryLabel: "Fresh Floral Styling",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Auspicious Fresh Florals",
    imagePath: "/portfolio/photo_flower_temple_toran.jpg",
    provenance: "High-resolution floral photography showing auspicious fresh marigolds, jasmine door garlands, and temple styling.",
    legalNotice: "High-definition floral decor showcase matching traditional rituals and ceremonies in Kukatpally.",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    description: "Auspicious traditional ceremonial decoration featuring dense strings of fresh yellow and orange marigolds, fragrant jasmine latkans, green mango leaf door torans, and brass urli flower floating arrangements.",
    spec: {
      palette: ["#2F7A4F", "#E5AC32", "#FFF8EE", "#ED654C"],
      decorElements: ["Fresh Marigold Latkans", "Mango Leaf Door Toran", "Brass Urli Floral Displays", "Ceremonial Stage Garlands"],
      recommendedVenue: "Ramalayam Temple vicinity / Private Residence, Kukatpally",
    },
  },
  {
    id: "decor-flower-haldi-canopy",
    title: "Haldi & Mehendi Yellow Fabric & Floral Canopy",
    category: "flowers",
    categoryLabel: "Ceremonial Florals",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Haldi & Mehendi Decor",
    imagePath: "/portfolio/photo_haldi_ceremony.jpg",
    provenance: "High-resolution ceremony photography showing Haldi and Mehendi festive floral and fabric setups.",
    legalNotice: "High-definition traditional ceremony reference photography.",
    dimensions: { width: 1600, height: 1067, aspectRatio: "3/2" },
    description: "Vibrant yellow fabric tent canopy styled with marigold latkans, floral background curtains, brass urlis with flower petals, and festive wooden ceremonial seating.",
    spec: {
      palette: ["#E5AC32", "#2F7A4F", "#FFF8EE"],
      decorElements: ["Yellow Drapery Tent", "Fresh Marigold Garlands", "Flower-Filled Brass Urlis", "Ceremonial Low Seating"],
      recommendedVenue: "Terrace / Courtyard / Banquet, Kukatpally",
    },
  },
  {
    id: "decor-flower-marigold-strings",
    title: "Traditional Doorway Toran & Urli Arrangements",
    category: "flowers",
    categoryLabel: "Fresh Floral Styling",
    status: "curated_portfolio_photo",
    statusLabel: "Featured Staging",
    badgeLabel: "Traditional Florals",
    imagePath: "/portfolio/photo_flower_marigold.jpg",
    provenance: "High-resolution floral photography showing fresh marigold strings and temple floral displays.",
    legalNotice: "High-definition floral decor reference photography.",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "Traditional doorway toran, stage floral hangings, and brass urli flower displays woven with fresh yellow and orange marigolds.",
    spec: {
      palette: ["#2F7A4F", "#E5AC32", "#FFF8EE"],
      decorElements: ["Fresh Marigold Latkans", "Mango Leaf Door Toran", "Brass Urli Floral Bowls", "Auspicious Stage Garlands"],
      recommendedVenue: "Home Entrance / Temple Hall, Kukatpally",
    },
  },
];
