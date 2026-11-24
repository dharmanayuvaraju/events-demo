import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ACCORDION_ITEMS } from '../data/assetsManifest';
import { ChevronLeft, ChevronRight, ChevronDown, ArrowUpRight } from 'lucide-react';

export const PhotoAccordion: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(0);

  // Effective displayed index for desktop: hovered on pointer, or active on click/keyboard
  const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  const goToPrev = () => {
    const newIdx = (activeIndex - 1 + ACCORDION_ITEMS.length) % ACCORDION_ITEMS.length;
    setActiveIndex(newIdx);
    setHoveredIndex(null);
    setMobileOpenIndex(newIdx);
  };

  const goToNext = () => {
    const newIdx = (activeIndex + 1) % ACCORDION_ITEMS.length;
    setActiveIndex(newIdx);
    setHoveredIndex(null);
    setMobileOpenIndex(newIdx);
  };

  const handleSelectPanel = (index: number) => {
    setActiveIndex(index);
    setHoveredIndex(null);
  };

  const toggleMobileRow = (index: number) => {
    setMobileOpenIndex((prev) => (prev === index ? null : index));
    setActiveIndex(index);
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
              An interactive visual accordion highlighting seven distinct celebration settings—from sacred ceremony mandaps to open-air banquet canopies.
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
                {String((mobileOpenIndex !== null ? mobileOpenIndex : displayIndex) + 1).padStart(2, '0')}
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
            DESKTOP EXPANDING ACCORDION (Desktop with hover:hover & pointer:fine)
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
                          Photo by {item.photographer} (Unsplash)
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
            MOBILE TOUCH VERTICAL ACCORDION (Phones / Touch Devices)
            ================================================================= */}
        <div className="mobile-tap-accordion-wrap" role="region" aria-label="Touch celebration accordion">
          {ACCORDION_ITEMS.map((item, idx) => {
            const isOpen = mobileOpenIndex === idx;
            const contentId = `mobile-acc-panel-${item.id}`;
            const headerId = `mobile-acc-header-${item.id}`;

            return (
              <div
                key={item.id}
                className={`mobile-acc-card ${isOpen ? 'is-open' : 'is-collapsed'}`}
              >
                {/* 44px+ Accessible Tap Button */}
                <button
                  id={headerId}
                  type="button"
                  className="mobile-acc-header-btn"
                  onClick={() => toggleMobileRow(idx)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                >
                  <span className="mobile-acc-index">{item.index}</span>
                  <div className="mobile-acc-title-col">
                    <span className="mobile-acc-title">{item.title}</span>
                    <span className="mobile-acc-category">{item.category}</span>
                  </div>
                  <span className={`mobile-acc-chevron ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                    <ChevronDown size={18} />
                  </span>
                </button>

                {/* Disclosure Panel */}
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={headerId}
                  className={`mobile-acc-panel ${isOpen ? 'panel-open' : 'panel-closed'}`}
                >
                  <div className="mobile-acc-panel-inner">
                    {/* Full-width image at natural ratio */}
                    <div className="mobile-acc-image-frame">
                      <img
                        src={item.imagePath}
                        alt={item.title}
                        className="mobile-acc-img"
                        loading="lazy"
                        decoding="async"
                        width={1200}
                        height={800}
                      />
                    </div>

                    {/* Accurate Caption & Link */}
                    <div className="mobile-acc-meta">
                      <p className="mobile-acc-desc">
                        {item.shortDesc} &bull; <span className="opacity-75">Photo by {item.photographer} (Unsplash)</span>
                      </p>

                      <Link
                        to={item.route}
                        className="mobile-acc-link"
                        aria-label={`View full specifications for ${item.title}`}
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
      </div>
    </section>
  );
};

export default PhotoAccordion;
