import React, { useState, useEffect, useRef, useCallback } from 'react';

// In-memory module-level flag:
// Resets to false on every full page load or browser refresh.
// Remains true across client-side in-app routing so it does not replay when returning to Home.
let hasPlayedThisPageLoad = false;

export const IntroOverlay: React.FC = () => {
  // Check if intro should be skipped before mounting
  const shouldSkipInitial = () => {
    if (typeof window === 'undefined') return true;
    if (hasPlayedThisPageLoad) return true;
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        hasPlayedThisPageLoad = true;
        return true;
      }
      // Check Save-Data header preference
      const nav = navigator as unknown as { connection?: { saveData?: boolean } };
      if (nav.connection?.saveData) {
        hasPlayedThisPageLoad = true;
        return true;
      }
    } catch {
      return true;
    }
    return false;
  };

  const [shouldRender, setShouldRender] = useState<boolean>(() => !shouldSkipInitial());
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isVerticalVideo] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768 || window.matchMedia('(orientation: portrait)').matches;
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasStartedRef = useRef<boolean>(false);
  const safetyTimerRef = useRef<number | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const skipBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close overlay and cleanup scroll & focus
  const closeOverlay = useCallback((withFade: boolean = true) => {
    // Mark as played for the current in-memory page load
    hasPlayedThisPageLoad = true;

    if (safetyTimerRef.current) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    // Unlock page scroll immediately
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    window.scrollTo(0, 0);

    // Restore aria-hidden / inert on main content
    const mainEl = document.getElementById('main-content');
    const headerEl = document.querySelector('.site-header');
    const footerEl = document.querySelector('.site-footer');

    if (mainEl) {
      mainEl.removeAttribute('aria-hidden');
      mainEl.removeAttribute('inert');
    }
    if (headerEl) {
      headerEl.removeAttribute('aria-hidden');
      headerEl.removeAttribute('inert');
    }
    if (footerEl) {
      footerEl.removeAttribute('aria-hidden');
      footerEl.removeAttribute('inert');
    }

    // Return focus to top of main content without triggering document scroll
    if (mainEl && typeof mainEl.focus === 'function') {
      mainEl.setAttribute('tabindex', '-1');
      mainEl.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);

    if (withFade) {
      setIsFadingOut(true);
      fadeTimerRef.current = window.setTimeout(() => {
        setShouldRender(false);
      }, 400);
    } else {
      setShouldRender(false);
    }
  }, []);

  // Video playback management & event listeners
  useEffect(() => {
    if (!shouldRender) return;

    // Lock page scroll while overlay is active
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    // Apply inert / aria-hidden to underlying content
    const mainEl = document.getElementById('main-content');
    const headerEl = document.querySelector('.site-header');
    const footerEl = document.querySelector('.site-footer');

    if (mainEl) {
      mainEl.setAttribute('aria-hidden', 'true');
      mainEl.setAttribute('inert', '');
    }
    if (headerEl) {
      headerEl.setAttribute('aria-hidden', 'true');
      headerEl.setAttribute('inert', '');
    }
    if (footerEl) {
      footerEl.setAttribute('aria-hidden', 'true');
      footerEl.setAttribute('inert', '');
    }

    // 1.5s Hard Safety Limit: if video hasn't started playing within 1.5s, remove immediately
    safetyTimerRef.current = window.setTimeout(() => {
      if (!hasStartedRef.current) {
        closeOverlay(false);
      }
    }, 1500);

    // Attempt video playback
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Play rejected (e.g. autoplay restriction) -> dismiss immediately with no error state
          closeOverlay(false);
        });
      }
    }

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeOverlay(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount (e.g. route change before video ends)
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current);
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);

      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';

      if (mainEl) {
        mainEl.removeAttribute('aria-hidden');
        mainEl.removeAttribute('inert');
      }
      if (headerEl) {
        headerEl.removeAttribute('aria-hidden');
        headerEl.removeAttribute('inert');
      }
      if (footerEl) {
        footerEl.removeAttribute('aria-hidden');
        footerEl.removeAttribute('inert');
      }
    };
  }, [shouldRender, closeOverlay]);

  if (!shouldRender) return null;

  const videoSrc = isVerticalVideo
    ? '/media/intro/a3y_grand_entry_vert.mp4'
    : '/media/intro/a3y_grand_entry_land.mp4';

  return (
    <div
      role="dialog"
      aria-label="Intro animation"
      aria-modal="true"
      className={`intro-overlay ${isFadingOut ? 'intro-overlay-fading' : ''}`}
    >
      {/* 44px+ Skip Button (Top Right) */}
      <button
        ref={skipBtnRef}
        type="button"
        className="intro-skip-btn"
        onClick={() => closeOverlay(true)}
        aria-label="Skip intro animation"
      >
        <span>Skip</span>
      </button>

      {/* Intro Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        preload="auto"
        muted
        playsInline
        className={`intro-video ${isVerticalVideo ? 'intro-video-vert' : 'intro-video-land'}`}
        onPlaying={() => {
          hasStartedRef.current = true;
          if (safetyTimerRef.current) {
            window.clearTimeout(safetyTimerRef.current);
            safetyTimerRef.current = null;
          }
        }}
        onTimeUpdate={() => {
          if (videoRef.current && videoRef.current.currentTime > 0) {
            hasStartedRef.current = true;
            if (safetyTimerRef.current) {
              window.clearTimeout(safetyTimerRef.current);
              safetyTimerRef.current = null;
            }
          }
        }}
        onEnded={() => {
          closeOverlay(true);
        }}
        onError={() => {
          closeOverlay(false);
        }}
      />
    </div>
  );
};

export default IntroOverlay;
