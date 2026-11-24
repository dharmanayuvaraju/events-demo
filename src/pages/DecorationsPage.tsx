import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ASSETS_MANIFEST, PortfolioAsset } from '../data/assetsManifest';
import { resolveThemeSectionId, ThemeSectionId } from '../data/themeMapping';
import { ArrowUpRight, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

interface ThemeSpec {
  id: ThemeSectionId;
  index: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  categoryKey: 'weddings' | 'milestones' | 'florals' | 'spatial';
  focalPoint: string;
  anchoring: string;
  paletteNotes: string;
  paletteSwatches: { color: string; label: string }[];
}

const THEME_SPECS: ThemeSpec[] = [
  {
    id: 'ceremonies',
    index: '01',
    title: 'Sacred Ceremonies & Mandaps',
    subtitle: 'Ceremonial Pavilions & Ritual Staging',
    quote: 'A sacred focal point anchored in natural reverence.',
    description: 'Bespoke four-pillar and canopy mandaps crafted from seasoned teakwood, adorned with auspicious marigold garlands, white jasmine cascades, and raw silk drapery.',
    categoryKey: 'weddings',
    focalPoint: '12ft x 12ft raised ceremonial platform with brass urns and natural linen runners.',
    anchoring: 'Self-supporting weighted bases with non-marking footings for lawn and marble protection.',
    paletteNotes: 'Warm ivory (#FAF7F2), golden marigold, muted olive, and brushed brass.',
    paletteSwatches: [
      { color: '#FAF7F2', label: 'Warm Ivory' },
      { color: '#D4A359', label: 'Marigold Gold' },
      { color: '#1F2921', label: 'Forest Olive' },
      { color: '#C29B68', label: 'Brushed Brass' },
    ],
  },
  {
    id: 'milestones',
    index: '02',
    title: 'Milestone Celebrations & Receptions',
    subtitle: 'Intimate Stages & Banquets',
    quote: 'Generational gatherings framed with unhurried grace.',
    description: 'Circular geometric staging with soft curved backdrops, ambient cylinder plinths, and bespoke seating configurations that foster natural guest mingling.',
    categoryKey: 'milestones',
    focalPoint: 'Circular portal backdrop with gentle halo backlighting and minimalist cake plinth.',
    anchoring: 'Modular interlocking steel frames with weighted counterbalances concealed within plinths.',
    paletteNotes: 'Alabaster, dusty rose, champagne parchment, and soft charcoal ink.',
    paletteSwatches: [
      { color: '#FAF7F2', label: 'Alabaster' },
      { color: '#E8B4A2', label: 'Dusty Rose' },
      { color: '#DFC094', label: 'Champagne' },
      { color: '#181D19', label: 'Charcoal Ink' },
    ],
  },
  {
    id: 'florals',
    index: '03',
    title: 'Botanical Architecture & Torans',
    subtitle: 'Sculptural Cascades & Living Installations',
    quote: 'Organic movement celebrating native blooms.',
    description: 'Asymmetrical botanical arches and cascading door torans crafted with fresh seasonal blossoms, fragrant tuberose, mango foliage, and sculptural branches.',
    categoryKey: 'florals',
    focalPoint: 'Cascading entry torans and free-standing floral columns welcoming guests.',
    anchoring: 'Eco-conscious moss armature with internal hydration tubes and biodegradable cotton ties.',
    paletteNotes: 'Fresh yellow and orange marigold, jasmine cream, forest foliage, and clay terracotta.',
    paletteSwatches: [
      { color: '#E5AC32', label: 'Fresh Marigold' },
      { color: '#FAF7F2', label: 'Jasmine Cream' },
      { color: '#263329', label: 'Foliage Green' },
      { color: '#C96244', label: 'Terracotta' },
    ],
  },
  {
    id: 'ambient',
    index: '04',
    title: 'Ambient Illumination & Canopies',
    subtitle: 'Evening Canopies & Banquet Staging',
    quote: 'Warm light weaving through open night air.',
    description: 'Overhead fairy light canopies suspended across outdoor lawns, accompanied by floating candle pools, antique brass lanterns, and warm architectural uplighting.',
    categoryKey: 'spatial',
    focalPoint: 'Illuminated pergola structure spanning dining tables with warm 2700K fairy lights.',
    anchoring: 'Tensioned aircraft cables anchored to perimeter truss uprights with safety secondary tethers.',
    paletteNotes: 'Warm candlelight glow, deep twilight olive, warm linen, and antique copper.',
    paletteSwatches: [
      { color: '#FAD896', label: 'Fairy Candlelight' },
      { color: '#151D17', label: 'Twilight Olive' },
      { color: '#ECE5D8', label: 'Warm Linen' },
      { color: '#A06D48', label: 'Antique Copper' },
    ],
  },
];

export const DecorationsPage: React.FC = () => {
  const location = useLocation();
  const [selectedAssetMap, setSelectedAssetMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (location.hash) {
      const targetId = resolveThemeSectionId(location.hash);
      const el = document.getElementById(targetId) || document.getElementById(location.hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <main id="main-content" className="section-paper">
      <div className="container">
        {/* Page Header */}
        <div className="section-header max-w-3xl mb-12">
          <span className="section-label">Spatial Disciplines &amp; Scope</span>
          <h1 className="section-title">
            Architectural Celebration Disciplines
          </h1>
          <p className="section-lead">
            A structured breakdown of our four concept celebration disciplines, detailing spatial proportions, material integrity, and structural anchoring methods.
          </p>
        </div>

        {/* Four Themes Deep Dive */}
        <div className="theme-cards-stack">
          {THEME_SPECS.map((spec) => {
            const matchingAssets = ASSETS_MANIFEST.filter((a) => a.category === spec.categoryKey);
            const activeAssetId = selectedAssetMap[spec.id] || matchingAssets[0]?.id;
            const displayedAsset: PortfolioAsset = matchingAssets.find((a) => a.id === activeAssetId) || matchingAssets[0] || ASSETS_MANIFEST[0];

            return (
              <section
                key={spec.id}
                id={spec.id}
                className="theme-detail-card scroll-mt-24"
              >
                <div className="theme-detail-grid">
                  {/* Left Column: Scope & Aesthetic Specification */}
                  <div className="theme-detail-copy">
                    <div className="theme-tag-row">
                      <span className="theme-chapter-pill">Discipline {spec.index}</span>
                      <span className="theme-contrast-tag">{spec.subtitle}</span>
                    </div>

                    <h2 className="theme-title">{spec.title}</h2>
                    <p className="theme-headline-quote">&ldquo;{spec.quote}&rdquo;</p>
                    <p className="theme-desc">{spec.description}</p>

                    {/* Spatial Specifications Box */}
                    <div className="theme-spec-box">
                      <h3 className="spec-box-title">Spatial Specifications:</h3>
                      <ul className="spec-checklist">
                        <li className="spec-check-item">
                          <Check size={16} className="text-leaf flex-shrink-0" />
                          <span><strong>Focal Staging:</strong> {spec.focalPoint}</span>
                        </li>
                        <li className="spec-check-item">
                          <Check size={16} className="text-leaf flex-shrink-0" />
                          <span><strong>Structural Anchoring:</strong> {spec.anchoring}</span>
                        </li>
                        <li className="spec-check-item">
                          <Check size={16} className="text-leaf flex-shrink-0" />
                          <span><strong>Harmonic Palette:</strong> {spec.paletteNotes}</span>
                        </li>
                      </ul>
                    </div>

                    {/* Material Palette Swatches */}
                    <div className="theme-palette-box">
                      <span className="palette-title">Curated Material Palette:</span>
                      <div className="palette-swatches-row">
                        {spec.paletteSwatches.map((swatch, sIdx) => (
                          <div key={sIdx} className="palette-swatch-item" title={`${swatch.label} (${swatch.color})`}>
                            <span className="swatch-circle" style={{ backgroundColor: swatch.color }} />
                            <span className="swatch-label">{swatch.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Visual Variations (Thumbnail Selector) */}
                    {matchingAssets.length > 1 && (
                      <div className="theme-variations-box">
                        <span className="variations-title">Inspiration Variations (Click to preview):</span>
                        <div className="variations-thumbnails-grid">
                          {matchingAssets.map((asset) => {
                            const isCurrent = asset.id === displayedAsset.id;
                            return (
                              <button
                                key={asset.id}
                                type="button"
                                className={`variation-thumb-btn ${isCurrent ? 'active-thumb' : ''}`}
                                onClick={() => setSelectedAssetMap((prev) => ({ ...prev, [spec.id]: asset.id }))}
                                aria-label={`Preview plate: ${asset.title}`}
                              >
                                <img
                                  src={asset.imagePath}
                                  alt=""
                                  className="variation-thumb-img"
                                  loading="lazy"
                                />
                                <span className="variation-thumb-title">{asset.title}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="theme-action-row">
                      <Link
                        to="/contact"
                        className="btn-primary"
                        aria-label={`Plan a celebration using ${spec.title}`}
                      >
                        <Sparkles size={16} />
                        <span>Plan This Discipline</span>
                      </Link>

                      <Link
                        to={`/gallery?filter=${spec.categoryKey}`}
                        className="btn-secondary"
                        aria-label={`View lookbook plates for ${spec.title}`}
                      >
                        <span>View Lookbook</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Full-Bleed Editorial Visual Showcase */}
                  <div className="theme-detail-media">
                    <div className="theme-photo-showcase">
                      <img
                        key={displayedAsset.id}
                        src={displayedAsset.imagePath}
                        alt={displayedAsset.title}
                        className="theme-showcase-img"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="theme-showcase-scrim" />

                      {/* Top Glassmorphic Category Tag */}
                      <div className="theme-showcase-tag">
                        <ImageIcon size={13} />
                        <span>{displayedAsset.categoryLabel}</span>
                      </div>

                      {/* Bottom Caption & Credit Overlay */}
                      <div className="theme-showcase-footer">
                        <h4 className="showcase-photo-title">{displayedAsset.title}</h4>
                        <p className="showcase-photo-caption">
                          {displayedAsset.caption} &bull; Photo by {displayedAsset.photographer} (Unsplash)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default DecorationsPage;
