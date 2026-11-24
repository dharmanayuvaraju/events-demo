import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowDown, Film, Image as ImageIcon, Sparkles } from 'lucide-react';

interface StoryChapter {
  id: string;
  time: number;
  index: string;
  title: string;
  headline: string;
  description: string;
  stillDesktop: string;
  stillDesktopWebp: string;
  stillMobile: string;
  stillMobileWebp: string;
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'setting',
    time: 0.0,
    index: '01',
    title: 'The setting',
    headline: 'An open garden, ready for a new idea.',
    description: 'An open lawn framed by mature trees, waiting for ceremonial architecture to take shape.',
    stillDesktop: '/media/celebration/01-venue.jpg',
    stillDesktopWebp: '/media/celebration/01-venue-1200w.webp',
    stillMobile: '/media/celebration/01-venue-mobile.jpg',
    stillMobileWebp: '/media/celebration/01-venue-mobile-480w.webp',
  },
  {
    id: 'florals',
    time: 3.5,
    index: '02',
    title: 'Floral styling',
    headline: 'An ivory floral arch frames the ceremony.',
    description: 'Cascading ivory blossoms and sculptural botanicals anchor the sacred altar.',
    stillDesktop: '/media/celebration/02-florals.jpg',
    stillDesktopWebp: '/media/celebration/02-florals-1200w.webp',
    stillMobile: '/media/celebration/02-florals-mobile.jpg',
    stillMobileWebp: '/media/celebration/02-florals-mobile-480w.webp',
  },
  {
    id: 'details',
    time: 6.4,
    index: '03',
    title: 'The details',
    headline: 'Tables, candlelight and aisle styling complete the setting.',
    description: 'Linen table settings, glassware, and ambient taper candles introduce intimate human scale.',
    stillDesktop: '/media/celebration/03-tables.jpg',
    stillDesktopWebp: '/media/celebration/03-tables-1200w.webp',
    stillMobile: '/media/celebration/03-tables-mobile.jpg',
    stillMobileWebp: '/media/celebration/03-tables-mobile-480w.webp',
  },
  {
    id: 'celebration',
    time: 9.9,
    index: '04',
    title: 'The celebration',
    headline: 'Warm lighting brings the imagined evening together.',
    description: 'Golden hour transitions into twilight with glowing fairy canopies and soft candle illumination.',
    stillDesktop: '/media/celebration/04-celebration.jpg',
    stillDesktopWebp: '/media/celebration/04-celebration-1200w.webp',
    stillMobile: '/media/celebration/04-celebration-mobile.jpg',
    stillMobileWebp: '/media/celebration/04-celebration-mobile-480w.webp',
  },
];

const COMPACT_STORY_MQ = '(max-width: 899px), (hover: none), (pointer: coarse)';

const checkCompactStory = (): boolean => {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia(COMPACT_STORY_MQ);
  const isTouchDevice = typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0 && window.innerWidth <= 1024;
  return mq.matches || isTouchDevice;
};

