import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowUpRight } from 'lucide-react';
import { A3Y_CONFIG } from '../data/config';

export const HomeStoryPreview: React.FC = () => {
  return (
    <section className="section-story-preview" aria-label="Transformation Concept Story Preview">
      <div className="container">
        <div className="story-preview-card">
          <div className="story-preview-grid">
            {/* Left: Landscape Poster Preview (No video download or autoplay) */}
            <div className="story-preview-media">
              <picture>
                <source
                  media="(max-width: 640px)"
                  srcSet="/media/celebration/celebration-poster-mobile.jpg"
                />
                <img
                  src="/media/celebration/celebration-poster.jpg"
                  alt="Scenic garden wedding venue preview showing floral arch and evening banquet lighting"
                  className="story-preview-img"
                  loading="lazy"
                  decoding="async"
                  width={1280}
                  height={720}
                />
              </picture>
              
              <div className="story-preview-badge">
                <Film size={13} />
                <span>Scroll-Controlled Story</span>
              </div>
            </div>

            {/* Right: Short Story Description and Link */}
            <div className="story-preview-content">
              <div className="flex items-center gap-2 mb-2">
                <span className="header-demo-pill">{A3Y_CONFIG.conceptBadge}</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-leaf">
                  Interactive Story
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-3">
                From a Space to a Celebration
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-4">
                Watch how an open lawn evolves through four design stages: the initial setting, ceremonial floral styling, dining details, and ambient evening illumination.
              </p>

              <div className="story-preview-actions">
                <Link
                  to="/story"
                  className="btn-primary inline-flex items-center gap-2"
                  aria-label="Open the scroll-controlled celebration transformation story"
                >
                  <Film size={15} />
                  <span>Watch the Concept Story</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="mt-4 text-[11px] text-neutral-500 italic">
                Illustrative concept animation. Not a completed A3Y event.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeStoryPreview;
