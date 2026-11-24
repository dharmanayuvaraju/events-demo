import React from 'react';
import { WeddingHero } from '../components/WeddingHero';
import { CategoryOverview } from '../components/CategoryOverview';
import { EditorialSplit } from '../components/EditorialSplit';
import { ScrollTransformation } from '../components/ScrollTransformation';
import { PhotoAccordion } from '../components/PhotoAccordion';
import { PhotoWall } from '../components/PhotoWall';
import { ClosingEnquiry } from '../components/ClosingEnquiry';

export const HomePage: React.FC = () => {
  return (
    <main id="main-content">
      {/* 1. Large Scenic Wedding-Photo Hero with Original Short Heading & Clear CTA */}
      <WeddingHero />

      {/* 2. Warm Ivory Event-Category Overview (4 Disciplines) */}
      <CategoryOverview />

      {/* 3. Editorial Split Image & Text Section with Studio Philosophy */}
      <EditorialSplit />

      {/* 4. Scroll-Controlled Wedding Transformation (Bounded Scrollytelling & Accessible Static Mode) */}
      <ScrollTransformation />

      {/* 5. Expanding Photo Accordion (7 Panels, Desktop Staggered Heights & Mobile Strip) */}
      <div id="accordion-section">
        <PhotoAccordion />
      </div>

      {/* 6. Immersive Photo-Wall Gallery (Asymmetrical Mosaic, Scrim Card, Pointer Pan & Lightbox) */}
      <PhotoWall />

      {/* 7. Green Closing Enquiry Section with Developer Contact */}
      <ClosingEnquiry />
    </main>
  );
};

export default HomePage;
