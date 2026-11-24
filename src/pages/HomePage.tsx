import React from 'react';
import { IntroOverlay } from '../components/IntroOverlay';
import { WeddingHero } from '../components/WeddingHero';
import { PhotoAccordion } from '../components/PhotoAccordion';
import { ScrollTransformation } from '../components/ScrollTransformation';
import { ClosingEnquiry } from '../components/ClosingEnquiry';

export const HomePage: React.FC = () => {
  return (
    <>
      {/* 4-Second Grand-Entry Intro Overlay (Plays on Fresh Visit / Page Refresh) */}
      <IntroOverlay />

      <main id="main-content" className="home-main">
        {/* 1. Compact Hero with Real Wide Venue Photo & Actions */}
        <WeddingHero />

        {/* 2. Unified Seven-Item Expanding / Tap-to-Expand Themes Accordion */}
        <PhotoAccordion showExploreLink={true} />

        {/* 3. Full Scroll-Controlled Transformation Story */}
        <ScrollTransformation />

        {/* 4. Direct Developer Inquiry CTA */}
        <ClosingEnquiry />
      </main>
    </>
  );
};

export default HomePage;
