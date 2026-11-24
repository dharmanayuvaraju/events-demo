import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, ArrowDown } from 'lucide-react';
import { A3Y_CONFIG } from '../data/config';

export const WeddingHero: React.FC = () => {
  return (
    <section className="wedding-hero-section" aria-label="A3Y Celebrations Concept Introduction">
      <div className="container">
        <div className="wedding-hero-grid">
          {/* Text Content */}
          <div className="wedding-hero-copy">
            <div className="wedding-hero-meta">
              <span className="hero-concept-tag">
                <Sparkles size={13} className="hero-tag-icon" />
                <span>{A3Y_CONFIG.conceptBadge}</span>
              </span>
              <span className="hero-season-tag">Design Demonstration</span>
            </div>

            <h1 className="wedding-hero-title">
              Atmospheres for Meaningful Ceremonies
            </h1>

            <p className="wedding-hero-lead">
              An editorial portfolio demonstration by A3Y Solutions exploring celebration styling, decoration disciplines, and digital craft.
            </p>

            <div className="wedding-hero-actions">
              <Link
                to="/decorations"
                className="btn-primary"
                aria-label="Explore our four celebration themes and specifications"
              >
                <span>Explore Themes</span>
                <ArrowDown size={14} />
              </Link>

              <Link
                to="/contact"
                className="btn-secondary"
                aria-label="Contact A3Y about a web project or website design"
              >
                <span>Contact A3Y</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Complete Landscape Photograph in Normal Flow */}
          <div className="wedding-hero-media">
            <div className="wedding-hero-img-frame">
              <picture>
                <source
                  type="image/webp"
                  srcSet="/portfolio/photo_hero_ceremony_venue-320w.webp 320w, /portfolio/photo_hero_ceremony_venue-480w.webp 480w, /portfolio/photo_hero_ceremony_venue-768w.webp 768w, /portfolio/photo_hero_ceremony_venue-1200w.webp 1200w"
                  sizes="(max-width: 480px) 100vw, (max-width: 900px) 95vw, 680px"
                />
                <img
                  src="/portfolio/photo_hero_ceremony_venue.jpg"
                  alt="Outdoor garden wedding ceremony canopy with flowing white drapery and botanical arrangements on lawn"
                  className="wedding-hero-img"
                  loading="eager"
                  decoding="async"
                  width={1600}
                  height={1005}
                />
              </picture>
            </div>

            {/* Caption placed cleanly below image */}
            <p className="wedding-hero-caption">
              Outdoor garden ceremony canopy with flowing white drapery and botanical arrangements &bull; Photo by Matthew (Unsplash)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingHero;
