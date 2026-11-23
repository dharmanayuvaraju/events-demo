import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { REEL_CHAPTERS, Chapter } from '../data/chapters';
import { ASSETS_MANIFEST } from '../data/assetsManifest';
import { StageArchSculpture } from './StageArchSculpture';
import { DecorArtwork } from './DecorArtwork';
import { ArrowUpRight, Pause, Play } from 'lucide-react';

interface ReelHeroProps {
  onChapterChange?: (chapter: Chapter) => void;
}

export const ReelHero: React.FC<ReelHeroProps> = ({ onChapterChange }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const [cardTilt, setCardTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const timerRef = useRef<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const activeChapter = REEL_CHAPTERS[currentIndex];
  // Match the first portfolio asset for this chapter category
  const matchingAsset = ASSETS_MANIFEST.find(a => a.category === activeChapter.id);

  // Advance to next chapter
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % REEL_CHAPTERS.length);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Notify parent of chapter change if needed
  useEffect(() => {
    if (onChapterChange) {
      onChapterChange(activeChapter);
    }
  }, [activeChapter, onChapterChange]);

  // Auto-advance every 5 seconds (5000ms), paused when user hovers or focuses
  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused || isUserInteracting) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      goToNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [goToNext, isPaused, isUserInteracting]);

  // Framed artwork mousemove tilt on capable desktops
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ x: -y * 8, y: x * 8 });
  };

  const handleMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
    setIsUserInteracting(false);
  };

  // Split headline for clip-mask word-by-word reveal
  const words = activeChapter.name.split(' ');

  return (
    <section
      ref={heroRef}
      className="reel-container"
      style={{
        backgroundColor: activeChapter.bgColor,
        color: activeChapter.textColor,
      }}
      onMouseEnter={() => setIsUserInteracting(true)}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={() => setIsUserInteracting(true)}
      onBlurCapture={() => setIsUserInteracting(false)}
      aria-roledescription="carousel"
      aria-label="Celebration Reel Showcasing Event Decoration Themes"
    >
      {/* Three.js Arch Backdrop Layer (ribbon colors follow active chapter color) */}
      <StageArchSculpture activeColor={activeChapter.textColor === '#211D24' ? '#211D24' : '#FFF8EE'} />

      {/* Giant Background Word centered behind framed artwork */}
      <div
        className="giant-bg-word"
        style={{ color: activeChapter.giantWordColor }}
        aria-hidden="true"
      >
        {activeChapter.giantWord}
      </div>

      <div className="container reel-stage">
        {/* Top bar info within the chapter reel */}
        <div className="reel-topbar">
          <div className="chapter-meta-line" style={{ margin: 0 }}>
            <span className="chapter-number">{activeChapter.index} / 04</span>
            <span
              style={{
                display: 'inline-block',
                width: '24px',
                height: '1px',
                backgroundColor: 'currentColor',
                opacity: 0.35,
              }}
            />
            <span className="reel-locality-tag" style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.85 }}>
              Kukatpally, Hyderabad
            </span>
          </div>

          <div className="concept-preview-pill light" title="Unapproved client preview draft">
            Concept preview
          </div>
        </div>

        {/* Main Content Reel Grid */}
        <div key={activeChapter.id} className="reel-grid my-auto" style={{ animation: 'driftUp 170ms cubic-bezier(0.16, 1, 0.3, 1)' }}>
          {/* Left Column: Chapter Headline & Copy */}
          <div className="reel-text-col">
            <h1 className="chapter-headline">
              {words.map((word, wIdx) => (
                <span key={`${activeChapter.id}-${wIdx}`} className="word-mask">
                  <span
                    className="word-inner"
                    style={{
                      transitionDelay: `${wIdx * 50}ms`,
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>

            <p className="chapter-subhead" style={{ opacity: 0.95 }}>
              {activeChapter.sansLine}
            </p>

            <div className="reel-ctas">
              <Link
                to={`/contact?category=${activeChapter.id}`}
                className={activeChapter.bgColor === '#E5AC32' ? 'btn-primary' : 'btn-paper'}
              >
                Plan your celebration
              </Link>
              <Link
                to="/decorations"
                className="btn-secondary"
                style={{
                  borderColor: 'currentColor',
                  color: 'currentColor',
                }}
              >
                Explore decorations
              </Link>
            </div>

            {/* Ticket-Style Plan Card popping in last */}
            <div
              className={`reel-ticket-card ${activeChapter.textColor === '#211D24' ? 'dark-card' : 'light-card'}`}
            >
              <div className="flex items-center justify-between">
                <span className="ticket-tag">Theme Scope #{activeChapter.index}</span>
                <span style={{ fontSize: '0.74rem', opacity: 0.75 }}>Kukatpally Venues</span>
              </div>
              <div className="ticket-scope">{activeChapter.scopeLine}</div>
              <Link
                to={`/contact?category=${activeChapter.id}`}
                className="ticket-link"
                style={{ color: 'currentColor' }}
              >
                <span>Plan this style</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          {/* Right Column: Framed Decor Artwork Plate */}
          <div
            className="reel-frame-wrap"
            onMouseMove={handleMouseMove}
          >
            <div
              className="reel-framed-artwork"
              style={{
                transform: `perspective(1000px) rotateX(${cardTilt.x}deg) rotateY(${cardTilt.y}deg)`,
                transition: cardTilt.x === 0 ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out',
              }}
            >
              <DecorArtwork
                asset={matchingAsset}
                themeId={activeChapter.id}
                variant="full"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Reel Dot Navigation & Pause Toggle */}
        <div className="reel-controls">
          <div className="reel-dots" role="tablist" aria-label="Reel Chapters">
            {REEL_CHAPTERS.map((chap, idx) => (
              <button
                key={chap.id}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Switch to Chapter ${chap.index}: ${chap.name}`}
                className={`reel-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(idx)}
              >
                <span className="dot-visual" />
              </button>
            ))}
          </div>

          <button
            type="button"
            className="reel-pause-btn"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume celebration reel playback' : 'Pause celebration reel playback'}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
            <span>{isPaused ? 'Play' : 'Pause'}</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes driftUp {
          from {
            opacity: 0.9;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};
