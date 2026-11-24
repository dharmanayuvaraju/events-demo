import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ASSETS_MANIFEST, PortfolioAsset } from '../data/assetsManifest';
import { DecorArtwork } from '../components/DecorArtwork';
import { Lightbox } from '../components/Lightbox';
import { ArrowUpRight, Sparkles, Filter } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') || 'all';

  const [activeFilter, setActiveFilter] = useState<string>(filterParam);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number | null>(null);

  // Sync state if URL changes
  useEffect(() => {
    if (filterParam) {
      setActiveFilter(filterParam);
    }
  }, [filterParam]);

  const handleFilterChange = (category: string) => {
    setActiveFilter(category);
    if (category === 'all') {
      searchParams.delete('filter');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ filter: category });
    }
  };

  const filteredAssets = useMemo(() => {
    if (activeFilter === 'all') return ASSETS_MANIFEST;
    return ASSETS_MANIFEST.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  const openLightbox = (index: number) => {
    setSelectedAssetIndex(index);
  };

  const closeLightbox = () => {
    setSelectedAssetIndex(null);
  };

  const goToPrev = () => {
    if (selectedAssetIndex === null || selectedAssetIndex <= 0) return;
    setSelectedAssetIndex(selectedAssetIndex - 1);
  };

  const goToNext = () => {
    if (selectedAssetIndex === null || selectedAssetIndex >= filteredAssets.length - 1) return;
    setSelectedAssetIndex(selectedAssetIndex + 1);
  };

  const currentAsset: PortfolioAsset | null =
    selectedAssetIndex !== null ? filteredAssets[selectedAssetIndex] || null : null;

  // Filter categories with real counts
  const filterOptions = [
    { id: 'all', label: `All Concepts (${ASSETS_MANIFEST.length})` },
    { id: 'weddings', label: `Weddings (${ASSETS_MANIFEST.filter((i) => i.category === 'weddings').length})` },
    { id: 'milestones', label: `Milestones (${ASSETS_MANIFEST.filter((i) => i.category === 'milestones').length})` },
    { id: 'florals', label: `Florals (${ASSETS_MANIFEST.filter((i) => i.category === 'florals').length})` },
    { id: 'spatial', label: `Spatial (${ASSETS_MANIFEST.filter((i) => i.category === 'spatial').length})` },
  ];

  return (
    <main id="main-content" className="section-paper">
      <div className="container">
        {/* Header */}
        <div className="section-header max-w-3xl mb-8">
          <span className="section-label">Visual Inspiration &amp; Lookbook</span>
          <h1 className="section-title">Celebration Styling Lookbook</h1>
          <p className="section-lead">
            Curated photographic demonstration plates showcasing spatial staging, floral arrangements, and architectural balloon forms.
          </p>

          <div className="gallery-honesty-banner">
            <Sparkles size={16} className="text-amber-600 flex-shrink-0" />
            <p className="banner-text">
              <strong>Demonstration Standard:</strong> All photography is licensed via Unsplash for editorial concept demonstration. These assets illustrate design palettes and layout architecture; they do not represent commercial work completed by A3Y Solutions.
            </p>
          </div>
        </div>

        {/* Category Filters with Real Buttons and Accessible Result Count */}
        <div className="gallery-filter-bar">
          <div className="filter-label-group">
            <Filter size={15} className="text-neutral-500" />
            <span className="filter-group-title">Filter by Theme:</span>
          </div>

          <div className="gallery-filter-buttons" role="tablist" aria-label="Lookbook category filters">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === opt.id}
                className={`filter-btn ${activeFilter === opt.id ? 'active' : ''}`}
                onClick={() => handleFilterChange(opt.id)}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Screen reader announcement for filter changes */}
          <div className="sr-only" aria-live="polite">
            Showing {filteredAssets.length} items for {activeFilter} filter
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredAssets.map((asset, idx) => (
            <article
              key={asset.id}
              className="gallery-item-card"
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
              aria-label={`Open detailed view for ${asset.title}`}
            >
              <div className="gallery-thumb-wrap">
                <DecorArtwork asset={asset} variant="thumb" />
              </div>

              <div className="gallery-card-body">
                <div className="card-top-row">
                  <span className="card-category-tag">{asset.categoryLabel}</span>
                  <span className="card-demo-pill">Inspiration Plate</span>
                </div>

                <h2 className="gallery-card-title">{asset.title}</h2>
                <p className="gallery-card-caption">{asset.caption}</p>

                <div className="gallery-card-action">
                  <span>View Plate Details</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Accessible Lightbox Modal */}
        <Lightbox
          asset={currentAsset}
          isOpen={selectedAssetIndex !== null}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
          hasPrev={selectedAssetIndex !== null && selectedAssetIndex > 0}
          hasNext={selectedAssetIndex !== null && selectedAssetIndex < filteredAssets.length - 1}
        />
      </div>
    </main>
  );
};
