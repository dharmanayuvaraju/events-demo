import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';

interface StageArchSculptureProps {
  activeColor: string;
}

// Dynamically lazy-load Three.js WebGL canvas only after primary content
const LazyArchCanvas = lazy(() => import('./ArchCanvas'));

export const StageArchSculpture: React.FC<StageArchSculptureProps> = ({ activeColor }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canRenderWebGL, setCanRenderWebGL] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    // 1. Accessibility & Resource checks
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = window.innerWidth < 840;
    const nav = navigator as unknown as { connection?: { saveData?: boolean } };
    const isSaveData = Boolean(nav.connection?.saveData);

    if (prefersReducedMotion || isMobileViewport || isSaveData) {
      setCanRenderWebGL(false);
      return;
    }

    // 2. WebGL capability check
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        // Delay WebGL initialization slightly to yield thread to initial DOM paint
        const timer = setTimeout(() => {
          setCanRenderWebGL(true);
        }, 150);
        return () => clearTimeout(timer);
      }
    } catch {
      setCanRenderWebGL(false);
    }
  }, []);

  // Pause rendering when offscreen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="stage-arch-layer" aria-hidden="true">
      {/* 1. CSS/SVG composition: Always present as baseline with 0 layout shift */}
      <svg
        className="stage-arch-svg-fallback"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid meet"
        style={{
          opacity: canRenderWebGL ? 0.35 : 0.85,
          transition: 'opacity 0.4s ease',
        }}
      >
        <path
          d="M 150 580 C 180 180, 820 180, 850 580"
          fill="none"
          stroke={activeColor}
          strokeWidth="3.5"
          strokeDasharray="12 8"
          style={{ transition: 'stroke 160ms cubic-bezier(0.2, 0, 0, 1)' }}
        />
        <path
          d="M 220 580 C 260 230, 740 230, 780 580"
          fill="none"
          stroke="#FFF8EE"
          strokeWidth="2"
          opacity="0.6"
        />
        <path
          d="M 300 580 C 330 300, 670 300, 700 580"
          fill="none"
          stroke={activeColor}
          strokeWidth="1.5"
          opacity="0.4"
          style={{ transition: 'stroke 160ms cubic-bezier(0.2, 0, 0, 1)' }}
        />
      </svg>

      {/* 2. Capable Desktop WebGL Canvas (demand-driven, capped DPR at 1.5, pauses offscreen) */}
      {canRenderWebGL && isVisible && (
        <div className="stage-arch-canvas">
          <Suspense fallback={null}>
            <LazyArchCanvas activeColor={activeColor} />
          </Suspense>
        </div>
      )}
    </div>
  );
};
