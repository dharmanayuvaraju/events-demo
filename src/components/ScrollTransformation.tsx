import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowDown, Film, Image as ImageIcon, Sparkles } from 'lucide-react';

interface StoryChapter {
  id: string;
  time: number;
  timeLabel: string;
  index: string;
  title: string;
  headline: string;
  description: string;
  stillDesktop: string;
  stillMobile: string;
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'setting',
    time: 0.0,
    timeLabel: '0.0s',
    index: '01',
    title: 'The setting',
    headline: 'An open garden, ready for a new idea.',
    description: 'An open lawn framed by mature trees, waiting for ceremonial architecture to take shape.',
    stillDesktop: '/media/celebration/01-venue.jpg',
    stillMobile: '/media/celebration/01-venue-mobile.jpg',
  },
  {
    id: 'florals',
    time: 3.5,
    timeLabel: '3.5s',
    index: '02',
    title: 'Floral styling',
    headline: 'An ivory floral arch frames the ceremony.',
    description: 'Cascading ivory blossoms and sculptural botanicals anchor the sacred altar.',
    stillDesktop: '/media/celebration/02-florals.jpg',
    stillMobile: '/media/celebration/02-florals-mobile.jpg',
  },
  {
    id: 'details',
    time: 6.4,
    timeLabel: '6.4s',
    index: '03',
    title: 'The details',
    headline: 'Tables, candlelight and aisle styling complete the setting.',
    description: 'Linen table settings, glassware, and ambient taper candles introduce intimate human scale.',
    stillDesktop: '/media/celebration/03-tables.jpg',
    stillMobile: '/media/celebration/03-tables-mobile.jpg',
  },
  {
    id: 'celebration',
    time: 9.9,
    timeLabel: '9.9s',
    index: '04',
    title: 'The celebration',
    headline: 'Warm lighting brings the imagined evening together.',
    description: 'Golden hour transitions into twilight with glowing fairy canopies and soft candle illumination.',
    stillDesktop: '/media/celebration/04-celebration.jpg',
    stillMobile: '/media/celebration/04-celebration-mobile.jpg',
  },
];

export const ScrollTransformation: React.FC = () => {
  // Check user environment preferences (reduced motion or save-data)
  const [mode, setMode] = useState<'animation' | 'static'>(() => {
    if (typeof window !== 'undefined') {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const nav = navigator as unknown as { connection?: { saveData?: boolean } };
      const saveData = nav.connection?.saveData === true;
      if (prefersReduced || saveData) return 'static';
    }
    return 'animation';
  });

  const [isMobile, setIsMobile] = useState<boolean>(() => {
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

  // Choose single video source and responsive poster
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const chosenSrc = mobile
        ? '/media/celebration/celebration-mobile.mp4'
        : '/media/celebration/celebration-desktop.mp4';
      setVideoSrc(chosenSrc);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track document visibility to pause scrubbing when tab is hidden
  useEffect(() => {
    const handleVisChange = () => {
      isDocumentVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, []);

  // Lazy initialize video source when approaching viewport
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

  // Execute seeking with coalescing
  const seekToTime = useCallback((targetTime: number) => {
    const video = videoRef.current;
    if (!video || videoLoadError) return;
    if (video.readyState < 1 && !isVideoReady) return;

    const duration = video.duration || 10;
    const maxDuration = Math.max(0, duration - 0.04);
    const clampedTime = Math.max(0, Math.min(targetTime, maxDuration));

    // Avoid duplicate seek if time delta is negligible
    if (Math.abs(clampedTime - lastTargetTimeRef.current) < 0.02) return;
    lastTargetTimeRef.current = clampedTime;

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
    const headerOffset = 76; // Height clearance for sticky navigation
    const stickyHeight = sticky.offsetHeight || 500;
    const totalTravel = rect.height - stickyHeight;

    if (totalTravel <= 0) return;

    // Progress:
    // When track.top reaches headerOffset, progress = 0.
    // When track.bottom reaches headerOffset + stickyHeight, progress = 1.
    const progress = Math.max(0, Math.min(1, (headerOffset - rect.top) / totalTravel));
    lastCalculatedProgressRef.current = progress;

    // Map progress to video playback time (0 to duration - epsilon)
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

    // Initial resync
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
    const target = document.getElementById('accordion-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const posterPath = isMobile
    ? '/media/celebration/celebration-poster-mobile.jpg'
    : '/media/celebration/celebration-poster.jpg';

  return (
    <section
      ref={sectionRef}
      id="scroll-transformation-section"
      className={`scroll-transformation-section ${mode === 'static' ? 'mode-static' : 'mode-animation'}`}
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
                href="#accordion-section"
                onClick={scrollToNextSection}
                className="skip-animation-link"
                aria-label="Skip transformation animation and proceed to the collection"
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
                      <img
                        src={posterPath}
                        alt="Initial ceremonial setting overview"
                        className="stage-poster-img"
                        width={isMobile ? 768 : 1280}
                        height={isMobile ? 432 : 720}
                      />
                    </div>
                  )}
                  <div className="stage-badge-indicator">
                    <span className="badge-dot" />
                    <span>Chapter {STORY_CHAPTERS[activeChapterIndex].index} of 04</span>
                  </div>
                </div>

                <div className="stage-transparency-note">
                  <span>Illustrative concept animation. Not a completed A3Y event.</span>
                </div>
              </div>

              {/* Progress & Chapter Text Column */}
              <div className="stage-narrative-col">
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
                          <span className="chapter-index">{chap.index}</span>
                          <span className="chapter-tag">{chap.title}</span>
                          <span className="chapter-anchor">{chap.timeLabel}</span>
                        </div>
                        <h3 className="chapter-headline">{chap.headline}</h3>
                        <p className="chapter-desc">{chap.description}</p>
                      </div>
                    );
                  })}
                </div>

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
            {STORY_CHAPTERS.map((chap) => (
              <article key={chap.id} className="static-chapter-plate">
                <div className="plate-img-wrap">
                  <picture>
                    <source media="(max-width: 640px)" srcSet={chap.stillMobile} />
                    <img
                      src={chap.stillDesktop}
                      alt={chap.headline}
                      className="plate-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <span className="plate-index-badge">Chapter {chap.index}</span>
                </div>

                <div className="plate-body">
                  <div className="plate-meta-row">
                    <span className="plate-category">{chap.title}</span>
                    <span className="plate-anchor">Anchor {chap.timeLabel}</span>
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
