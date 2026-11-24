import React, { useEffect, useRef } from 'react';
import { PortfolioAsset } from '../data/assetsManifest';
import { X, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';

interface LightboxProps {
  asset: PortfolioAsset | null;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const Lightbox: React.FC<LightboxProps> = ({
  asset,
  isOpen,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Store trigger element on open for restoring focus on close
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Synchronize modal state with native <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
    } else if (!isOpen && dialog.open) {
      dialog.close();
      document.body.style.overflow = '';
      triggerElementRef.current?.focus();
    }
  }, [isOpen]);

  // Keyboard navigation & light dismiss handlers
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (e.target === dialog) {
        onClose();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNext();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!asset) return null;

  return (
    <dialog
      ref={dialogRef}
      className="lightbox-dialog photowall-lightbox"
      aria-labelledby="lightbox-title"
      aria-modal="true"
    >
      <div className="lightbox-container">
        {/* Header Bar */}
        <div className="lightbox-topbar">
          <div className="lightbox-badge-group">
            <span className="lightbox-category-badge">{asset.categoryLabel}</span>
            <span className="lightbox-inspiration-pill">Visual Inspiration / Demo</span>
          </div>

          <div className="lightbox-nav-controls">
            <button
              type="button"
              className="btn-icon"
              onClick={onPrev}
              disabled={!hasPrev}
              aria-label="Previous image plate"
              title="Previous image"
              style={{ opacity: hasPrev ? 1 : 0.35 }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={onNext}
              disabled={!hasNext}
              aria-label="Next image plate"
              title="Next image"
              style={{ opacity: hasNext ? 1 : 0.35 }}
            >
              <ChevronRight size={20} />
            </button>
            <button
              ref={closeBtnRef}
              type="button"
              className="btn-icon lightbox-close-btn"
              onClick={onClose}
              aria-label="Close dialog"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="lightbox-content-grid">
          {/* Large Image Frame */}
          <div className="lightbox-photo-pane">
            <img
              src={asset.imagePath}
              alt={asset.title}
              width={asset.dimensions.width}
              height={asset.dimensions.height}
              className="lightbox-main-img"
            />
            <p className="lightbox-photo-caption">
              {asset.caption}
            </p>
          </div>

          {/* Details & Provenance Column */}
          <div className="lightbox-details-pane">
            <div>
              <h2 id="lightbox-title" className="lightbox-asset-title">
                {asset.title}
              </h2>
              <p className="lightbox-asset-desc">
                {asset.description}
              </p>

              {/* Specification Attributes */}
              <div className="lightbox-spec-group">
                <h3 className="spec-heading">Spatial &amp; Palette Spec</h3>
                
                <div className="spec-item">
                  <span className="spec-label">Venue Type:</span>
                  <span className="spec-val">{asset.spec.venue}</span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">Key Elements:</span>
                  <span className="spec-val">{asset.spec.elements.join(', ')}</span>
                </div>

                <div className="spec-item">
                  <span className="spec-label">Palette Swatches:</span>
                  <div className="swatch-list">
                    {asset.spec.palette.map((color, i) => (
                      <span
                        key={i}
                        className="color-swatch-dot"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Provenance & License Notice */}
            <div className="lightbox-provenance-box">
              <div className="provenance-title flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-600" />
                <span>Asset Provenance &amp; Attribution</span>
              </div>
              <p className="provenance-note">
                Photo by <strong>{asset.photographer}</strong> via{' '}
                <a
                  href={asset.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="provenance-link"
                >
                  Unsplash <ExternalLink size={11} className="inline ml-0.5" />
                </a>.
              </p>
              <p className="provenance-license">
                {asset.license}. Displayed for design demonstration and layout testing. Not work completed by A3Y Solutions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
