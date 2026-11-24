import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ACCORDION_ITEMS } from '../data/assetsManifest';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

export const PhotoAccordion: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  
  // Guard against mount-time scroll: never auto-scroll the document or container on initial mount!
  const isInitialMount = useRef<boolean>(true);
  // Guard against scroll feedback loop when user manually swipes
  const isProgrammaticScroll = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Effective displayed index: hovered on pointer desktop, or active on click/keyboard
  const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  // Horizontal container scrolling only - NEVER scrollIntoView or vertical document scroll
  const scrollContainerToCard = useCallback((index: number) => {
    const el = mobileScrollRef.current;
    if (!el || window.innerWidth >= 860) return;

    const cards = el.querySelectorAll<HTMLElement>('.mobile-accordion-card');
    const targetCard = cards[index];
    if (targetCard) {
      isProgrammaticScroll.current = true;
      const cardLeft = targetCard.offsetLeft - el.offsetLeft;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      el.scrollTo({
        left: cardLeft,
        behavior: prefersReduced ? 'auto' : 'smooth',
      });

      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 400);
    }
  }, []);

  const goToPrev = () => {
    const newIdx = (activeIndex - 1 + ACCORDION_ITEMS.length) % ACCORDION_ITEMS.length;
    setActiveIndex(newIdx);
    setHoveredIndex(null);
    scrollContainerToCard(newIdx);
  };

  const goToNext = () => {
    const newIdx = (activeIndex + 1) % ACCORDION_ITEMS.length;
    setActiveIndex(newIdx);
    setHoveredIndex(null);
    scrollContainerToCard(newIdx);
  };

  const handleSelectPanel = (index: number) => {
    setActiveIndex(index);
    setHoveredIndex(null);
    scrollContainerToCard(index);
  };

  // Sync mobile horizontal scroll only after initial mount upon intentional state changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
  }, []);

  // Listen to mobile horizontal scroll when user swipes cards directly
  const handleMobileScroll = () => {
    if (isProgrammaticScroll.current) return;
    const el = mobileScrollRef.current;
    if (!el) return;

    const scrollLeft = el.scrollLeft;
    const firstCard = el.querySelector<HTMLElement>('.mobile-accordion-card');
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 300;
    const index = Math.round(scrollLeft / cardWidth);
    const clamped = Math.max(0, Math.min(ACCORDION_ITEMS.length - 1, index));

    if (clamped !== activeIndex) {
      setActiveIndex(clamped);
    }
  };

  return (
    <section id="accordion-section" className="section-accordion" aria-labelledby="accordion-section-title">
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

            // When collapsed, the panel functions as an accessible button trigger (with Enter/Space).
            // When expanded, the panel acts as a container holding the editorial card and action link,
            // avoiding nested interactive button elements.
            return (
              <div
                key={item.id}
                className={`accordion-panel ${isExpanded ? 'panel-active' : 'panel-collapsed'}`}
                style={{
                  height: `${isExpanded ? 540 : item.desktopHeight}px`,
                }}
                tabIndex={isExpanded ? -1 : 0}
                role={isExpanded ? 'group' : 'button'}
                aria-label={`Panel ${item.index}: ${item.title}`}
                aria-expanded={isExpanded}
                onClick={() => {
                  if (!isExpanded) handleSelectPanel(idx);
                }}
                onKeyDown={(e) => {
                  if (!isExpanded && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleSelectPanel(idx);
                  }
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onFocus={() => {
                  if (!isExpanded) setActiveIndex(idx);
                }}
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
          onScroll={handleMobileScroll}
        >
          {ACCORDION_ITEMS.map((item, idx) => (
            <article
              key={item.id}
              className={`mobile-accordion-card ${idx === activeIndex ? 'mobile-card-selected' : ''}`}
              onClick={() => handleSelectPanel(idx)}
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
              onClick={() => handleSelectPanel(idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
