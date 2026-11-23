import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { REEL_CHAPTERS } from '../data/chapters';
import { ASSETS_MANIFEST } from '../data/assetsManifest';
import { DecorArtwork } from '../components/DecorArtwork';
import { ArrowUpRight, Check, ShieldAlert } from 'lucide-react';

export const DecorationsPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // If navigating to hash anchor, smooth scroll to it
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="section-paper">
      <div className="container">
        {/* Page Header */}
        <div className="section-header max-w-3xl mb-12">
          <span className="section-label">Decoration Themes &amp; Scope</span>
          <h1 className="section-title">
            Tailored Celebration Backdrops in Kukatpally
          </h1>
          <p className="section-lead">
            Every celebration in Hyderabad is unique. We specialize exclusively in four core decoration domains, focusing on stage proportions, balanced colors, and prompt setup.
          </p>
        </div>

        {/* Clear Policy Guardrail Alert */}
        <div className="p-4 rounded border border-amber-300 bg-amber-50 mb-14 flex items-start gap-3">
          <ShieldAlert size={20} className="text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm text-amber-900 leading-relaxed">
            <strong>Verified Scope Policy:</strong> We provide decor styling for birthdays, weddings, balloons, and fresh flowers only. We do not provide or broker corporate conferences, catering, DJ sound systems, event photography, destination weddings, or celebrity bookings.
          </div>
        </div>

        {/* Four Themes Detailed Sections */}
        <div className="space-y-16">
          {REEL_CHAPTERS.map((theme) => {
            const matchingAsset = ASSETS_MANIFEST.find((a) => a.category === theme.id);

            return (
              <section
                key={theme.id}
                id={theme.id}
                className="p-6 md:p-10 rounded border border-neutral-300 bg-[#FFFDF9] scroll-mt-24"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Scope Details */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-serif font-bold text-lg text-coral">
                        Chapter {theme.index}
                      </span>
                      <span className="text-xs uppercase tracking-wider font-semibold opacity-60">
                        Specialized Decor
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl md:text-4xl font-bold mb-4">
                      {theme.name}
                    </h2>

                    <p className="text-base opacity-85 leading-relaxed mb-6">
                      {theme.scopeLine}
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-start gap-3 text-sm">
                        <Check size={18} className="text-leaf flex-shrink-0 mt-0.5" />
                        <span><strong>Ideal Occasions:</strong> {theme.ticketNote}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Check size={18} className="text-leaf flex-shrink-0 mt-0.5" />
                        <span><strong>Venue Versatility:</strong> Sized for apartment halls, gated community clubhouses, terrace areas, and local temple halls in Kukatpally.</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm">
                        <Check size={18} className="text-leaf flex-shrink-0 mt-0.5" />
                        <span><strong>Fastening Discipline:</strong> Non-damaging ties, weighted bases, and clean venue wall care.</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        to={`/contact?category=${theme.id}`}
                        className="btn-primary"
                      >
                        <span>Inquire {theme.name.split(' ')[0]} Decor</span>
                        <ArrowUpRight size={16} className="ml-1" />
                      </Link>

                      <Link
                        to={`/gallery?filter=${theme.id}`}
                        className="btn-secondary"
                      >
                        View Concept Visuals
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Visual Concept Plate */}
                  <div className="lg:col-span-5">
                    <div className="rounded border border-neutral-300 overflow-hidden shadow-sm bg-neutral-900">
                      <DecorArtwork asset={matchingAsset} themeId={theme.id} variant="full" />
                    </div>
                    <div className="text-[11px] opacity-70 mt-2 text-center">
                      *Featured portfolio styling for {theme.name} in Kukatpally and nearby Hyderabad party halls.
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
