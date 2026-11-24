import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  materials: string[];
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'ceremonies',
    index: '01',
    title: 'Sacred Ceremonies',
    subtitle: 'Mandaps & Ritual Altars',
    summary: 'Architectural pavilions framed in seasoned timber, natural linen, and hand-strung marigold garlands.',
    materials: ['Seasoned Teak', 'Auspicious Florals', 'Natural Linen'],
  },
  {
    id: 'milestones',
    index: '02',
    title: 'Milestone Staging',
    subtitle: 'Receptions & Anniversaries',
    summary: 'Intimate circular stages, ambient suspended candlelight, and bespoke seating for multi-generational joy.',
    materials: ['Curved Portals', 'Ambient Lanterns', 'Loomed Fabrics'],
  },
  {
    id: 'florals',
    index: '03',
    title: 'Botanical Architecture',
    subtitle: 'Torans & Sculptural Arches',
    summary: 'Organic botanical cascades, scented jasmine strings, and sculptural arrangements celebrating native blooms.',
    materials: ['Fresh Jasmine', 'Local Tuberose', 'Verdant Foliage'],
  },
  {
    id: 'ambient',
    index: '04',
    title: 'Ambient Illumination',
    subtitle: 'Evening Canopies & Banquets',
    summary: 'Warm fairy-light canopies, floating candle pools, and delicate architectural uplighting under open skies.',
    materials: ['Warm Glow (2700K)', 'Floating Votives', 'Open Pergolas'],
  },
];

export const CategoryOverview: React.FC = () => {
  return (
    <section className="section-category-overview" aria-labelledby="cat-overview-heading">
      <div className="container">
        {/* Section Header */}
        <div className="cat-overview-header">
          <span className="section-label">Spatial Disciplines</span>
          <h2 id="cat-overview-heading" className="section-title">
            Celebration staging conceived with architectural clarity.
          </h2>
          <p className="section-lead max-w-2xl">
            Four specialized design scopes tailored for sacred ceremonies, milestone celebrations, and evening banquet atmospheres.
          </p>
        </div>

        {/* 4-Column Category Grid */}
        <div className="cat-grid">
          {CATEGORIES.map((item) => (
            <article key={item.id} className="cat-card">
              <div className="cat-card-top">
                <span className="cat-index">{item.index}</span>
                <span className="cat-subtitle">{item.subtitle}</span>
              </div>

              <h3 className="cat-title">{item.title}</h3>
              <p className="cat-summary">{item.summary}</p>

              <div className="cat-materials">
                {item.materials.map((mat) => (
                  <span key={mat} className="cat-mat-pill">
                    {mat}
                  </span>
                ))}
              </div>

              <div className="cat-card-link-wrap">
                <Link
                  to={`/decorations#${item.id}`}
                  className="cat-card-link"
                  aria-label={`View ${item.title} design specifications`}
                >
                  <span>Explore discipline</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
