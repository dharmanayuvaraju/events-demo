# Colors Events & Entertainment — Concept Preview & Production Build

A complete, responsive web application for **Colors Events & Entertainment**, Kukatpally, Hyderabad. Built with React 18, TypeScript, Vite, Three.js (React Three Fiber), GSAP ScrollTrigger, and custom responsive CSS.

> **Status:** Client Concept Preview Draft. Not yet authorized for public commercial search indexing (`<meta name="robots" content="noindex, nofollow" />`).

---

## 1. Verified Facts & Guardrails

| Attribute | Verified Value |
| :--- | :--- |
| **Business Name** | Colors Events & Entertainment |
| **Direct Phone** | `+91 81868 37404` (`tel:+918186837404`) |
| **Location** | Ramalayam Temple, HMT Road, Mahankali Nagar, Tulasi Nagar, Shamshiguda, Kukatpally, Hyderabad, Telangana 500072 |
| **Google Maps** | [Verified Google Maps Listing](https://www.google.com/maps/search/?api=1&query=Colors+Events+%26+Entertainment&query_place_id=ChIJef0w5GORyzsRz2tyINDOEUY) |
| **Google Rating** | 4.6 / 5.0 from 20 Google reviews checked 23 November 2026 |
| **Supported Scope** | Birthday decorations, wedding decorations, balloon decorations, flower decorations only |
| **Distinct Identity** | Independent Hyderabad business; unrelated to *colorsevents.in* (Odisha) |

---

## 2. Art Direction & Visual Reel System

- **Palette:** Warm Paper (`#FFF8EE`), Ink (`#211D24`), Cobalt (`#244AD3`), Coral (`#ED654C`), Marigold (`#E5AC32`), Leaf Green (`#2F7A4F`).
- **One Flat Color Per Chapter:** Hard-cut transitions (<180ms), slight 12px upward content drift, no crossfades or wipes.
- **Giant Chapter Typography:** Giant 18–22vw background words (`BIRTHDAY`, `WEDDING`, `BALLOONS`, `FLOWERS`) positioned with 8–12% contrast behind framed decor plates.
- **Word-by-Word Clip Reveal:** Italic editorial serif headings reveal via clip-mask translateY stagger.
- **Floating Framed Plate:** Subtle +/-8px bob animation with gentle pointer tilt on capable desktops.
- **Ticket Plan Card:** Pops in with scale 0.96 to 1 and links directly to pre-filtered celebration inquiry flow.
- **Outline Marquee Strip:** Infinite 25s loop pausing on `prefers-reduced-motion`.

---

## 3. Three.js Ceremonial Arch Sculpture

- Open ceremonial stage arch composed of thin celebration ribbons.
- Ribbon colors sync dynamically to the active chapter's color during hard cuts.
- **Zero CLS & Accessibility First:** Dual-mode architecture. Renders crisp CSS/SVG vector composition first.
- Dynamically lazy-loads WebGL only on capable desktop viewports (width >= 840px, WebGL available, no reduced-motion, no Save-Data).
- DPR capped at 1.5, low-power rendering, demand-driven frameloop (`frameloop="demand"`), pauses automatically when scrolled offscreen via `IntersectionObserver`.

---

## 4. Honest Inquiry Architecture

- Clean, accessible contact form with validation for name, Indian 10-digit phone, decoration theme, target date, and Hyderabad locality.
- **Zero Mock APIs:** Instead of faking server success, generates an on-screen, reviewable inquiry summary with **Copy Summary** and direct **Call Colors Events** actions.
- Transparently alerts user that no data has been transmitted across the network or stored in cookies.
- WhatsApp inquiries kept explicitly disabled in configuration until formal business registration is verified.

---

## 5. Measured Performance & Viewport Verification

Verified across 9 standard device viewports with zero horizontal overflow (`scrollWidth === clientWidth`):

| Viewport | Dimensions | Type | Horizontal Overflow | Verified Status |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile Compact** | 320 x 640 | Phone | 0px (`scrollWidth: 320`) | ✓ EXACT MATCH |
| **Mobile Standard** | 360 x 740 | Phone | 0px (`scrollWidth: 360`) | ✓ EXACT MATCH |
| **iPhone 14** | 390 x 844 | Phone | 0px (`scrollWidth: 390`) | ✓ EXACT MATCH |
| **Pixel / Galaxy** | 412 x 915 | Phone | 0px (`scrollWidth: 412`) | ✓ EXACT MATCH |
| **Tablet Portrait** | 768 x 1024 | Tablet | 0px (`scrollWidth: 768`) | ✓ EXACT MATCH |
| **Mobile Landscape** | 844 x 390 | Landscape | 0px (`scrollWidth: 844`) | ✓ EXACT MATCH |
| **Laptop** | 1440 x 900 | Desktop | 0px (`scrollWidth: 1425`*) | ✓ EXACT MATCH |
| **Desktop FHD** | 1920 x 1080 | Desktop | 0px (`scrollWidth: 1905`*) | ✓ EXACT MATCH |
| **Desktop QHD** | 2560 x 1440 | Desktop | 0px (`scrollWidth: 2545`*) | ✓ EXACT MATCH |

*\*Desktop `scrollWidth` accounts for native 15px browser vertical scrollbar (`1440 - 15 = 1425px`).*

### Measured Performance Vitals (Production Build)
- **First Contentful Paint (FCP):** 336 ms
- **DOMContentLoaded:** 77 ms
- **Load Event Duration:** 77 ms
- **Network Transfer Size:** 2.0 KB (HTML) + async chunks

---

## 6. Directory Structure

```
├── dist/                      # Production Vercel-ready distribution build
├── public/                    # Static assets
├── screenshots/               # Full viewport audit screenshots (320px to 2560px)
├── scripts/
│   ├── verify-all.cjs         # Automated headless Chrome viewport & vitals tester
│   └── verify.cjs             # Multi-route verification runner
├── src/
│   ├── components/
│   │   ├── ArchCanvas.tsx     # Lazy-loaded Three.js canvas & ribbons
│   │   ├── DecorArtwork.tsx   # Stylized SVG vector celebration plates
│   │   ├── Footer.tsx         # Accessible footer & verified listing card
│   │   ├── Header.tsx         # 320px-responsive header & navigation drawer
│   │   ├── InquiryForm.tsx    # Honest inquiry flow with review summary
│   │   ├── Lightbox.tsx       # Native <dialog> accessible modal lightbox
│   │   ├── MarqueeStrip.tsx   # 25s infinite outline marquee
│   │   ├── ReelHero.tsx       # Fast-cut color chapter slider
│   │   └── StageArchSculpture.tsx # Dual-layer SVG/Three.js backdrop
│   ├── data/
│   │   ├── assetsManifest.ts  # Portfolio metadata & permission registry
│   │   ├── business.ts        # Verified facts, phone, and maps configuration
│   │   ├── chapters.ts        # Chapter reel colors, copy, and scopes
│   │   └── launchChecklist.ts # Client launch blocker requirements
│   ├── pages/
│   │   ├── AboutPage.tsx      # Locality focus & launch blocker tracker
│   │   ├── ContactPage.tsx    # Direct call & honest inquiry planning
│   │   ├── DecorationsPage.tsx# Deep-dive on 4 core decoration themes
│   │   ├── GalleryPage.tsx    # Filterable gallery & accessible lightbox
│   │   └── HomePage.tsx       # Reel hero, marquee, process & location
│   ├── styles/
│   │   └── globals.css        # Custom responsive design system & fluid tokens
│   ├── App.tsx                # SPA routing & dynamic title synchronization
│   └── main.tsx               # React root mount
├── index.html                 # Viewport, Google fonts & noindex meta
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # Strict TypeScript configuration
├── vercel.json                # Direct route SPA rewrites
└── vite.config.ts             # Vite chunk splitting & production optimizations
```

---

## 7. Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run TypeScript checks & Vite build
npm run build

# Run preview server
npm run preview

# Run automated Chrome headless audit across all 9 viewports
node scripts/verify-all.cjs
```
