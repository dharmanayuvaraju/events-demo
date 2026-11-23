import React, { useEffect, useRef } from 'react';
import { PortfolioAsset } from '../data/assetsManifest';
import { DecorArtwork } from './DecorArtwork';
import { X, ChevronLeft, ChevronRight, MapPin, Camera, ExternalLink } from 'lucide-react';

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

  // Synchronize modal state with native <dialog> showModal()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeBtnRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle native cancel (Esc key) and light dismiss
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
      className="lightbox-modal"
      aria-labelledby="lightbox-title"
    >
      <div className="lightbox-content">
        {/* Header */}
        <div className="lightbox-header">
          <div className="flex items-center gap-3">
            <span
              className={`pending-label ${
                asset.status === 'verified_maps_photo'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : ''
              }`}
            >
              {asset.status === 'verified_maps_photo' ? (
                <Camera size={13} className="text-amber-700" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
              )}
              {asset.statusLabel}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold opacity-65">
              {asset.categoryLabel}
            </span>
          </div>

          <div className="lightbox-nav-btns">
            <button
              type="button"
              className="btn-icon"
              onClick={onPrev}
              disabled={!hasPrev}
              aria-label="Previous artwork plate"
              style={{ opacity: hasPrev ? 1 : 0.35 }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={onNext}
              disabled={!hasNext}
              aria-label="Next artwork plate"
              style={{ opacity: hasNext ? 1 : 0.35 }}
            >
              <ChevronRight size={20} />
            </button>
            <button
              ref={closeBtnRef}
              type="button"
              className="btn-icon"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="lightbox-body">
          {/* Framed Graphic / Photo Plate */}
          <div className="rounded overflow-hidden border border-neutral-300 shadow-sm bg-neutral-900">
            <DecorArtwork asset={asset} variant="full" />
          </div>

          {/* Details & Specifications */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 id="lightbox-title" className="font-serif text-2xl font-bold mb-3">
                {asset.title}
              </h2>
              <p className="text-sm opacity-85 leading-relaxed mb-4">
                {asset.description}
              </p>

              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider block mb-2 opacity-60">
                  Decor Elements &amp; Palette:
                </span>
                <ul className="text-xs space-y-1.5 opacity-80 list-disc list-inside">
                  {asset.spec.decorElements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex items-start gap-2 text-xs opacity-75 mb-4">
                <MapPin size={15} className="flex-shrink-0 mt-0.5 text-coral" />
                <span>Recommended Venue: {asset.spec.recommendedVenue}</span>
              </div>

              {asset.sourceUrl && (
                <div className="mb-4 p-2.5 rounded bg-amber-50 border border-amber-200 text-xs">
                  <a
                    href={asset.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-amber-900 font-bold hover:underline"
                  >
                    <span>View original on Google Maps Profile</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <div className="text-[11px] opacity-60 leading-normal mb-3">
                <strong>Provenance:</strong> {asset.provenance}. {asset.legalNotice}.
              </div>

              <a
                href={`/contact?category=${asset.category}&title=${encodeURIComponent(asset.title)}`}
                className="btn-primary w-full text-center"
              >
                Inquire about this style
              </a>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};
