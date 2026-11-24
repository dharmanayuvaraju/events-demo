import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const EditorialSplit: React.FC = () => {
  return (
    <section className="section-editorial-split" aria-labelledby="editorial-split-heading">
      <div className="container">
        <div className="editorial-split-grid">
          {/* Column A: Editorial Framed Image */}
          <div className="editorial-image-col">
            <figure className="editorial-figure">
              <div className="editorial-img-frame">
                <img
                  src="/portfolio/photo_scenic_aisle_ceremony.jpg"
                  alt="Ceremonial outdoor wedding aisle flanked by warm wooden chairs and delicate botanical arrangements"
                  className="editorial-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="editorial-caption">
                <span className="caption-bold">Plate No. 05 &bull; Ceremonial Aisle</span>
                <span className="caption-sub">Open-air pavilion, natural linen, and hand-gathered botanical urns</span>
              </figcaption>
            </figure>
          </div>

          {/* Column B: Design Philosophy & High-Contrast Serif Display */}
          <div className="editorial-copy-col">
            <span className="section-label">Studio Philosophy</span>

            <blockquote className="editorial-quote">
              <p id="editorial-split-heading">
                &ldquo;Space transformed through architectural discipline, botanical movement, and intentional illumination.&rdquo;
              </p>
            </blockquote>

            <div className="editorial-prose">
              <p>
                At A3Y Celebrations, we believe wedding and event styling is not about accumulating synthetic props or transient novelties. It is the deliberate interplay of proportion, organic texture, and calibrated light.
              </p>
              <p>
                Every ceremonial mandap, reception stage, and banquet canopy is composed with reverence for the venue's natural character—creating tranquil, unhurried atmospheres where sacred vows and multi-generational gatherings unfold gracefully.
              </p>
            </div>

            <div className="editorial-actions">
              <Link to="/about" className="editorial-link-btn" aria-label="Read more about our design philosophy and technical architecture">
                <span>Read Studio Philosophy</span>
                <ArrowUpRight size={15} />
              </Link>
              <Link to="/gallery" className="editorial-link-subtle" aria-label="Browse the full visual lookbook">
                <span>Browse Full Lookbook</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
