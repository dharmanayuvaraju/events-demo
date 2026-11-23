import React, { useState } from 'react';
import { PortfolioAsset } from '../data/assetsManifest';
import { Camera, Layers } from 'lucide-react';

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

  // Render stylized vector celebration stage artwork fallback
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
            
            {/* Central Metal Circular Arch */}
            <circle cx="400" cy="280" r="180" fill="none" stroke="#E5AC32" strokeWidth="8" />
            <circle cx="400" cy="280" r="172" fill="none" stroke="#ED654C" strokeWidth="2" opacity="0.5" />
            
            {/* Organic Balloon Clusters */}
            <g fill="#ED654C">
              <circle cx="270" cy="380" r="42" opacity="0.95" />
              <circle cx="240" cy="320" r="48" opacity="0.9" />
              <circle cx="230" cy="250" r="44" opacity="0.95" />
              <circle cx="250" cy="190" r="38" opacity="0.9" />
              <circle cx="290" cy="140" r="46" opacity="0.95" />
              <circle cx="350" cy="115" r="40" opacity="0.9" />
              <circle cx="420" cy="110" r="36" opacity="0.95" />
            </g>
            <g fill="#FFF8EE" stroke="#ED654C" strokeWidth="2">
              <circle cx="280" cy="330" r="28" />
              <circle cx="255" cy="280" r="24" />
              <circle cx="265" cy="220" r="30" />
              <circle cx="310" cy="160" r="26" />
              <circle cx="380" cy="120" r="28" />
            </g>
            <g fill="#E5AC32">
              <circle cx="300" cy="370" r="22" opacity="0.95" />
              <circle cx="225" cy="210" r="26" opacity="0.9" />
              <circle cx="330" cy="130" r="22" opacity="0.95" />
              <circle cx="450" cy="120" r="20" opacity="0.9" />
            </g>
            
            {/* Center Acrylic Neon Sign concept */}
            <rect x="330" y="240" width="140" height="48" rx="8" fill="#211D24" opacity="0.85" />
            <text x="400" y="272" fill="#FFF8EE" fontSize="16" fontFamily="serif" fontStyle="italic" textAnchor="middle" letterSpacing="2">
              Celebrate
            </text>
            
            {/* Cake Plinth Pedestals */}
            <rect x="375" y="380" width="50" height="130" rx="3" fill="#FFFFFF" stroke="#211D24" strokeWidth="2" />
            <rect x="320" y="415" width="45" height="95" rx="3" fill="#FFFFFF" stroke="#211D24" strokeWidth="2" />
            <rect x="435" y="425" width="45" height="85" rx="3" fill="#FFFFFF" stroke="#211D24" strokeWidth="2" />

            <rect x="382" y="340" width="36" height="30" rx="2" fill="#ED654C" />
            <rect x="387" y="318" width="26" height="22" rx="2" fill="#FFF8EE" stroke="#ED654C" strokeWidth="1" />
            <circle cx="400" cy="310" r="4" fill="#E5AC32" />
          </svg>
        );

      case 'wedding':
        return (
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Wedding mandap decor concept artwork: Cobalt drapery with marigold strings and brass ceremonial pillars"
          >
            <defs>
              <linearGradient id="wedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1B38A8" />
                <stop offset="100%" stopColor="#244AD3" />
              </linearGradient>
            </defs>
            <rect width="800" height="600" fill="url(#wedGrad)" />
            <path d="M 120 0 Q 260 220 400 0 Q 540 220 680 0 L 800 0 L 800 600 L 0 600 L 0 0 Z" fill="#182E88" opacity="0.6" />
            
            <g stroke="#E5AC32" strokeWidth="4" fill="#244AD3">
              <rect x="180" y="160" width="24" height="360" rx="2" />
              <rect x="250" y="160" width="20" height="360" rx="2" opacity="0.75" />
              <rect x="530" y="160" width="20" height="360" rx="2" opacity="0.75" />
              <rect x="596" y="160" width="24" height="360" rx="2" />
            </g>
            <rect x="150" y="140" width="500" height="26" rx="4" fill="#E5AC32" />
            <rect x="160" y="132" width="480" height="8" rx="2" fill="#FFF8EE" />

            {[200, 230, 280, 320, 360, 400, 440, 480, 520, 570, 600].map((x, i) => (
              <g key={i}>
                <line x1={x} y1="166" x2={x} y2={220 + (i % 4) * 35} stroke="#E5AC32" strokeWidth="4" strokeDasharray="6 4" />
                <circle cx={x} cy={224 + (i % 4) * 35} r="6" fill="#ED654C" />
              </g>
            ))}

            <rect x="280" y="460" width="240" height="50" rx="3" fill="#FFF8EE" stroke="#E5AC32" strokeWidth="3" />
            <ellipse cx="400" cy="455" rx="38" ry="14" fill="#E5AC32" />
            <ellipse cx="400" cy="453" rx="32" ry="10" fill="#ED654C" />
          </svg>
        );

      case 'balloons':
        return (
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Balloon decor concept artwork: Marigold and warm coral spiraling garland arch"
          >
            <defs>
              <linearGradient id="balloonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F9F4EB" />
                <stop offset="100%" stopColor="#EDE3D1" />
              </linearGradient>
            </defs>
            <rect width="800" height="600" fill="url(#balloonGrad)" />
            
            <path d="M 180 520 C 180 200, 620 200, 620 520" fill="none" stroke="#211D24" strokeWidth="4" opacity="0.15" />
            
            <g fill="#E5AC32">
              <circle cx="190" cy="480" r="44" />
              <circle cx="210" cy="400" r="46" />
              <circle cx="250" cy="320" r="48" />
              <circle cx="310" cy="250" r="50" />
              <circle cx="380" cy="210" r="52" />
              <circle cx="450" cy="215" r="50" />
              <circle cx="520" cy="260" r="48" />
              <circle cx="570" cy="330" r="46" />
              <circle cx="600" cy="410" r="44" />
              <circle cx="610" cy="490" r="42" />
            </g>
            <g fill="#ED654C">
              <circle cx="170" cy="430" r="36" />
              <circle cx="230" cy="360" r="38" />
              <circle cx="280" cy="280" r="40" />
              <circle cx="340" cy="225" r="42" />
              <circle cx="420" cy="210" r="42" />
              <circle cx="490" cy="235" r="40" />
              <circle cx="550" cy="295" r="38" />
              <circle cx="590" cy="370" r="36" />
              <circle cx="625" cy="450" r="34" />
            </g>
            <g fill="#211D24">
              <circle cx="205" cy="450" r="24" opacity="0.9" />
              <circle cx="265" cy="310" r="26" opacity="0.9" />
              <circle cx="360" cy="210" r="28" opacity="0.9" />
              <circle cx="460" cy="225" r="26" opacity="0.9" />
              <circle cx="560" cy="350" r="24" opacity="0.9" />
            </g>
            <g fill="#FFF8EE" stroke="#E5AC32" strokeWidth="2">
              <circle cx="185" cy="380" r="22" />
              <circle cx="300" cy="245" r="24" />
              <circle cx="400" cy="190" r="26" />
              <circle cx="505" cy="255" r="24" />
              <circle cx="615" cy="370" r="20" />
            </g>
            
            <rect x="360" y="320" width="80" height="110" rx="4" fill="#FFFFFF" stroke="#211D24" strokeWidth="2" />
            <line x1="400" y1="430" x2="400" y2="520" stroke="#211D24" strokeWidth="4" />
            <line x1="370" y1="520" x2="430" y2="520" stroke="#211D24" strokeWidth="4" />
            <text x="400" y="365" fill="#211D24" fontSize="13" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
              WELCOME
            </text>
          </svg>
        );

      case 'flowers':
        return (
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Flower decor concept artwork: Leaf green backdrop with marigold blossom toran and jasmine ropes"
          >
            <defs>
              <linearGradient id="flowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#256440" />
                <stop offset="100%" stopColor="#2F7A4F" />
              </linearGradient>
            </defs>
            <rect width="800" height="600" fill="url(#flowerGrad)" />
            
            <path
              d="M 220 520 L 220 280 C 220 180, 580 180, 580 280 L 580 520"
              fill="none"
              stroke="#E5AC32"
              strokeWidth="6"
            />

            <g fill="#1D4F33">
              {[230, 270, 310, 350, 390, 430, 470, 510, 550].map((x, i) => (
                <path key={i} d={`M ${x} 200 C ${x} 240, ${x + 20} 250, ${x + 20} 250 C ${x + 20} 250, ${x + 40} 240, ${x + 40} 200 Z`} />
              ))}
            </g>

            {[240, 280, 320, 360, 400, 440, 480, 520, 560].map((x, idx) => (
              <g key={idx}>
                <line x1={x} y1="210" x2={x} y2={350 + (idx % 3) * 45} stroke="#E5AC32" strokeWidth="5" strokeDasharray="8 6" />
                <circle cx={x} cy={356 + (idx % 3) * 45} r="7" fill="#FFF8EE" />
                <circle cx={x} cy={366 + (idx % 3) * 45} r="5" fill="#ED654C" />
              </g>
            ))}

            <circle cx="400" cy="300" r="55" fill="none" stroke="#E5AC32" strokeWidth="12" strokeDasharray="14 10" />
            <circle cx="400" cy="300" r="40" fill="none" stroke="#FFF8EE" strokeWidth="6" strokeDasharray="8 6" />
            <circle cx="400" cy="300" r="14" fill="#ED654C" />
          </svg>
        );
    }
  };

  const isRealPhoto = Boolean(asset?.imagePath && !imgError);

  return (
    <div className={`relative w-full overflow-hidden bg-neutral-900 ${className}`} style={{ aspectRatio: '16/10' }}>
      {isRealPhoto ? (
        <img
          src={asset!.imagePath}
          alt={asset?.title || 'Colors Events decor photo from Google Maps listing'}
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      ) : (
        renderVectorArt()
      )}
      
      {/* Attribution & Authenticity Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: variant === 'thumb' ? '8px' : '12px',
          left: variant === 'thumb' ? '8px' : '12px',
          backgroundColor: isRealPhoto ? 'rgba(33, 29, 36, 0.92)' : 'rgba(33, 29, 36, 0.85)',
          color: '#FFF8EE',
          fontSize: variant === 'thumb' ? '0.66rem' : '0.74rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '4px 8px',
          borderRadius: '3px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          backdropFilter: 'blur(4px)',
          zIndex: 10,
          border: isRealPhoto ? '1px solid rgba(229, 172, 50, 0.4)' : '1px solid rgba(255, 248, 238, 0.15)',
        }}
      >
        {isRealPhoto ? (
          <>
            <Camera size={12} className="text-amber-400" />
            <span>Google Maps Photo</span>
          </>
        ) : (
          <>
            <Layers size={12} className="text-coral" />
            <span>{asset?.statusLabel || 'Specification Plate'}</span>
          </>
        )}
      </div>
    </div>
  );
};
