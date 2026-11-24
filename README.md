# A3Y Celebrations — Event Studio Concept Demonstration

A calm, wedding-editorial celebration web application designed and engineered by **A3Y Solutions**. Built with React 18, TypeScript, Vite, native scroll-scrubbing controllers, and semantic responsive CSS.

> **Demonstration Notice:** This is a fictional event-studio website demonstrating A3Y Solutions' design, typography, and frontend engineering capabilities. It is not an operational events company or a commercial client project. Search indexing is disabled (`<meta name="robots" content="noindex, follow" />`).

---

## 1. Project Identity & Developer Contact

| Attribute | Value |
| :--- | :--- |
| **Concept Name** | A3Y Celebrations |
| **Creator** | A3Y Solutions |
| **Developer Contact** | **Yuvaraj** |
| **Direct Phone** | `+91 73374 22054` (`tel:+917337422054`) |
| **Inquiry Scope** | Contact A3Y about custom website design & web engineering |
| **Design Disciplines** | Sacred Ceremonies, Milestone Staging, Botanical Architecture, Ambient Illumination |

---

## 2. Visual System & Art Direction

- **Palette:** Warm ivory (`#FAF7F2`), deep forest green (`#1F2921`), restrained warm gold (`#C29B68`), and dark charcoal ink (`#181D19`).
- **Typography:** High-contrast display serif **Fraunces** paired with modern legible sans-serif **Plus Jakarta Sans**.
- **Header:** Slim 64px deep forest green header with brand wordmark, demo badge, compact navigation, and direct developer contact button.
- **Hero:** Scenic outdoor wedding ceremony aisle photograph with unhurried typography and clear calls to action.
- **Category Overview:** 4 distinct architectural disciplines with material palettes and specifications.
- **Editorial Split:** Asymmetric layout articulating studio design philosophy and reverent spatial staging.
- **Expanding Photo Accordion:** 7 tall desktop panels with staggered heights (490px–540px), vertical inactive labels, smooth 550ms horizontal expansion, prev/next buttons, and mobile swipeable card strip without mount-time page jump.
- **Immersive Photo Wall:** 9-tile asymmetrical mosaic with bounded pointer pan, gentle continuous drift, motion pause button, and accessible native HTML5 `<dialog>` lightbox.
- **Closing Enquiry Section:** Forest green closing card connecting visitors directly with developer Yuvaraj for web engineering inquiries.

---

## 3. Scroll-Controlled Wedding Transformation

- **Bounded Scrollytelling:** Native scroll-scrubbing stage contained within a dedicated 320vh story track that maps normalized scroll progress to video playback time (0.0s to 9.95s).
- **Single Source Resolution:** Selects `celebration-desktop.mp4` (1280×720) or `celebration-mobile.mp4` (768×432) based on viewport width to eliminate redundant bandwidth consumption.
- **Bidirectional Scrubbing:** Forward scrolling reveals staging progression; reverse scrolling scrubs backwards; pausing holds the exact frame.
- **Chapters & Timestamps:**
  - `0.0s`: **01 / The setting** — *"An open garden, ready for a new idea."*
  - `3.5s`: **02 / Floral styling** — *"An ivory floral arch frames the ceremony."*
  - `6.4s`: **03 / The details** — *"Tables, candlelight and aisle styling complete the setting."*
  - `9.9s`: **04 / The celebration** — *"Warm lighting brings the imagined evening together."*
- **Accessible Static Story Mode:** Quick toggle releasing the sticky stage to display all 4 chapters as responsive static photographic plates with full text. Automatically activates for `prefers-reduced-motion` and `Save-Data`.
- **Skip Animation:** Visible one-click button smoothly bypassing the animation to the next section.
- **Honest Labeling:** Prominent badge *"Illustrative concept animation. Not a completed A3Y event."*

---

## 4. Engineering Standards

- **Zero Layout Shifts on Load:** Initial mobile loads preserve vertical viewport position at top (`scrollY = 0`).
- **Accessible Navigation:** Complete keyboard focus management in mobile drawer, semantic headings, visible focus rings, native `<dialog>` light dismiss, and Enter/Space support on interactive cards.
- **Strict TypeScript:** 100% type-safe compilation with strict mode.
- **SPA Fallback Routing:** Supported rewrite configuration in `vercel.json` excluding assets and media while routing all client routes to `/index.html`.

---

## 5. Development & Build

```bash
# Install dependencies
npm install

# Start local development server (port 5173)
npm run dev

# Run TypeScript check and production build
npm run build

# Preview production build
npm run preview
```
