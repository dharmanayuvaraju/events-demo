import React from 'react';
import { Link } from 'react-router-dom';
import { ScrollTransformation } from '../components/ScrollTransformation';
import { ArrowLeft, Sparkles, ArrowUpRight } from 'lucide-react';
import { A3Y_CONFIG } from '../data/config';

export const StoryPage: React.FC = () => {
  return (
    <main id="main-content" className="section-paper">
      <div className="container pt-6 pb-4">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-neutral-600 hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="header-demo-pill">{A3Y_CONFIG.conceptBadge}</span>
            <span className="text-xs uppercase tracking-wider font-semibold text-leaf">
              Concept Demonstration
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-bold tracking-tight mb-3">
            From a Space to a Celebration
          </h1>
          <p className="text-neutral-700 text-base sm:text-lg leading-relaxed">
            Scroll to explore one imagined wedding setting. Watch how an open garden lawn transforms through floral styling, table details, and ambient evening illumination.
          </p>
          <div className="mt-3 text-xs text-neutral-500 italic">
            Illustrative concept animation. Not a completed A3Y event.
          </div>
        </div>
      </div>

      {/* Full Scroll-Controlled Transformation Experience */}
      <ScrollTransformation />

      {/* Closing Next Steps */}
      <div className="container py-12 border-t border-neutral-200">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-2xl text-ink font-bold mb-3">
            Explore More of the Collection
          </h2>
          <p className="text-neutral-600 text-sm mb-6">
            Review detailed decoration themes with material palettes and spatial specifications, or browse our visual lookbook.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/decorations" className="btn-primary">
              <Sparkles size={16} />
              <span>Explore Themes</span>
            </Link>
            <Link to="/gallery" className="btn-secondary">
              <span>View All Inspiration</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StoryPage;
