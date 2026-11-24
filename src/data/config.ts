/**
 * A3Y Celebrations - Concept Demonstration Configuration
 * 
 * Fictional event-studio website demonstration created by A3Y Solutions
 * to showcase calm wedding-editorial design, typography, and frontend engineering.
 */

export interface DeveloperContact {
  name: string;
  role: string;
  phone: string;
  callHref: string;
  label: string;
  ctaText: string;
  note: string;
}

export interface DemoConfig {
  conceptName: string;
  conceptBadge: string;
  creator: string;
  tagline: string;
  disclaimer: string;
  footerNotice: string;
  developer: DeveloperContact;
}

export const A3Y_CONFIG: DemoConfig = {
  conceptName: "A3Y Celebrations",
  conceptBadge: "A3Y concept demo",
  creator: "A3Y Solutions",
  tagline: "Atmospheres crafted for life's quiet wonders and grand ceremonies.",
  disclaimer: "Fictional event-studio website demonstrating A3Y Solutions' editorial web design and frontend engineering capabilities. Not an operational events company or commercial client project.",
  footerNotice: "A fictional event-studio website demonstrating A3Y's design and development work.",
  developer: {
    name: "Yuvaraj",
    role: "Lead Designer & Full-Stack Developer",
    phone: "+91 73374 22054",
    callHref: "tel:+917337422054",
    label: "Contact A3Y about a website",
    ctaText: "Discuss a Web Project",
    note: "Available for bespoke website design, high-performance web applications, and digital editorial platforms.",
  },
};
