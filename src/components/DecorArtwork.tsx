import React from 'react';
import { PortfolioAsset } from '../data/assetsManifest';

interface DecorArtworkProps {
  asset?: PortfolioAsset;
  themeId?: 'birthday' | 'wedding' | 'balloons' | 'flowers';
  variant?: 'full' | 'thumb';
  className?: string;
  isPriority?: boolean;
}

export const DecorArtwork: React.FC<DecorArtworkProps> = ({
  asset,
  variant = 'full',
  className = '',
  isPriority = false,
}) => {
  if (!asset) return null;

  return (
    <div
      className={`decor-artwork-container ${variant === 'thumb' ? 'variant-thumb' : 'variant-full'} ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#211D24',
        borderRadius: '6px',
        aspectRatio: variant === 'thumb' ? '3/2' : '16/10',
      }}
    >
      <img
        src={asset.imagePath}
        alt={asset.title}
        width={asset.dimensions.width}
        height={asset.dimensions.height}
        loading={isPriority ? 'eager' : 'lazy'}
        decoding="async"
        className="artwork-image"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.4s ease',
        }}
      />

      {/* Discreet Category Badge */}
      <div
        className="artwork-category-tag"
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(33, 29, 36, 0.88)',
          color: '#FFF8EE',
          fontSize: '0.68rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '4px 8px',
          borderRadius: '4px',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255, 248, 238, 0.2)',
          zIndex: 2,
        }}
      >
        {asset.categoryLabel}
      </div>
    </div>
  );
};
