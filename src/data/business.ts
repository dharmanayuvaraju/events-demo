/**
 * Verified Facts and Content Rules for Colors Events & Entertainment
 * Location: Kukatpally, Hyderabad
 */

export interface BusinessConfig {
  name: string;
  phone: string;
  callHref: string;
  location: {
    address: string;
    landmark: string;
    suburb: string;
    city: string;
    state: string;
    pincode: string;
    fullText: string;
    mapsUrl: string;
    placeId: string;
  };
  reputation: {
    rating: number;
    reviewCount: number;
    verifiedDate: string;
    label: string;
    mapsLinkText: string;
  };
  supportedThemes: Array<{
    id: 'birthday' | 'wedding' | 'balloons' | 'flowers';
    name: string;
    tagline: string;
    summary: string;
  }>;
  channels: {
    whatsAppEnabled: boolean; // Kept disabled in configuration until confirmed by business
    whatsAppNotice: string;
    backendConnected: boolean; // Kept false: Honest inquiry flow without silent data storage
  };
  previewNotice: {
    isConceptPreview: boolean;
    bannerText: string;
    badgeText: string;
  };
}

export const BUSINESS_CONFIG: BusinessConfig = {
  name: "Colors Events & Entertainment",
  phone: "+91 81868 37404",
  callHref: "tel:+918186837404",
  location: {
    address: "Ramalayam Temple, HMT Road, Mahankali Nagar, Tulasi Nagar, Shamshiguda",
    landmark: "Ramalayam Temple",
    suburb: "Kukatpally",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500072",
    fullText: "Ramalayam Temple, HMT Road, Mahankali Nagar, Tulasi Nagar, Shamshiguda, Kukatpally, Hyderabad, Telangana 500072",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Colors+Events+%26+Entertainment&query_place_id=ChIJef0w5GORyzsRz2tyINDOEUY",
    placeId: "ChIJef0w5GORyzsRz2tyINDOEUY",
  },
  reputation: {
    rating: 4.6,
    reviewCount: 20,
    verifiedDate: "23 Nov 2026",
    label: "Google listing, checked 23 Nov 2026",
    mapsLinkText: "View verified listing on Google Maps",
  },
  supportedThemes: [
    {
      id: "birthday",
      name: "Birthday Decorations",
      tagline: "Stage backdrops, thematic balloon rings & cake table framing",
      summary: "Thoughtfully coordinated birthday setups for children's parties, first birthdays, and milestone anniversaries across Kukatpally.",
    },
    {
      id: "wedding",
      name: "Wedding Decorations",
      tagline: "Traditional mandap decor, ceremony backdrops & floral accents",
      summary: "Traditional fabric drapery, temple entrance styling, stage focal points, and haldi or reception decor designed to respect local customs.",
    },
    {
      id: "balloons",
      name: "Balloon Decorations",
      tagline: "Organic balloon arches, spiral garlands & statement photo rings",
      summary: "Color-coordinated balloon installations tailored to your venue dimensions with clean fastening and zero clutter.",
    },
    {
      id: "flowers",
      name: "Flower Decorations",
      tagline: "Fresh floral garlands, entrance arches & auspicious floral styling",
      summary: "Sourced fresh blooms for morning puja rituals, backdrop wreaths, and celebratory doorway floral hangings.",
    },
  ],
  channels: {
    whatsAppEnabled: false, // Locked until client signs off on official WhatsApp business line
    whatsAppNotice: "WhatsApp direct chat will be activated upon client launch sign-off.",
    backendConnected: false, // Generates honest copy/call review summary instead of mock API success
  },
  previewNotice: {
    isConceptPreview: true,
    bannerText: "Concept preview — Unapproved client draft for Colors Events & Entertainment. Verification pending.",
    badgeText: "Concept preview",
  },
};