export const ScrollTransformation: React.FC = () => {
  // Check user environment preferences (reduced motion, save-data, or short viewport)
  const [mode, setMode] = useState<'animation' | 'static'>(() => {
    if (typeof window === 'undefined') return 'animation';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = navigator as unknown as { connection?: { saveData?: boolean } };
    const saveData = nav.connection?.saveData === true;
    const isShortViewport = window.innerHeight < 520;
    if (prefersReduced || saveData || isShortViewport) return 'static';
    return 'animation';
  });

  // Responsive device / query tracking: compact mode applies to narrow screens OR coarse/touch devices
  const [isCompactStory, setIsCompactStory] = useState<boolean>(() => checkCompactStory());

  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  const [videoSrc, setVideoSrc] = useState<string>('');
  const [activeVideoSrc, setActiveVideoSrc] = useState<string>('');
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const [videoLoadError, setVideoLoadError] = useState<boolean>(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);

  // DOM Refs
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Seeking & Sync State Refs
  const isNearViewport = useRef<boolean>(false);
  const isSeekingRef = useRef<boolean>(false);
  const pendingTimeRef = useRef<number | null>(null);
  const lastTargetTimeRef = useRef<number>(-1);
  const lastCalculatedProgressRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isDocumentVisibleRef = useRef<boolean>(true);

  // Sync layout media queries and choose single video file
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia(COMPACT_STORY_MQ);
    const updateLayout = () => {
      const compact = checkCompactStory();
      const mobileWidth = window.innerWidth < 768;
      setIsCompactStory(compact);
      setIsMobileViewport(mobileWidth);

      // Choose single video file
      const chosenSrc = mobileWidth
        ? '/media/celebration/celebration-mobile.mp4'
        : '/media/celebration/celebration-desktop.mp4';
      setVideoSrc(chosenSrc);
    };

    updateLayout();
    mq.addEventListener('change', updateLayout);
    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);

    return () => {
      mq.removeEventListener('change', updateLayout);
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);

  // Track document visibility to pause seeking when tab is hidden and resync on return
  useEffect(() => {
    const handleVisChange = () => {
      const isVis = document.visibilityState === 'visible';
      isDocumentVisibleRef.current = isVis;
      if (isVis && isNearViewport.current && mode === 'animation') {
        // Resync playback time on tab return
        calculateAndApplyProgress();
      }
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, [mode]);

  // Lazy initialize video source when approaching viewport (rootMargin: 300px)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      if (videoSrc) setActiveVideoSrc(videoSrc);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isNearViewport.current = entry.isIntersecting;
        if (entry.isIntersecting && videoSrc) {
          setActiveVideoSrc((prev) => prev || videoSrc);
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [videoSrc]);

  // Sync readyState if already loaded
  useEffect(() => {
    const video = videoRef.current;
    if (video && video.readyState >= 1) {
      setIsVideoReady(true);
    }
  }, [activeVideoSrc]);

  // Coalesced seek completion handler
  const handleSeeked = useCallback(() => {
    const video = videoRef.current;
    if (pendingTimeRef.current !== null) {
      const nextTime = pendingTimeRef.current;
      pendingTimeRef.current = null;
      if (video) {
        try {
          video.currentTime = nextTime;
        } catch {
          isSeekingRef.current = false;
        }
      }
    } else {
      isSeekingRef.current = false;
    }
  }, []);

  // Stall recovery: if seeking flag stays stuck for >350ms, release it
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSeekingRef.current && videoRef.current && !videoRef.current.seeking) {
        isSeekingRef.current = false;
      }
    }, 350);
    return () => clearInterval(interval);
  }, []);

  // Safe seek with seekable range check & coalescing
  const seekToTime = useCallback((targetTime: number) => {
    const video = videoRef.current;
    if (!video || videoLoadError) return;
    if (video.readyState < 1 && !isVideoReady) return;

    const duration = video.duration || 10;
    const maxDuration = Math.max(0, duration - 0.04);
    const clampedTime = Math.max(0, Math.min(targetTime, maxDuration));

    // Avoid redundant seek if time difference is negligible
    if (Math.abs(clampedTime - lastTargetTimeRef.current) < 0.02) return;
    lastTargetTimeRef.current = clampedTime;

    // Check seekable range if available
    if (video.seekable && video.seekable.length > 0) {
      let isWithinRange = false;
      for (let i = 0; i < video.seekable.length; i++) {
        if (clampedTime >= video.seekable.start(i) && clampedTime <= video.seekable.end(i) + 0.05) {
          isWithinRange = true;
          break;
        }
      }
      if (!isWithinRange) return;
    }

    if (isSeekingRef.current) {
      pendingTimeRef.current = clampedTime;
    } else {
      isSeekingRef.current = true;
      try {
        video.currentTime = clampedTime;
      } catch {
        isSeekingRef.current = false;
      }
    }
  }, [isVideoReady, videoLoadError]);

  // Unified Scroll & Progress Calculation over the Containing Track
  const calculateAndApplyProgress = useCallback(() => {
    if (mode === 'static') return;
    const track = trackRef.current;
    const sticky = stickyContainerRef.current;
    if (!track || !sticky) return;

    const rect = track.getBoundingClientRect();
    const headerOffset = window.innerWidth < 768 ? 64 : 76;
    const stickyHeight = sticky.offsetHeight || 420;
    const totalTravel = rect.height - stickyHeight;

    if (totalTravel <= 0) return;

    // Progress: 0 when track.top reaches headerOffset, 1 when track.bottom reaches headerOffset + stickyHeight
    const progress = Math.max(0, Math.min(1, (headerOffset - rect.top) / totalTravel));
    lastCalculatedProgressRef.current = progress;

    // Map progress to video playback duration
    const duration = videoRef.current?.duration || 10;
    const targetSeconds = progress * (duration - 0.04);
    seekToTime(targetSeconds);

    // Update active chapter display
    let activeChap = 0;
    for (let i = 0; i < STORY_CHAPTERS.length; i++) {
      if (targetSeconds >= STORY_CHAPTERS[i].time - 0.35) {
        activeChap = i;
      }
    }
    setActiveChapterIndex(activeChap);
  }, [mode, seekToTime]);

  // Native Scroll Listener via requestAnimationFrame
  useEffect(() => {
    if (mode === 'static') return;

    const handleScroll = () => {
      if (!isNearViewport.current || !isDocumentVisibleRef.current) return;
      if (rafIdRef.current) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        calculateAndApplyProgress();
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('orientationchange', handleScroll, { passive: true });

    // Initial sync
    calculateAndApplyProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('orientationchange', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [mode, calculateAndApplyProgress]);

  // Resync when video becomes ready
  useEffect(() => {
    if (isVideoReady) {
      calculateAndApplyProgress();
    }
  }, [isVideoReady, calculateAndApplyProgress]);

  const scrollToNextSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('enquiry-section') || document.getElementById('accordion-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentChap = STORY_CHAPTERS[activeChapterIndex];
  const posterPath = isMobileViewport
    ? '/media/celebration/celebration-poster-mobile.jpg'
    : '/media/celebration/celebration-poster.jpg';
  const posterWebp = isMobileViewport
    ? '/media/celebration/celebration-poster-mobile-480w.webp'
    : '/media/celebration/celebration-poster-1200w.webp';

  return (
    <section
      ref={sectionRef}
      id="scroll-transformation-section"
      className={`scroll-transformation-section ${mode === 'static' ? 'mode-static' : 'mode-animation'} ${isCompactStory ? 'is-compact-story' : 'is-desktop-story'}`}
      aria-labelledby="transformation-heading"
    >
      <div className="container">
        {/* Editorial Section Header */}
        <div className="transformation-header">
          <div className="header-meta-row">
            <span className="section-label">Spatial Transformation</span>
            <span className="concept-notice-pill">
              Illustrative concept animation. Not a completed A3Y event.
            </span>
          </div>

          <div className="header-main-row">
            <div>
              <h2 id="transformation-heading" className="section-title">
                From a space to a celebration.
              </h2>
              <p className="section-lead">
                Scroll to explore one imagined wedding setting.
              </p>
            </div>

            {/* Accessibility Controls & Skip Link */}
            <div className="transformation-controls" role="toolbar" aria-label="Transformation animation controls">
              <button
                type="button"
                className="mode-toggle-btn"
                onClick={() => setMode((m) => (m === 'animation' ? 'static' : 'animation'))}
                aria-pressed={mode === 'static'}
                aria-label={`Switch to ${mode === 'animation' ? 'Static chapter story' : 'Scroll animation'}`}
              >
                {mode === 'animation' ? (
                  <>
                    <ImageIcon size={14} />
                    <span>View as Static Story</span>
                  </>
                ) : (
                  <>
                    <Film size={14} />
                    <span>View as Animation</span>
                  </>
                )}
              </button>

              <a
                href="#enquiry-section"
                onClick={scrollToNextSection}
                className="skip-animation-link"
                aria-label="Skip transformation animation and proceed to developer contact"
              >
                <span>Skip animation</span>
                <ArrowDown size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Fallback Notice when video fails or reduced motion is engaged */}
        {mode === 'static' && (
          <div className="static-mode-banner" role="status">
            <Sparkles size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-neutral-800 leading-relaxed">
              <strong>Static Story Mode:</strong> Displaying high-resolution chapter stills and spatial descriptions in unpinned reading order.
              {videoLoadError && ' (Video scrubbing unavailable on this connection; static plates provided automatically).'}
            </div>
          </div>
        )}

        {/* =================================================================
            VIEW 1: ANIMATION MODE (Deliberate Story Track with Sticky Stage)
            ================================================================= */}
        {mode === 'animation' && (
          <div className="transformation-story-track" ref={trackRef}>
            <div className="sticky-stage-container" ref={stickyContainerRef}>
              {/* Media Column: Landscape Video with Stable Aspect Ratio & Poster */}
              <div className="stage-media-col">
                <div className="stage-video-frame">
                  <video
                    ref={videoRef}
                    src={activeVideoSrc || undefined}
                    muted
                    playsInline
                    preload="metadata"
                    poster={posterPath}
                    className="stage-video"
                    aria-label="Scroll-scrubbed wedding transformation animation"
                    onLoadedMetadata={() => setIsVideoReady(true)}
                    onCanPlay={() => setIsVideoReady(true)}
                    onSeeked={handleSeeked}
                    onError={() => {
                      setVideoLoadError(true);
                      setIsVideoReady(false);
                      setMode('static');
                    }}
                  />
                  {!isVideoReady && (
                    <div className="stage-poster-scrim" aria-hidden="true">
                      <picture>
                        <source type="image/webp" srcSet={posterWebp} />
                        <img
                          src={posterPath}
                          alt="Initial ceremonial setting overview"
                          className="stage-poster-img"
                          width={isMobileViewport ? 768 : 1280}
                          height={isMobileViewport ? 432 : 720}
                        />
                      </picture>
                    </div>
                  )}
                  {/* Clean Chapter Indicator: NO raw time labels */}
                  <div className="stage-badge-indicator">
                    <span className="badge-dot" />
                    <span>Chapter {activeChapterIndex + 1} of 4</span>
                  </div>
                </div>

                <div className="stage-transparency-note">
                  <span>Illustrative concept animation. Not a completed A3Y event.</span>
                </div>
              </div>

              {/* Progress & Narrative: Single Active Chapter in Compact Mode, 4 Cards in Desktop */}
              <div className="stage-narrative-col">
                {isCompactStory ? (
                  /* Compact Mobile/Touch: Single active chapter placed neatly below video */
                  <div className="compact-active-chapter-card" role="region" aria-label={`Chapter ${activeChapterIndex + 1} of 4`}>
                    <div className="compact-chap-header">
                      <span className="compact-chap-badge">Chapter {activeChapterIndex + 1} of 4</span>
                      <span className="compact-chap-title">{currentChap.title}</span>
                    </div>
                    <h3 className="compact-chap-headline">{currentChap.headline}</h3>
                    <p className="compact-chap-desc">{currentChap.description}</p>
                  </div>
                ) : (
                  /* Wide Desktop: 4 Chapter Cards with Active Highlighting */
                  <div className="stage-chapter-track" role="list">
                    {STORY_CHAPTERS.map((chap, idx) => {
                      const isActive = idx === activeChapterIndex;
                      return (
                        <div
                          key={chap.id}
                          className={`stage-chapter-card ${isActive ? 'chapter-active' : 'chapter-idle'}`}
                          role="listitem"
                        >
                          <div className="chapter-meta">
                            <span className="chapter-index">Chapter {idx + 1} of 4</span>
                            <span className="chapter-tag">{chap.title}</span>
                          </div>
                          <h3 className="chapter-headline">{chap.headline}</h3>
                          <p className="chapter-desc">{chap.description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="stage-scroll-hint" aria-hidden="true">
                  <span>Scroll down to advance transformation &bull; Scroll up to reverse</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            VIEW 2: STATIC STORY MODE (Accessible Flowing Plates)
            ================================================================= */}
        {mode === 'static' && (
          <div className="static-chapters-grid" role="region" aria-label="Four static concept chapters">
            {STORY_CHAPTERS.map((chap, idx) => (
              <article key={chap.id} className="static-chapter-plate">
                <div className="plate-img-wrap">
                  <picture>
                    <source media="(max-width: 640px)" type="image/webp" srcSet={chap.stillMobileWebp} />
                    <source media="(max-width: 640px)" srcSet={chap.stillMobile} />
                    <source type="image/webp" srcSet={chap.stillDesktopWebp} />
                    <img
                      src={chap.stillDesktop}
                      alt={chap.headline}
                      className="plate-img"
                      loading="lazy"
                      decoding="async"
                      width={1280}
                      height={720}
                    />
                  </picture>
                  <span className="plate-index-badge">Chapter {idx + 1} of 4</span>
                </div>

                <div className="plate-body">
                  <div className="plate-meta-row">
                    <span className="plate-category">{chap.title}</span>
                  </div>
                  <h3 className="plate-headline">{chap.headline}</h3>
                  <p className="plate-desc">{chap.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Section Closing Transparency Footnote */}
        <div className="transformation-disclaimer">
          <p>
            These illustrations describe this concept, not promises of real services. Conceptual styling plates created for A3Y Solutions design demonstration.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ScrollTransformation;
