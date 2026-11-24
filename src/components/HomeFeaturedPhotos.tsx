import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Image as ImageIcon } from 'lucide-react';

export interface FeaturedPhoto {
  id: string;
  title: string;
  imagePath: string;
  imageAlt: string;
  caption: string;
  photographer: string;
  aspectRatio: string;
}

export const FEATURED_HOME_PHOTOS: FeaturedPhoto[] = [
  {
    id: 'photo-mandap',
    title: 'Traditional Sacred Mandap',
    imagePath: '/portfolio/photo_wedding_mandap_grand.jpg',
    imageAlt: 'Four-pillar sacred ceremonial mandap canopy with fresh cascading flowers, golden drapery, and aisle lanterns',
    caption: 'Four-pillar ceremonial canopy adorned with cascading white blossoms, ceremonial golden drapes, and candlelit aisle.',
    photographer: 'Photos Hobby (Unsplash)',
    aspectRatio: '16/10',
  },
  {
    id: 'photo-garden-canopy',
    title: 'Open-Air Ceremony Canopy',
    imagePath: '/portfolio/photo_hero_ceremony_venue.jpg',
    imageAlt: 'Outdoor garden ceremony setting with flowing ivory drapery and botanical arrangements on a lawn',
    caption: 'Outdoor garden ceremony setting with flowing ivory fabric drapery, botanical swags, and signing table.',
    photographer: 'Matthew (Unsplash)',
    aspectRatio: '16/10',
  },
  {
    id: 'photo-banquet-canopy',
    title: 'Evening Banquet & String Lights',
    imagePath: '/portfolio/photo_dinner_canopy_evening.jpg',
    imageAlt: 'Long dining table arranged beneath trees with warm hanging fairy lights',
    caption: 'Long banquet tables arranged beneath mature trees with warm suspended fairy lights and candle glow.',
    photographer: 'Matthew Buchanan (Unsplash)',
    aspectRatio: '3/2',
  },
];

export const HomeFeaturedPhotos: React.FC = () => {
  return (
    <section className="section-featured-photos" aria-label="Curated Demonstration Inspiration">
      <div className="container">
        {/* Section Header */}
        <div className="featured-photos-header mb-8">
          <span className="section-label">Lookbook Selection</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink tracking-tight mb-2">
            Selected Concept Plates
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
            Three complete landscape compositions demonstrating ceremony focal points, garden canopies, and evening banquet lighting.
          </p>
        </div>

        {/* Three Full-Image Landscape Cards */}
        <div className="featured-photos-grid">
          {FEATURED_HOME_PHOTOS.map((item, idx) => (
            <article key={item.id} className="featured-photo-card">
              {/* Full-width image in natural flow, intrinsic ratio kept */}
              <div className="featured-photo-media">
                <img
                  src={item.imagePath}
                  alt={item.imageAlt}
                  className="featured-photo-img"
                  loading="lazy"
                  decoding="async"
                  width={1400}
                  height={900}
                />
                <span className="featured-photo-badge">
                  Plate 0{idx + 1}
                </span>
              </div>

              {/* Caption and details placed below the image (never over it) */}
              <div className="featured-photo-meta">
                <h3 className="featured-photo-title">{item.title}</h3>
                <p className="featured-photo-caption">
                  {item.caption} &bull; <span className="opacity-80">Photo by {item.photographer}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Gallery CTA */}
        <div className="featured-photos-footer mt-8 text-center sm:text-left">
          <Link
            to="/gallery"
            className="btn-secondary inline-flex items-center gap-2"
            aria-label="View all demonstration plates in the inspiration gallery"
          >
            <ImageIcon size={15} />
            <span>View All Inspiration in Gallery</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturedPhotos;
