import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowUpRight, Sparkles } from 'lucide-react';

export interface ThemeAccordionRow {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  imagePath: string;
  imageAlt: string;
  caption: string;
  photographer: string;
  route: string;
}

export const HOME_THEME_ROWS: ThemeAccordionRow[] = [
  {
    id: 'ceremonies',
    index: '01',
    title: 'Sacred Ceremonies & Mandaps',
    subtitle: 'Ceremonial Pavilions & Ritual Staging',
    imagePath: '/portfolio/photo_wedding_mandap_grand.jpg',
    imageAlt: 'Traditional sacred wedding mandap pavilion with cascading florals and chandelier',
    caption: 'Traditional four-pillar mandap with cascading floral canopies, chandelier, and golden drapes.',
    photographer: 'Photos Hobby (Unsplash)',
    route: '/decorations#ceremonies',
  },
  {
    id: 'milestones',
    index: '02',
    title: 'Milestone Celebrations & Receptions',
    subtitle: 'Intimate Stages & Banquets',
    imagePath: '/portfolio/photo_milestone_celebration.jpg',
    imageAlt: 'Guests toasting at illuminated evening banquet with fairy lights',
    caption: 'Atmospheric banquet seating with warm candlelight, table accents, and ambient bokeh lights.',
    photographer: 'Alasdair Elmes (Unsplash)',
    route: '/decorations#milestones',
  },
  {
    id: 'florals',
    index: '03',
    title: 'Botanical Architecture & Torans',
    subtitle: 'Living Botanicals & Floral Accents',
    imagePath: '/portfolio/photo_flower_temple_toran.jpg',
    imageAlt: 'Auspicious fresh marigold and jasmine garlands hanging as ceremonial torans',
    caption: 'Auspicious marigold garlands and white jasmine cascades suspended in natural light.',
    photographer: 'Sangram Rakate (Unsplash)',
    route: '/decorations#florals',
  },
  {
    id: 'ambient',
    index: '04',
    title: 'Ambient Illumination & Canopies',
    subtitle: 'Evening Canopies & Banquet Staging',
    imagePath: '/portfolio/photo_dinner_canopy_evening.jpg',
    imageAlt: 'Outdoor banquet dining table beneath trees strung with fairy lights',
    caption: 'Evening dining pergola spanning guest tables with warm fairy lights and hanging accents.',
    photographer: 'Matthew Buchanan (Unsplash)',
    route: '/decorations#ambient',
  },
];

interface ThemeTapAccordionProps {
  items?: ThemeAccordionRow[];
  initialOpenId?: string | null;
  allowMultiple?: boolean;
  showExploreAllLink?: boolean;
}

export const ThemeTapAccordion: React.FC<ThemeTapAccordionProps> = ({
  items = HOME_THEME_ROWS,
  initialOpenId = null,
  showExploreAllLink = true,
}) => {
  const [openId, setOpenId] = useState<string | null>(initialOpenId);

  const toggleRow = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="section-theme-accordion" aria-label="Celebration Themes Preview">
      <div className="container">
        {/* Section Header */}
        <div className="theme-accordion-header mb-6">
          <span className="section-label">Celebration Themes</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
            Four Design Disciplines
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
            Tap any theme below to preview its focal staging, material styling, and inspiration photo.
          </p>
        </div>

        {/* Vertical Tap-to-Expand Accordion List */}
        <div className="theme-tap-list" role="region" aria-label="Theme expansion list">
          {items.map((row) => {
            const isOpen = openId === row.id;
            const contentId = `theme-panel-${row.id}`;
            const headerId = `theme-header-${row.id}`;

            return (
              <div
                key={row.id}
                className={`theme-tap-card ${isOpen ? 'is-open' : 'is-collapsed'}`}
              >
                {/* 44px+ Accessible Tap Header Button */}
                <button
                  id={headerId}
                  type="button"
                  className="theme-tap-header-btn"
                  onClick={() => toggleRow(row.id)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                >
                  <span className="theme-tap-index">{row.index}</span>
                  <div className="theme-tap-title-wrap">
                    <span className="theme-tap-title">{row.title}</span>
                    <span className="theme-tap-subtitle">{row.subtitle}</span>
                  </div>
                  <span className={`theme-tap-chevron ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                    <ChevronDown size={18} />
                  </span>
                </button>

                {/* Animated Disclosure Panel */}
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={headerId}
                  className={`theme-tap-panel ${isOpen ? 'panel-expanded' : 'panel-collapsed'}`}
                >
                  <div className="theme-tap-panel-inner">
                    {/* Full-width image at natural intrinsic ratio */}
                    <div className="theme-tap-image-frame">
                      <img
                        src={row.imagePath}
                        alt={row.imageAlt}
                        className="theme-tap-img"
                        loading="lazy"
                        decoding="async"
                        width={1200}
                        height={800}
                      />
                    </div>

                    {/* Accurate Caption & Direct Theme Link */}
                    <div className="theme-tap-caption-row">
                      <p className="theme-tap-caption">
                        {row.caption} &bull; <span className="opacity-80">Photo by {row.photographer}</span>
                      </p>

                      <Link
                        to={row.route}
                        className="theme-tap-explore-link"
                        aria-label={`View full specifications for ${row.title}`}
                      >
                        <span>Specifications &amp; Palettes</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Link to Full Themes Page */}
        {showExploreAllLink && (
          <div className="theme-tap-footer-link mt-6 text-center sm:text-left">
            <Link
              to="/decorations"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf hover:text-ink transition-colors"
            >
              <Sparkles size={15} />
              <span>Explore all four disciplines &amp; spatial specs</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ThemeTapAccordion;
