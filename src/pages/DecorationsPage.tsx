import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ASSETS_MANIFEST } from '../data/assetsManifest';
import { DecorArtwork } from '../components/DecorArtwork';
import { ArrowUpRight, Sparkles, Check } from 'lucide-react';

interface ThemeSpec {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  categoryKey: 'weddings' | 'milestones' | 'florals' | 'spatial';
  focalPoint: string;
  anchoring: string;
  paletteNotes: string;
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
  },
];

export const DecorationsPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      // Map old aliases if needed
      const aliasMap: Record<string, string> = {
        wedding: 'ceremonies',
        birthday: 'milestones',
        flowers: 'florals',
        balloons: 'ambient',
      };
      const targetId = aliasMap[hash] || hash;
      const el = document.getElementById(targetId) || document.getElementById(hash);
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
        {/* Header */}
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
        <div className="space-y-16">
          {THEME_SPECS.map((spec) => {
            const matchingAssets = ASSETS_MANIFEST.filter((a) => a.category === spec.categoryKey);
            const primaryAsset = matchingAssets[0] || ASSETS_MANIFEST[0];

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

                    {/* Secondary Visual Variations */}
                    {matchingAssets.length > 1 && (
                      <div className="theme-variations-box">
                        <span className="variations-title">Inspiration Variations:</span>
                        <div className="variations-list">
                          {matchingAssets.map((asset) => (
                            <Link
                              key={asset.id}
                              to={`/gallery?filter=${spec.categoryKey}`}
                              className="variation-chip"
                            >
                              <span>{asset.title}</span>
                              <ArrowUpRight size={12} className="opacity-50" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="theme-action-row">
                      <Link
                        to={`/contact`}
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
                        <span>View Lookbook Plates</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Visual Showcase Frame */}
                  <div className="theme-detail-media">
                    <div className="theme-photo-frame">
                      <DecorArtwork asset={primaryAsset} variant="full" />
                    </div>
                    <p className="theme-photo-caption">
                      {primaryAsset.caption} &bull; Photo by {primaryAsset.photographer}
                    </p>
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
