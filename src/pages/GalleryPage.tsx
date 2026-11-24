import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ASSETS_MANIFEST, PortfolioAsset } from '../data/assetsManifest';
import { DecorArtwork } from '../components/DecorArtwork';
import { Lightbox } from '../components/Lightbox';
import { ArrowUpRight, Camera, Sparkles } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') || 'all';

  const [activeFilter, setActiveFilter] = useState<string>(filterParam);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number | null>(null);

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
    if (activeFilter === 'maps') return ASSETS_MANIFEST.filter((item) => item.status === 'verified_maps_photo');
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

  // Compute category counts
  const counts = useMemo(() => {
    return {
      all: ASSETS_MANIFEST.length,
      maps: ASSETS_MANIFEST.filter((i) => i.status === 'verified_maps_photo').length,
      birthday: ASSETS_MANIFEST.filter((i) => i.category === 'birthday').length,
      wedding: ASSETS_MANIFEST.filter((i) => i.category === 'wedding').length,
      balloons: ASSETS_MANIFEST.filter((i) => i.category === 'balloons').length,
      flowers: ASSETS_MANIFEST.filter((i) => i.category === 'flowers').length,
    };
  }, []);

  return (
    <div className="section-paper">
      <div className="container">
        {/* Header */}
        <div className="section-header max-w-3xl mb-8">
          <span className="section-label">Portfolio &amp; Verified Works</span>
          <h1 className="section-title">Decor Portfolio &amp; Visual Plates</h1>
          <p className="section-lead">
            Explore our curated celebration staging, combining authentic setup photography from our Kukatpally Google Maps listing with bespoke designs across birthday, wedding, balloon, and flower themes.
          </p>
        </div>

        {/* Category Filters */}
        <div className="gallery-filters" role="tablist" aria-label="Gallery Category Filters">
          {[
            { id: 'all', label: `All Portfolio (${counts.all})` },
            { id: 'maps', label: `Verified Local (${counts.maps})`, isHighlight: true },
            { id: 'birthday', label: `Birthday (${counts.birthday})` },
            { id: 'wedding', label: `Wedding (${counts.wedding})` },
            { id: 'balloons', label: `Balloons (${counts.balloons})` },
            { id: 'flowers', label: `Flowers (${counts.flowers})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === tab.id}
              className={`filter-btn ${activeFilter === tab.id ? 'active' : ''} ${
                tab.isHighlight ? 'border-amber-500 font-bold' : ''
              }`}
              onClick={() => handleFilterChange(tab.id)}
            >
              <span className="flex items-center gap-1.5">
                {tab.isHighlight ? (
                  <Camera size={14} className="text-amber-600" />
                ) : (
                  <Sparkles size={13} className="opacity-70" />
                )}
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredAssets.map((asset, idx) => (
            <article
              key={asset.id}
              className="gallery-card group"
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
              aria-label={`Open visual plate details: ${asset.title}`}
            >
              <div className="gallery-thumb-wrap">
                <DecorArtwork asset={asset} variant="thumb" />
              </div>

              <div className="gallery-card-body">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`pending-label ${
                      asset.status === 'verified_maps_photo'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : ''
                    }`}
                  >
                    {asset.status === 'verified_maps_photo' ? (
                      <span className="flex items-center gap-1">
                        <Camera size={11} className="text-amber-700" />
                        <span>{asset.statusLabel}</span>
                      </span>
                    ) : (
                      asset.statusLabel
                    )}
                  </span>
                  <span className="text-[11px] uppercase font-bold opacity-50">
                    {asset.category}
                  </span>
                </div>

                <h2 className="gallery-card-title">{asset.title}</h2>
                <p className="gallery-card-meta">{asset.spec.recommendedVenue}</p>

                <div className="mt-2 flex items-center justify-between text-xs font-bold text-coral group-hover:underline">
                  <span>View Full Details</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Lightbox Component with Native <dialog> Modal semantics */}
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
    </div>
  );
};
