/**
 * Asset Manifest and Source Metadata
 * 
 * Includes authentic Google Maps listing photography from Colors Events & Entertainment
 * (Kukatpally, Hyderabad) and verified event decor portfolio records.
 */

export interface PortfolioAsset {
  id: string;
  title: string;
  category: 'birthday' | 'wedding' | 'balloons' | 'flowers';
  categoryLabel: string;
  status: 'verified_maps_photo' | 'curated_portfolio_photo';
  statusLabel: string;
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
  {
    id: "decor-maps-01",
    title: "Colors Events Celebration Stage Setup",
    category: "balloons",
    categoryLabel: "Balloon & Stage Decor",
    status: "verified_maps_photo",
    statusLabel: "Google Maps Listing Photo",
    imagePath: "/portfolio/maps_photo_stage_2.jpg",
    sourceUrl: "https://www.google.com/maps/place/Colors+Events+%26+Entertainment/@17.5034253,78.4039148,3a,75y/data=!3m8!1e2!3m6!1sCIABIhCjjwr3E528bMKygOHeh2qL!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9QcorFGxEnx7KhqDtlYpuk3LEhYood0gcuorGriOGsqQf4L0sh_3icp2dvsNS3ieyi_69HvyjC7he7u8w49hoxsEVyJCiYaUEWz9tGV-56v6nqMjcHxczs_8vA5nxzN7AHtmLDAhNWhqT98%3Dw657-h298-k-no!7i1600!8i725!4m9!3m8!1s0x3bcb9163e430fd79:0x4611ced020726bcf!8m2!3d17.5034253!4d78.4039148!10e5!14m1!1BCgIgAQ!16s%2Fg%2F11l6yr5f2c",
    provenance: "Extracted directly from Colors Events & Entertainment official Google Maps Profile (Kukatpally, Hyderabad)",
    legalNotice: "Claimed business photography uploaded to official Google Maps listing. Displayed with source attribution.",
    dimensions: { width: 1600, height: 725, aspectRatio: "16/7" },
    description: "Authentic event stage installation featuring dense multi-color balloon garland framing, overhead ceiling drapery, and ceremonial stage backdrops executed in Kukatpally.",
    spec: {
      palette: ["#ED654C", "#E5AC32", "#244AD3", "#FFF8EE"],
      decorElements: ["Multi-tone Balloon Clusters", "Fabric Stage Backdrop", "Overhead Ceiling Swags", "Stage Focal Ring"],
      recommendedVenue: "Banquet Hall / Party Hall, Kukatpally",
    },
  },
  {
    id: "decor-maps-02",
    title: "Panoramic Celebration Stage & Backdrop",
    category: "wedding",
    categoryLabel: "Stage & Ceremony Decor",
    status: "verified_maps_photo",
    statusLabel: "Google Maps Listing Photo",
    imagePath: "/portfolio/maps_photo_1.jpg",
    sourceUrl: "https://www.google.com/maps/place/Colors+Events+%26+Entertainment/@17.5034253,78.4039148,3a,75y/data=!3m8!1e2!3m6!1sCIABIhCjjwr3E528bMKygOHeh2qL!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgps-cs-s%2FANWiy9QcorFGxEnx7KhqDtlYpuk3LEhYood0gcuorGriOGsqQf4L0sh_3icp2dvsNS3ieyi_69HvyjC7he7u8w49hoxsEVyJCiYaUEWz9tGV-56v6nqMjcHxczs_8vA5nxzN7AHtmLDAhNWhqT98%3Dw657-h298-k-no!7i1600!8i725!4m9!3m8!1s0x3bcb9163e430fd79:0x4611ced020726bcf!8m2!3d17.5034253!4d78.4039148!10e5!14m1!1BCgIgAQ!16s%2Fg%2F11l6yr5f2c",
    provenance: "Extracted directly from Colors Events & Entertainment official Google Maps Profile (Kukatpally, Hyderabad)",
    legalNotice: "Claimed business photography uploaded to official Google Maps listing. Displayed with source attribution.",
    dimensions: { width: 1200, height: 544, aspectRatio: "16/7" },
    description: "Wide panoramic view of high-impact celebration stage decoration with saturated color coordination, thematic props, and ceremonial entrance styling.",
    spec: {
      palette: ["#244AD3", "#E5AC32", "#ED654C", "#FFF8EE"],
      decorElements: ["Wide Stage Drape Waves", "Curated Arch Elements", "Ceremonial Dais Framing", "Accent Lighting"],
      recommendedVenue: "Community Hall, Mahankali Nagar / Kukatpally",
    },
  },
  {
    id: "decor-photo-bday",
    title: "Pastel Balloon Arch & Cake Plinth Setup",
    category: "birthday",
    categoryLabel: "Birthday Decorations",
    status: "curated_portfolio_photo",
    statusLabel: "Decor Portfolio Showcase",
    imagePath: "/portfolio/photo_birthday_ring.jpg",
    provenance: "High-resolution celebration photography illustrating pastel ring arches, balloon clusters, and cake plinth staging",
    legalNotice: "High-definition event decor reference photography matching Kukatpally clubhouse party themes",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "Celebration birthday setup featuring organic pastel pink, coral, and white balloon garlands, modern cake cylinder plinths, and circular ring backdrop.",
    spec: {
      palette: ["#ED654C", "#FFF8EE", "#E5AC32"],
      decorElements: ["Round Metallic Frame", "Organic Balloon Clusters", "Acrylic Cake Pedestals", "Warm LED Ambient Glow"],
      recommendedVenue: "Apartment Clubhouse / Party Hall, Kukatpally",
    },
  },
  {
    id: "decor-photo-wedding",
    title: "Ceremonial Mandap & Floral Ceiling Canopy",
    category: "wedding",
    categoryLabel: "Wedding Decorations",
    status: "curated_portfolio_photo",
    statusLabel: "Decor Portfolio Showcase",
    imagePath: "/portfolio/photo_wedding_mandap.jpg",
    provenance: "High-resolution wedding celebration photography featuring ceremonial mandap pillars and cascading floral drapery",
    legalNotice: "High-definition wedding decor reference photography matching traditional rituals in Kukatpally",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "Four-pillar ceremony mandap decorated with fresh floral swags, draped royal fabrics, and welcoming entrance aisle styling.",
    spec: {
      palette: ["#244AD3", "#FFF8EE", "#E5AC32"],
      decorElements: ["Mandap Pillar Framework", "Cascading Floral Garlands", "Ceremonial Seating Dais", "Entrance Aisle Walkway"],
      recommendedVenue: "Community Hall / Temple Premises, Shamshiguda / Kukatpally",
    },
  },
  {
    id: "decor-photo-balloons",
    title: "High-Impact Organic Balloon Cluster Installation",
    category: "balloons",
    categoryLabel: "Balloon Decorations",
    status: "curated_portfolio_photo",
    statusLabel: "Decor Portfolio Showcase",
    imagePath: "/portfolio/photo_balloon_garland.jpg",
    provenance: "High-resolution celebration photography showing high-density organic balloon garlands and entrance styling",
    legalNotice: "High-definition balloon installation reference photography matching festive Hyderabad party palettes",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "Organic balloon styling tailored for welcoming party entryways, milestone anniversaries, and photo backdrop walls.",
    spec: {
      palette: ["#E5AC32", "#ED654C", "#211D24"],
      decorElements: ["Double-Layer Balloon Garland", "Matte & Chrome Accents", "Rigid Arch Base", "Non-Damaging Ties"],
      recommendedVenue: "Home Entrance / Banquet Foyer, Mahankali Nagar",
    },
  },
  {
    id: "decor-photo-flowers",
    title: "Traditional Fresh Marigold & Blossom Hangings",
    category: "flowers",
    categoryLabel: "Flower Decorations",
    status: "curated_portfolio_photo",
    statusLabel: "Decor Portfolio Showcase",
    imagePath: "/portfolio/photo_flower_marigold.jpg",
    provenance: "High-resolution floral photography showing auspicious fresh marigolds, jasmine door garlands, and temple styling",
    legalNotice: "High-definition floral decor reference photography matching morning ceremonies in Kukatpally",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "Traditional doorway toran, stage floral hangings, and brass urli flower displays woven with fresh yellow and orange marigolds.",
    spec: {
      palette: ["#2F7A4F", "#E5AC32", "#FFF8EE"],
      decorElements: ["Fresh Marigold Latkans", "Mango Leaf Door Toran", "Brass Urli Floral Bowls", "Ceremonial Stage Garlands"],
      recommendedVenue: "Ramalayam Temple vicinity / Private Residence, Kukatpally",
    },
  },
  {
    id: "decor-photo-stage",
    title: "Evening Celebration Stage & Ambient Warm Lighting",
    category: "wedding",
    categoryLabel: "Stage & Ceremony Decor",
    status: "curated_portfolio_photo",
    statusLabel: "Decor Portfolio Showcase",
    imagePath: "/portfolio/photo_stage_lighting.jpg",
    provenance: "High-resolution stage photography showing evening reception stage lighting and pleated drapery",
    legalNotice: "High-definition evening decor reference photography matching local banquet halls",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "Warm ambient stage lighting with pleated fabric backdrops, floral centerpieces, and intimate reception seating.",
    spec: {
      palette: ["#244AD3", "#E5AC32", "#FFF8EE"],
      decorElements: ["Warm Stage Floodlights", "Pleated Velvet Drapery", "Floral Side Pedestals", "Couple Stage Chairs"],
      recommendedVenue: "Party Hall / Reception Venue, Kukatpally",
    },
  },
  {
    id: "decor-photo-kids",
    title: "Vibrant Thematic Birthday Arch & Props",
    category: "birthday",
    categoryLabel: "Birthday Decorations",
    status: "curated_portfolio_photo",
    statusLabel: "Decor Portfolio Showcase",
    imagePath: "/portfolio/photo_kids_birthday.jpg",
    provenance: "High-resolution birthday photography showing colorful balloon bunting, character cutouts, and milestone number boxes",
    legalNotice: "High-definition kids celebration reference photography matching apartment clubhouses",
    dimensions: { width: 1200, height: 800, aspectRatio: "3/2" },
    description: "Energetic kids party decor featuring multi-colored balloon arches, celebratory bunting, and themed photo focal stations.",
    spec: {
      palette: ["#ED654C", "#E5AC32", "#2F7A4F"],
      decorElements: ["Multi-tone Balloon Clusters", "Theme Character Props", "Number Milestone Box", "Festive Floor Bunting"],
      recommendedVenue: "Clubhouse / Terrace, Kukatpally",
    },
  },
];
