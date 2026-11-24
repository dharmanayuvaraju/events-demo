import React, { useState, useEffect, useRef } from 'react';
import { ASSETS_MANIFEST, PortfolioAsset } from '../data/assetsManifest';
import { Lightbox } from './Lightbox';
import { Play, Pause, Sparkles, Maximize2 } from 'lucide-react';

export const PhotoWall: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAsset, setSelectedAsset] = useState<PortfolioAsset | null>(null);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number | null>(null);
  const [isMotionActive, setIsMotionActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return true;
  });
  const [isInViewport, setIsInViewport] = useState<boolean>(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState<boolean>(true);

  // Mouse & Drift Animation State
  const targetPan = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentPan = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const mosaicTrackRef = useRef<HTMLDivElement>(null);

  // Select 9 diverse assets for the mosaic
  const mosaicAssets = ASSETS_MANIFEST.slice(0, 9);

  // Pointer tracking on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 860 || !isMotionActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    // Bounded pan: maximum +/- 32px
    targetPan.current = {
      x: xRatio * -32,
      y: yRatio * -24,
    };
  };

  const handleMouseLeave = () => {
    targetPan.current = { x: 0, y: 0 };
  };

  // Visibility and intersection observers
  useEffect(() => {
    const handleVis = () => {
      setIsDocumentVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Smooth Animation Loop with bounded lerp
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !isMotionActive || !isInViewport || !isDocumentVisible) {
      if (mosaicTrackRef.current) {
        mosaicTrackRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      return;
    }

    const animate = () => {
      timeRef.current += 0.015;
      const driftX = Math.sin(timeRef.current * 0.7) * 8;
      const driftY = Math.cos(timeRef.current * 0.5) * 6;

      // Lerp pointer pan
      currentPan.current.x += (targetPan.current.x - currentPan.current.x) * 0.06;
      currentPan.current.y += (targetPan.current.y - currentPan.current.y) * 0.06;

      const finalX = (currentPan.current.x + driftX).toFixed(2);
      const finalY = (currentPan.current.y + driftY).toFixed(2);

      if (mosaicTrackRef.current) {
        mosaicTrackRef.current.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isMotionActive, isInViewport, isDocumentVisible]);

  const openLightbox = (index: number) => {
    setSelectedAssetIndex(index);
    setSelectedAsset(mosaicAssets[index]);
  };

  const closeLightbox = () => {
    setSelectedAssetIndex(null);
    setSelectedAsset(null);
  };

  const goToPrev = () => {
    if (selectedAssetIndex === null || selectedAssetIndex <= 0) return;
    const nextIdx = selectedAssetIndex - 1;
    setSelectedAssetIndex(nextIdx);
    setSelectedAsset(mosaicAssets[nextIdx]);
  };

  const goToNext = () => {
    if (selectedAssetIndex === null || selectedAssetIndex >= mosaicAssets.length - 1) return;
    const nextIdx = selectedAssetIndex + 1;
    setSelectedAssetIndex(nextIdx);
    setSelectedAsset(mosaicAssets[nextIdx]);
  };

  return (
    <section
      ref={containerRef}
      className="section-photowall"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Immersive celebration photo wall"
    >
      {/* Background Asymmetrical Photo Mosaic */}
      <div className="photowall-mosaic-viewport">
        <div ref={mosaicTrackRef} className="photowall-mosaic-track">
          {mosaicAssets.map((asset, idx) => (
            <div
              key={asset.id}
              className={`mosaic-tile mosaic-tile-${idx + 1}`}
              onClick={() => openLightbox(idx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(idx);
                }
              }}
              tabIndex={0}
              role="button"
              aria-haspopup="dialog"
              aria-label={`View ${asset.title} in lightbox`}
            >
              <img
                src={asset.imagePath}
                alt={asset.title}
                className="mosaic-img"
                loading="lazy"
              />
              <div className="mosaic-tile-overlay">
                <Maximize2 size={16} className="text-paper" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Editorial Title on a Restrained Scrim */}
      <div className="photowall-scrim-center scrim-card-overlay">
        <div className="scrim-card">
          <span className="section-label">Lookbook In Motion</span>
          <h2 className="scrim-title">
            Moments Captured in Space &amp; Bloom
          </h2>
          <p className="scrim-desc">
            An original editorial mosaic of ceremonial mandaps, cascading florals, and ambient banquet drapery.
          </p>

          <div className="scrim-footer-row">
            <span className="scrim-meta-tag">
              <Sparkles size={13} className="text-amber-600" />
              <span>9 Curated Demonstration Plates</span>
            </span>

            {/* Motion Pause Toggle */}
            <button
              type="button"
              className="btn-motion-toggle motion-toggle-btn"
              onClick={() => setIsMotionActive((prev) => !prev)}
              aria-pressed={isMotionActive}
              aria-label={isMotionActive ? 'Pause photo wall motion' : 'Resume photo wall motion'}
            >
              {isMotionActive ? <Pause size={12} /> : <Play size={12} />}
              <span>Motion: {isMotionActive ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Native <dialog> Lightbox over Green Backdrop */}
      <Lightbox
        asset={selectedAsset}
        isOpen={selectedAssetIndex !== null}
        onClose={closeLightbox}
        onPrev={goToPrev}
        onNext={goToNext}
        hasPrev={selectedAssetIndex !== null && selectedAssetIndex > 0}
        hasNext={selectedAssetIndex !== null && selectedAssetIndex < mosaicAssets.length - 1}
      />
    </section>
  );
};
