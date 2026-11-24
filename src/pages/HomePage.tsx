import React from 'react';
import { IntroOverlay } from '../components/IntroOverlay';
import { WeddingHero } from '../components/WeddingHero';
import { ThemeTapAccordion } from '../components/ThemeTapAccordion';
import { HomeFeaturedPhotos } from '../components/HomeFeaturedPhotos';
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

        {/* 2. Four Collapsed Tap-to-Expand Theme Rows */}
        <ThemeTapAccordion />

        {/* 3. Three Full-Image Landscape Concept Plates */}
        <HomeFeaturedPhotos />

        {/* 4. Full Scroll-Controlled Transformation Story */}
        <ScrollTransformation />

        {/* 5. Direct Developer Inquiry CTA */}
        <ClosingEnquiry />
      </main>
    </>
  );
};

export default HomePage;
