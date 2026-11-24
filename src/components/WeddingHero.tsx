import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Sparkles, ArrowUpRight } from 'lucide-react';
import { A3Y_CONFIG } from '../data/config';

export const WeddingHero: React.FC = () => {
  const scrollToAccordion = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('accordion-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="wedding-hero" aria-label="Scenic Wedding Editorial Hero">
      {/* Background Scenic Wedding Ceremony Photo with Calm Warm Dark Tint */}
      <div className="wedding-hero-bg-frame" aria-hidden="true">
        <img
          src="/portfolio/photo_scenic_aisle_ceremony.jpg"
          alt=""
          className="wedding-hero-bg-img"
          loading="eager"
          decoding="async"
        />
        <div className="wedding-hero-scrim" />
      </div>

      <div className="container wedding-hero-inner">
        {/* Editorial Sub-label */}
        <div className="wedding-hero-meta">
          <span className="hero-concept-tag">
            <Sparkles size={13} className="hero-tag-icon" />
            <span>{A3Y_CONFIG.conceptBadge}</span>
          </span>
          <span className="hero-season-tag">2026 Celebration Portfolio</span>
        </div>

        {/* Original Short Editorial Heading */}
        <h1 className="wedding-hero-title">
          Timeless atmospheres for unforgettable ceremonies.
        </h1>

        {/* Refined Subtitle */}
        <p className="wedding-hero-sub">
          Bespoke ceremonial mandaps, sculptural floral architecture, and intimate milestone staging conceived with unhurried poise.
        </p>

        {/* Clear Action Calls */}
        <div className="wedding-hero-actions">
          <a
            href="#accordion-section"
            onClick={scrollToAccordion}
            className="hero-btn-primary"
            aria-label="Scroll down to explore the ceremonial atmospheres collection"
          >
            <span>Explore the Collection</span>
            <ArrowDown size={15} />
          </a>

          <Link
            to="/contact"
            className="hero-btn-secondary"
            aria-label="Open interactive event planner and view contact options"
          >
            <span>Plan a Celebration</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Honest Image Caption & Photographer Credit */}
        <div className="wedding-hero-caption" aria-label="Hero photograph context">
          <span>Plate: Open-air ceremony aisle &amp; floral staging &bull; Curated for demo inspiration via Unsplash (Photo by Sandy Millar)</span>
        </div>
      </div>
    </section>
  );
};
