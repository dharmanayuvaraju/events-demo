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

  // Select 9 distinct assets for the mosaic
  const mosaicAssets = ASSETS_MANIFEST.slice(0, 9);

  // Pointer tracking on desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 860 || !isMotionActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;

    // Bounded pan: maximum +/- 24px
    targetPan.current = {
      x: xRatio * -24,
      y: yRatio * -18,
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
      { threshold: 0.1 }
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
      timeRef.current += 0.012;
      const driftX = Math.sin(timeRef.current * 0.6) * 6;
      const driftY = Math.cos(timeRef.current * 0.45) * 5;

      // Lerp pointer pan
      currentPan.current.x += (targetPan.current.x - currentPan.current.x) * 0.05;
      currentPan.current.y += (targetPan.current.y - currentPan.current.y) * 0.05;

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
      <div className="container">
        {/* Editorial Section Header (Above the Mosaic - completely clear of images!) */}
        <div className="photowall-header-row">
          <div className="photowall-header-copy">
            <span className="section-label photowall-gold-label">Lookbook in Motion</span>
            <h2 className="photowall-heading">
              Moments Captured in Space &amp; Bloom
            </h2>
            <p className="photowall-sub">
              An unobstructed visual mosaic of ceremonial mandaps, cascading florals, and ambient banquet canopies.
            </p>
          </div>

          <div className="photowall-controls-bar">
            <span className="photowall-plates-badge">
              <Sparkles size={14} className="text-gold" />
              <span>9 Curated Demonstration Plates</span>
            </span>

            {/* Motion Pause Toggle */}
            <button
              type="button"
              className="motion-toggle-btn"
              onClick={() => setIsMotionActive((prev) => !prev)}
              aria-pressed={isMotionActive}
              aria-label={isMotionActive ? 'Pause photo wall motion' : 'Resume photo wall motion'}
            >
              {isMotionActive ? <Pause size={13} /> : <Play size={13} />}
              <span>Motion: {isMotionActive ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        {/* Completely Unobstructed Photo Mosaic Grid */}
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
                aria-label={`View ${asset.title} in lookbook lightbox`}
              >
                <img
                  src={asset.imagePath}
                  alt={asset.title}
                  className="mosaic-img"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Clean Hover Overlay with Title & Maximize Icon */}
                <div className="mosaic-tile-overlay">
                  <span className="mosaic-category-pill">{asset.categoryLabel}</span>
                  <div className="mosaic-tile-bottom-meta">
                    <span className="mosaic-tile-title">{asset.title}</span>
                    <span className="mosaic-tile-icon-box">
                      <Maximize2 size={14} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
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

export default PhotoWall;
