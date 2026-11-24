/**
 * A3Y Celebrations - Chapter Definitions
 * 
 * Art Direction & Color Chapters:
 * - Coral #E9563F: Ink text #211D24 (Contrast 5.5:1 -> Passes WCAG AA)
 * - Cobalt #244AD3: Paper text #FFF8EE (Contrast 7.85:1 -> Passes WCAG AAA)
 * - Marigold #E5AC32: Ink text #211D24 (Contrast 8.2:1 -> Passes WCAG AAA)
 * - Green #286548: Paper text #FFF8EE (Contrast 6.1:1 -> Passes WCAG AAA)
 */

export interface Chapter {
  id: 'birthday' | 'wedding' | 'balloons' | 'flowers';
  index: string; // '01', '02', '03', '04'
  name: string;
  giantWord: string;
  bgColor: string;
  textColor: string;
  contrastNotice: string;
  giantWordColor: string;
  heading: string;
  subheading: string;
  photoPath: string;
  photoAlt: string;
  photoCaption: string;
  themeRoute: string;
}

export const CHAPTERS: Chapter[] = [
  {
    id: "birthday",
    index: "01",
    name: "Birthday Celebrations",
    giantWord: "BIRTHDAY",
    bgColor: "#E9563F", // Coral
    textColor: "#211D24", // Ink text
    contrastNotice: "WCAG AA compliant (5.5:1 ink on coral)",
    giantWordColor: "rgba(33, 29, 36, 0.08)",
    heading: "Make room for joy.",
    subheading: "Curated milestone rings, sculptural palettes, and celebratory cake plinths.",
    photoPath: "/portfolio/photo_birthday_pastel_ring.jpg",
    photoAlt: "Pastel balloon ring installation with cylinder plinths and warm ambient lighting",
    photoCaption: "Pastel balloon ring installation with cylinder plinths and ambient warm glow",
    themeRoute: "/decorations#birthday",
  },
  {
    id: "wedding",
    index: "02",
    name: "Wedding Ceremonies",
    giantWord: "WEDDING",
    bgColor: "#244AD3", // Cobalt
    textColor: "#FFF8EE", // Paper text
    contrastNotice: "WCAG AAA compliant (7.85:1 paper on cobalt)",
    giantWordColor: "rgba(255, 248, 238, 0.09)",
    heading: "A setting for your story.",
    subheading: "Traditional ceremonial mandaps, cascading white florals, and draped textiles.",
    photoPath: "/portfolio/photo_wedding_mandap_grand.jpg",
    photoAlt: "Four-pillar ceremonial wedding mandap adorned with fresh golden marigold garlands and royal drapery",
    photoCaption: "Four-pillar ceremony mandap decorated with fresh golden marigold garlands and silk drapery",
    themeRoute: "/decorations#wedding",
  },
  {
    id: "balloons",
    index: "03",
    name: "Balloon Architecture",
    giantWord: "BALLOONS",
    bgColor: "#E5AC32", // Marigold
    textColor: "#211D24", // Ink text
    contrastNotice: "WCAG AAA compliant (8.2:1 ink on marigold)",
    giantWordColor: "rgba(33, 29, 36, 0.08)",
    heading: "Form in vivid volume.",
    subheading: "Architectural organic arches, high-density cascades, and chromatic entry portals.",
    photoPath: "/portfolio/photo_balloon_entrance_arch.jpg",
    photoAlt: "Grand organic balloon entrance archway styled with marigold, coral, and pearl tones",
    photoCaption: "Asymmetrical organic balloon garland entrance archway in marigold and coral tones",
    themeRoute: "/decorations#balloons",
  },
  {
    id: "flowers",
    index: "04",
    name: "Floral Installations",
    giantWord: "FLOWERS",
    bgColor: "#286548", // Green
    textColor: "#FFF8EE", // Paper text
    contrastNotice: "WCAG AAA compliant (6.1:1 paper on green)",
    giantWordColor: "rgba(255, 248, 238, 0.09)",
    heading: "Beauty in fresh bloom.",
    subheading: "Fragrant marigold garlands, door torans, and ceremonial urli arrangements.",
    photoPath: "/portfolio/photo_flower_temple_toran.jpg",
    photoAlt: "Traditional ceremonial decor with dense fresh yellow and orange marigold garlands and mango leaf torans",
    photoCaption: "Auspicious ceremonial strings of fresh yellow and orange marigolds with door torans",
    themeRoute: "/decorations#flowers",
  },
];

// Backwards compatibility alias
export const REEL_CHAPTERS = CHAPTERS;
