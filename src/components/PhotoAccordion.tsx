import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ACCORDION_ITEMS } from '../data/assetsManifest';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

export const PhotoAccordion: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  // Effective displayed index: hovered on pointer desktop, or active on click/keyboard
  const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + ACCORDION_ITEMS.length) % ACCORDION_ITEMS.length);
    setHoveredIndex(null);
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % ACCORDION_ITEMS.length);
    setHoveredIndex(null);
  };

  // Sync mobile horizontal scroll when activeIndex changes
  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el || window.innerWidth >= 860) return;

    const cards = el.querySelectorAll<HTMLElement>('.mobile-accordion-card');
    const targetCard = cards[activeIndex];
    if (targetCard) {
      targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  }, [activeIndex]);

  return (
    <section className="section-accordion" aria-labelledby="accordion-section-title">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="accordion-header-row">
          <div>
            <span className="section-label">Atmospheres in Focus</span>
            <h2 id="accordion-section-title" className="section-title">
              Ceremonial Spaces &amp; Floral Architecture
            </h2>
            <p className="section-lead max-w-2xl">
              An interactive visual accordion highlighting seven distinct spatial disciplines—from sacred ceremony mandaps to open-air banquet canopies.
            </p>
          </div>

          {/* Navigation Controls: Prev, Next & Position Indicator */}
          <div className="accordion-ctrl-wrap" role="toolbar" aria-label="Accordion navigation">
            <button
              type="button"
              className="acc-nav-btn"
              onClick={goToPrev}
              aria-label="Previous celebration panel"
              title="Previous panel"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="acc-counter acc-indicator" aria-live="polite">
              <span className="acc-curr-num">
                {String(displayIndex + 1).padStart(2, '0')}
              </span>
              <span className="acc-divider">/</span>
              <span className="acc-total-num">
                {String(ACCORDION_ITEMS.length).padStart(2, '0')}
              </span>
            </div>

            <button
              type="button"
              className="acc-nav-btn"
              onClick={goToNext}
              aria-label="Next celebration panel"
              title="Next panel"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* =================================================================
            DESKTOP EXPANDING ACCORDION (Visible on screens >= 860px)
            ================================================================= */}
        <div
          className="desktop-accordion-strip"
          role="region"
          aria-label="Expanding celebration photo accordion"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {ACCORDION_ITEMS.map((item, idx) => {
            const isExpanded = idx === displayIndex;

            return (
              <div
                key={item.id}
                className={`accordion-panel ${isExpanded ? 'panel-active' : 'panel-collapsed'}`}
                style={{
                  height: `${isExpanded ? 540 : item.desktopHeight}px`,
                }}
                onClick={() => {
                  setActiveIndex(idx);
                  setHoveredIndex(null);
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onFocus={() => setActiveIndex(idx)}
                tabIndex={0}
                role="button"
                aria-expanded={isExpanded}
                aria-label={`Panel ${item.index}: ${item.title}`}
              >
                {/* Background Photography with Zoom Ease */}
                <div className="panel-img-wrap">
                  <img
                    src={item.imagePath}
                    alt={item.title}
                    className="panel-bg-image"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="panel-scrim" />
                </div>

                {/* Collapsed State: Vertical Text & Index */}
                {!isExpanded && (
                  <div className="panel-collapsed-meta">
                    <span className="collapsed-index">{item.index}</span>
                    <span className="collapsed-category-text">{item.category}</span>
                  </div>
                )}

                {/* Expanded State: Full Editorial Card Content */}
                {isExpanded && (
                  <div className="panel-expanded-content">
                    <div className="expanded-top-badge">
                      <span className="badge-category">{item.category}</span>
                      <span className="badge-index">Space #{item.index}</span>
                    </div>

                    <div className="expanded-bottom-body">
                      <h3 className="expanded-title">{item.title}</h3>
                      <p className="expanded-desc">{item.shortDesc}</p>
                      
                      <div className="expanded-footer-row">
                        <Link
                          to={item.route}
                          className="btn-editorial-explore"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Explore Theme Details</span>
                          <ArrowUpRight size={14} />
                        </Link>
                        <span className="photographer-credit">
                          Photo by {item.photographer}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* =================================================================
            MOBILE SWIPEABLE CARD STRIP (Visible on screens < 860px)
            ================================================================= */}
        <div
          ref={mobileScrollRef}
          className="mobile-accordion-scroller"
          role="region"
          aria-label="Swipeable celebration panels"
        >
          {ACCORDION_ITEMS.map((item, idx) => (
            <article
              key={item.id}
              className={`mobile-accordion-card ${idx === activeIndex ? 'mobile-card-selected' : ''}`}
              onClick={() => setActiveIndex(idx)}
            >
              <div className="mobile-card-media">
                <img
                  src={item.imagePath}
                  alt={item.title}
                  className="mobile-card-img"
                  loading="lazy"
                />
                <div className="mobile-card-scrim" />
                <span className="mobile-card-tag">{item.category}</span>
              </div>

              <div className="mobile-card-body">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-olive opacity-75">
                    Chapter #{item.index}
                  </span>
                  <span className="text-xs opacity-60">By {item.photographer}</span>
                </div>
                <h3 className="mobile-card-title">{item.title}</h3>
                <p className="mobile-card-desc">{item.shortDesc}</p>

                <Link
                  to={item.route}
                  className="inline-flex items-center gap-1 text-xs font-bold text-olive mt-3 hover:underline"
                >
                  <span>Explore specifications</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Mobile Direct Indicators */}
        <div className="mobile-dots-bar" role="tablist" aria-label="Mobile panel tabs">
          {ACCORDION_ITEMS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Jump to panel ${idx + 1}`}
              className={`mobile-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
