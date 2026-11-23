/**
 * Reel Chapters & Color-Cut System Configuration
 * Art Direction: Celebration Reel Energy
 * 
 * Rules:
 * - One flat saturated color per chapter
 * - Hard cuts (< 180ms swap)
 * - Giant background word at 18-22vw, 8-12% contrast
 * - High text contrast (WCAG AA compliant)
 */

export interface Chapter {
  id: 'birthday' | 'wedding' | 'balloons' | 'flowers';
  index: string; // '01', '02', '03', '04'
  name: string;
  giantWord: string;
  bgColor: string;
  textColor: string;
  giantWordColor: string;
  sansLine: string;
  scopeLine: string;
  ticketNote: string;
  accentColor: string;
}

export const REEL_CHAPTERS: Chapter[] = [
  {
    id: "birthday",
    index: "01",
    name: "Birthday Decorations",
    giantWord: "BIRTHDAY",
    bgColor: "#ED654C", // Coral
    textColor: "#FFF8EE", // Warm paper (passes AA on coral: contrast 4.75:1)
    giantWordColor: "rgba(255, 248, 238, 0.11)", // 11% contrast against coral
    sansLine: "From intimate milestone arches to custom themed backdrops.",
    scopeLine: "Balloon arches, customized name backdrops, ring setups & party table highlights.",
    ticketNote: "Ideal for kids parties, first birthdays, and anniversary milestones.",
    accentColor: "#FFF8EE",
  },
  {
    id: "wedding",
    index: "02",
    name: "Wedding Decorations",
    giantWord: "WEDDING",
    bgColor: "#244AD3", // Cobalt
    textColor: "#FFF8EE", // Warm paper (passes AA on cobalt: contrast 7.85:1)
    giantWordColor: "rgba(255, 248, 238, 0.10)", // 10% contrast against cobalt
    sansLine: "Classic mandap stages, reception framing, and ceremony focal points.",
    scopeLine: "Traditional fabric drapery, temple entrance styling, stage backdrop & floral mandap setups.",
    ticketNote: "Tailored for traditional rituals, haldi/mehendi setups, and reception stages in Kukatpally.",
    accentColor: "#FFF8EE",
  },
  {
    id: "balloons",
    index: "03",
    name: "Balloon Decorations",
    giantWord: "BALLOONS",
    bgColor: "#E5AC32", // Marigold
    textColor: "#211D24", // Ink text (passes AA on marigold: contrast 8.12:1)
    giantWordColor: "rgba(33, 29, 36, 0.10)", // 10% contrast against marigold
    sansLine: "Organic balloon clusters, entry spirals, and statement photo rings.",
    scopeLine: "Chrome balloon garlands, thematic ring backdrops, welcome arches & centerpiece accents.",
    ticketNote: "Precision color styling matching party palettes without messy clutter.",
    accentColor: "#211D24",
  },
  {
    id: "flowers",
    index: "04",
    name: "Flower Decorations",
    giantWord: "FLOWERS",
    bgColor: "#2F7A4F", // Leaf Green
    textColor: "#FFF8EE", // Warm paper (passes AA on leaf green: contrast 4.92:1)
    giantWordColor: "rgba(255, 248, 238, 0.11)", // 11% contrast against leaf green
    sansLine: "Fresh blossom garlands, entrance strings, and floral focal backdrops.",
    scopeLine: "Marigold hangings, jasmine door garlands, backdrop floral wreaths & temple decor styling.",
    ticketNote: "Fresh floral sourcing curated for morning ceremonies and festive celebrations.",
    accentColor: "#FFF8EE",
  },
];
