import React, { useState } from 'react';
import { PortfolioAsset } from '../data/assetsManifest';
import { Sparkles, MapPin } from 'lucide-react';

interface DecorArtworkProps {
  asset?: PortfolioAsset;
  themeId?: 'birthday' | 'wedding' | 'balloons' | 'flowers';
  variant?: 'full' | 'thumb';
  className?: string;
}

export const DecorArtwork: React.FC<DecorArtworkProps> = ({
  asset,
  themeId = 'birthday',
  variant = 'full',
  className = '',
}) => {
  const currentCategory = asset ? asset.category : themeId;
  const [imgError, setImgError] = useState<boolean>(false);

  // Render stylized vector celebration stage artwork fallback if image fails to load
  const renderVectorArt = () => {
    switch (currentCategory) {
      case 'birthday':
        return (
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Birthday stage decor concept artwork: Coral ring arch with balloon clusters and cake plinths"
          >
            <defs>
              <linearGradient id="bdayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF8EE" />
                <stop offset="100%" stopColor="#F5E6D3" />
              </linearGradient>
            </defs>
            <rect width="800" height="600" fill="url(#bdayGrad)" />
            <path d="M 0 510 L 800 510" stroke="#211D24" strokeWidth="2" strokeDasharray="4 4" opacity="0.25" />
            <circle cx="400" cy="280" r="180" fill="none" stroke="#E5AC32" strokeWidth="8" />
            <g fill="#ED654C">
              <circle cx="270" cy="380" r="42" opacity="0.95" />
              <circle cx="240" cy="320" r="48" opacity="0.9" />
              <circle cx="290" cy="140" r="46" opacity="0.95" />
              <circle cx="350" cy="115" r="40" opacity="0.9" />
            </g>
            <g fill="#FFF8EE" stroke="#ED654C" strokeWidth="2">
              <circle cx="280" cy="330" r="28" />
              <circle cx="310" cy="160" r="26" />
              <circle cx="380" cy="120" r="28" />
            </g>
            <rect x="375" y="380" width="50" height="130" rx="3" fill="#FFFFFF" stroke="#211D24" strokeWidth="2" />
          </svg>
        );

      case 'wedding':
        return (
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Wedding mandap decor concept artwork: Cobalt drapery with marigold strings and ceremonial pillars"
          >
            <rect width="800" height="600" fill="#244AD3" />
            <rect x="180" y="160" width="24" height="360" rx="2" fill="#E5AC32" />
            <rect x="596" y="160" width="24" height="360" rx="2" fill="#E5AC32" />
            <rect x="150" y="140" width="500" height="26" rx="4" fill="#E5AC32" />
          </svg>
        );

      case 'balloons':
        return (
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Balloon decor concept artwork"
          >
            <rect width="800" height="600" fill="#E5AC32" />
            <circle cx="400" cy="300" r="140" fill="#ED654C" />
          </svg>
        );

      case 'flowers':
      default:
        return (
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Flower decor concept artwork"
          >
            <rect width="800" height="600" fill="#2F7A4F" />
            <circle cx="400" cy="300" r="140" fill="#E5AC32" />
          </svg>
        );
    }
  };

  const isRealPhoto = Boolean(asset?.imagePath && !imgError);
  const isVerifiedLocal = asset?.status === 'verified_maps_photo';
  const badgeText = asset?.badgeLabel || (isVerifiedLocal ? 'Verified Setup • Kukatpally' : 'Signature Staging');

  return (
    <div
      className={`relative w-full overflow-hidden bg-neutral-900 group ${className}`}
      style={{ aspectRatio: variant === 'thumb' ? '16/11' : '16/10' }}
    >
      {isRealPhoto ? (
        <img
          src={asset!.imagePath}
          alt={asset?.title || 'Colors Events decor celebration staging'}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        renderVectorArt()
      )}

      {/* Subtle Gradient Shadow for Readability */}
      {isRealPhoto && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              variant === 'full'
                ? 'linear-gradient(to top, rgba(20, 16, 22, 0.85) 0%, rgba(20, 16, 22, 0.2) 40%, rgba(0,0,0,0) 65%, rgba(20, 16, 22, 0.35) 100%)'
                : 'linear-gradient(to top, rgba(20, 16, 22, 0.75) 0%, rgba(20, 16, 22, 0) 50%)',
          }}
        />
      )}

      {/* Top Attribution Badge */}
      <div
        style={{
          position: 'absolute',
          top: variant === 'thumb' ? '8px' : '12px',
          left: variant === 'thumb' ? '8px' : '12px',
          backgroundColor: isVerifiedLocal ? 'rgba(217, 119, 6, 0.92)' : 'rgba(33, 29, 36, 0.88)',
          color: '#FFF8EE',
          fontSize: variant === 'thumb' ? '0.64rem' : '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '4px 9px',
          borderRadius: '3px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backdropFilter: 'blur(6px)',
          zIndex: 10,
          border: isVerifiedLocal ? '1px solid rgba(255, 248, 238, 0.4)' : '1px solid rgba(255, 248, 238, 0.18)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
        }}
      >
        {isVerifiedLocal ? (
          <>
            <MapPin size={11} className="text-white" />
            <span>{badgeText}</span>
          </>
        ) : (
          <>
            <Sparkles size={11} className="text-amber-400" />
            <span>{badgeText}</span>
          </>
        )}
      </div>

      {/* Bottom Title Bar for Full variant */}
      {variant === 'full' && asset && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 18px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: 'serif',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#FFF8EE',
              lineHeight: 1.25,
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            {asset.title}
          </div>
          <div
            style={{
              fontSize: '0.76rem',
              color: 'rgba(255, 248, 238, 0.82)',
              marginTop: '3px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{asset.spec.recommendedVenue}</span>
            <span>&bull;</span>
            <span style={{ textTransform: 'capitalize' }}>{asset.category} Styling</span>
          </div>
        </div>
      )}
    </div>
  );
};
