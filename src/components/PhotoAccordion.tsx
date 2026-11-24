import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ACCORDION_ITEMS, AccordionItem } from '../data/assetsManifest';
import { ChevronLeft, ChevronRight, ChevronDown, ArrowUpRight } from 'lucide-react';

interface PhotoAccordionProps {
  showExploreLink?: boolean;
}

const getImageBaseName = (path: string): string => {
  const parts = path.split('/');
  const filename = parts[parts.length - 1];
  return filename.replace(/\.[^/.]+$/, '');
};

const checkCompact = (): boolean => {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia('(max-width: 899px), (hover: none), (pointer: coarse)');
  const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0 && window.innerWidth <= 1024;
  return mq.matches || isTouchDevice;
};

export const PhotoAccordion: React.FC<PhotoAccordionProps> = ({ showExploreLink }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const shouldShowExplore = showExploreLink !== undefined ? showExploreLink : isHomePage;

  // Track compact vs desktop fine-pointer view
  const [isCompact, setIsCompact] = useState<boolean>(() => checkCompact());

  // Desktop accordion selection & hover preview
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Mobile tap accordion state (one panel open at a time, tap again closes)
  const [mobileOpenIndex, setMobileOpenIndex] = useState<number | null>(null);

  // Track which mobile panels have media rendered in DOM
  // Kept mounted during 320ms transition on close, then unmounted to preserve low RAM
  const [renderedMediaIndices, setRenderedMediaIndices] = useState<Set<number>>(() => new Set());
  const closeTimersRef = useRef<Record<number, NodeJS.Timeout>>({});

  // Sync compact layout via matchMedia and resize listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 899px), (hover: none), (pointer: coarse)');
    const update = () => {
      setIsCompact(checkCompact());
    };

    update();
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = closeTimersRef.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  // Effective displayed index for desktop: hover preview gated by hover:hover & pointer:fine
  const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  const goToPrev = () => {
    const newIdx = (activeIndex - 1 + ACCORDION_ITEMS.length) % ACCORDION_ITEMS.length;
    setActiveIndex(newIdx);
    setHoveredIndex(null);
    if (isCompact) {
      setMobileOpenIndex(newIdx);
      setRenderedMediaIndices(new Set([newIdx]));
    }
  };

  const goToNext = () => {
    const newIdx = (activeIndex + 1) % ACCORDION_ITEMS.length;
    setActiveIndex(newIdx);
    setHoveredIndex(null);
    if (isCompact) {
      setMobileOpenIndex(newIdx);
      setRenderedMediaIndices(new Set([newIdx]));
    }
  };

  const handleSelectDesktopPanel = (index: number) => {
    setActiveIndex(index);
    setHoveredIndex(null);
  };

  const handleDesktopHover = (index: number) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setHoveredIndex(index);
    }
  };

  // Mobile Tap-to-Expand Accordion: Tap opens, tap again closes, opening another closes previous
  // No auto-scroll on mount or when panel opens
  const toggleMobileRow = (idx: number) => {
    if (mobileOpenIndex === idx) {
      // Closing this panel
      setMobileOpenIndex(null);
      if (closeTimersRef.current[idx]) clearTimeout(closeTimersRef.current[idx]);
      closeTimersRef.current[idx] = setTimeout(() => {
        setRenderedMediaIndices((prev) => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
      }, 350);
    } else {
      // Opening this panel, close previously open panel
      const prevIdx = mobileOpenIndex;
      if (prevIdx !== null && prevIdx !== idx) {
        if (closeTimersRef.current[prevIdx]) clearTimeout(closeTimersRef.current[prevIdx]);
        closeTimersRef.current[prevIdx] = setTimeout(() => {
          setRenderedMediaIndices((prev) => {
            const next = new Set(prev);
            next.delete(prevIdx);
            return next;
          });
        }, 350);
      }

      setMobileOpenIndex(idx);
      setActiveIndex(idx);

      // Mount media immediately for the newly opened panel
      setRenderedMediaIndices((prev) => {
        const next = new Set(prev);
        next.add(idx);
        return next;
      });
    }
  };

  return (
    <section id="accordion-section" className="section-accordion" aria-labelledby="accordion-section-title">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="accordion-header-row">
          <div>
            <span className="section-label">Celebration Themes</span>
            <h2 id="accordion-section-title" className="section-title">
              Ceremonial Spaces &amp; Floral Architecture
            </h2>
            <p className="section-lead max-w-2xl">
              Seven distinct celebration settings exploring sacred mandap pavilions, cascading botanical installations, ambient canopies, and reception spaces.
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
                {String((isCompact ? (mobileOpenIndex !== null ? mobileOpenIndex : activeIndex) : displayIndex) + 1).padStart(2, '0')}
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
            VIEW 1: DESKTOP EXPANDING ACCORDION
            Mounted ONLY on wide screens with fine pointer to avoid dual-DOM downloads
            ================================================================= */}
        {!isCompact && (
          <div
            className="desktop-accordion-strip"
            role="region"
            aria-label="Expanding celebration photo accordion"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {ACCORDION_ITEMS.map((item: AccordionItem, idx: number) => {
              const isExpanded = idx === displayIndex;
              const baseName = getImageBaseName(item.imagePath);

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
                    if (!isExpanded) handleSelectDesktopPanel(idx);
                  }}
                  onKeyDown={(e) => {
                    if (!isExpanded && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleSelectDesktopPanel(idx);
                    }
                  }}
                  onMouseEnter={() => handleDesktopHover(idx)}
                  onFocus={() => {
                    if (!isExpanded) setActiveIndex(idx);
                  }}
                >
                  {/* Background Photography with Zoom Ease */}
                  <div className="panel-img-wrap">
                    {/* Collapsed panels use small 320w thumbnail; expanded panel gets responsive WebP */}
                    {isExpanded ? (
                      <picture>
                        <source
                          type="image/webp"
                          srcSet={`/portfolio/${baseName}-480w.webp 480w, /portfolio/${baseName}-768w.webp 768w, /portfolio/${baseName}-1200w.webp 1200w`}
                          sizes="(max-width: 1200px) 70vw, 840px"
                        />
                        <img
                          src={item.imagePath}
                          alt={item.title}
                          className="panel-bg-image"
                          loading="lazy"
                          decoding="async"
                          width={1200}
                          height={800}
                        />
                      </picture>
                    ) : (
                      <img
                        src={`/portfolio/${baseName}-320w.webp`}
                        alt={item.title}
                        className="panel-bg-image"
                        loading="lazy"
                        decoding="async"
                        width={320}
                        height={213}
                      />
                    )}
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
        )}

        {/* =================================================================
            VIEW 2: MOBILE TOUCH VERTICAL ACCORDION
            Mounted ONLY on compact / touch screens.
            Collapsed rows do NOT render or download images.
            ================================================================= */}
        {isCompact && (
          <div className="mobile-tap-accordion-wrap" role="region" aria-label="Touch celebration accordion">
            {ACCORDION_ITEMS.map((item: AccordionItem, idx: number) => {
              const isOpen = mobileOpenIndex === idx;
              const isMediaMounted = isOpen || renderedMediaIndices.has(idx);
              const contentId = `mobile-acc-panel-${item.id}`;
              const headerId = `mobile-acc-header-${item.id}`;
              const baseName = getImageBaseName(item.imagePath);

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

                  {/* Disclosure Panel with Intrinsic Height CSS Grid Transition */}
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headerId}
                    className={`mobile-acc-panel ${isOpen ? 'panel-open' : 'panel-closed'}`}
                  >
                    <div className="mobile-acc-panel-inner">
                      {/* Media mounted ONLY when panel is open or actively closing */}
                      {isMediaMounted && (
                        <>
                          {/* Full-width image at natural ratio with responsive WebP srcset */}
                          <div className="mobile-acc-image-frame">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet={`/portfolio/${baseName}-320w.webp 320w, /portfolio/${baseName}-480w.webp 480w, /portfolio/${baseName}-768w.webp 768w, /portfolio/${baseName}-1200w.webp 1200w`}
                                sizes="(max-width: 480px) 100vw, (max-width: 768px) 95vw, 768px"
                              />
                              <img
                                src={item.imagePath}
                                alt={item.title}
                                className="mobile-acc-img"
                                loading="lazy"
                                decoding="async"
                                width={1200}
                                height={800}
                              />
                            </picture>
                          </div>

                          {/* Accurate Caption & Theme Link */}
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Link to Full Theme Specifications (Visible on Home) */}
        {shouldShowExplore && (
          <div className="accordion-footer-cta">
            <Link
              to="/decorations"
              className="btn-secondary"
              aria-label="Explore all four celebration disciplines and detailed specifications"
            >
              <span>Explore All Themes &amp; Specifications</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoAccordion;
