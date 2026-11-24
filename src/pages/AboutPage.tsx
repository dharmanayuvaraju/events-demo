import React from 'react';
import { BUSINESS_CONFIG } from '../data/business';
import { LAUNCH_CHECKLIST } from '../data/launchChecklist';
import { Star, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="section-paper">
      <div className="container">
        {/* Header */}
        <div className="section-header max-w-3xl mb-12">
          <span className="section-label">Locality &amp; Focus</span>
          <h1 className="section-title">About Colors Events &amp; Entertainment</h1>
          <p className="section-lead">
            A dedicated event decoration studio centered in Kukatpally, Hyderabad, focused on creating memorable stages for birthdays, weddings, balloon arches, and fresh flower ceremonies.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="p-8 rounded border border-neutral-300 bg-[#FFFDF9] shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-4">Our Decoration Focus</h2>
            <p className="text-sm opacity-85 leading-relaxed mb-4">
              Rather than attempting to coordinate full-scale catering, DJ entertainment, or photography packages, Colors Events focuses strictly on decor artistry and stage aesthetics.
            </p>
            <ul className="space-y-3 text-sm opacity-85">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-leaf flex-shrink-0 mt-0.5" />
                <span><strong>Specialized Craft:</strong> Precise balloon cluster gradients, balanced fabric canopies, and fresh seasonal florals.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-leaf flex-shrink-0 mt-0.5" />
                <span><strong>On-Time Staging:</strong> Early venue arrival ensuring full setup completion before family members arrive.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-leaf flex-shrink-0 mt-0.5" />
                <span><strong>Property Protection:</strong> Gentle non-marking tape, tension frames, and floor protectors to respect venue deposits.</span>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded border border-neutral-300 bg-[#FFFDF9] shadow-sm">
            <h2 className="font-serif text-2xl font-bold mb-4">Hyper-Local Kukatpally Presence</h2>
            <p className="text-sm opacity-85 leading-relaxed mb-4">
              Positioned near the landmark Ramalayam Temple on HMT Road, Mahankali Nagar, our proximity enables swift venue walkthroughs and prompt setup across:
            </p>
            <ul className="space-y-2 text-sm opacity-85 mb-6">
              <li>&bull; Kukatpally &amp; KPHB Colony</li>
              <li>&bull; Shamshiguda &amp; Tulasi Nagar</li>
              <li>&bull; Mahankali Nagar &amp; HMT Road residential layouts</li>
              <li>&bull; Nizampet, Bachupally &amp; Miyapur surrounding areas</li>
            </ul>

            <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 leading-normal">
              <strong>Entity Distinction:</strong> Note that <em>colorsevents.in</em> is an unrelated Odisha entity. Colors Events &amp; Entertainment is an independent local business in Kukatpally, Hyderabad.
            </div>
          </div>
        </div>

        {/* Verified Listing & Reputation */}
        <div className="p-8 rounded border border-neutral-300 bg-[#FAF4EB] mb-16 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="section-label">Verified Record</span>
              <h2 className="font-serif text-2xl font-bold mb-2">Google Maps Business Listing</h2>
              <p className="text-sm opacity-80 max-w-xl">
                The public Google listing recorded a 4.6 / 5.0 score from 20 verified local reviews on 23 November 2026.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-2xl font-bold font-serif text-amber-600">
                  <Star size={22} fill="#D97706" />
                  <span>4.6 / 5.0</span>
                </div>
                <div className="text-xs opacity-60">checked 23 Nov 2026</div>
              </div>

              <a
                href={BUSINESS_CONFIG.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Inspect Google Listing
              </a>
            </div>
          </div>
        </div>

        {/* Authentic Local Staging Photography */}
        <div className="p-8 rounded border border-neutral-300 bg-[#FFFDF9] mb-16 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="section-label">Field Execution</span>
              <h2 className="font-serif text-2xl font-bold">Local Staging &amp; Venue Transformations</h2>
              <p className="text-sm opacity-80 mt-1 max-w-xl">
                Photographs from our verified Google Maps profile showcasing real event stages, organic balloon installations, and fabric canopies in Kukatpally.
              </p>
            </div>
            <a
              href={BUSINESS_CONFIG.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary self-start md:self-auto"
            >
              Verify on Google Maps
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded overflow-hidden border border-neutral-300 bg-neutral-900 shadow-sm">
              <img
                src="/portfolio/maps_photo_stage_2.jpg"
                alt="1st Birthday Safari Stage with 3D animal props in Kukatpally"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-5 bg-white">
                <span className="text-[11px] font-bold uppercase text-amber-800 bg-amber-100 px-2.5 py-1 rounded inline-flex items-center gap-1 mb-2">
                  <MapPin size={11} />
                  <span>Verified Kukatpally Setup</span>
                </span>
                <h3 className="font-serif font-bold text-lg">1st Birthday Safari Jungle Stage</h3>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  Experiential milestone birthday stage featuring 3D animal props (Giraffe, Elephant, Zebra), illuminated marquee lettering, multi-tier balloon framing, and ceiling fabric drapery.
                </p>
              </div>
            </div>

            <div className="rounded overflow-hidden border border-neutral-300 bg-neutral-900 shadow-sm">
              <img
                src="/portfolio/maps_photo_1.jpg"
                alt="Colors Events celebration panorama setup"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-5 bg-white">
                <span className="text-[11px] font-bold uppercase text-amber-800 bg-amber-100 px-2.5 py-1 rounded inline-flex items-center gap-1 mb-2">
                  <MapPin size={11} />
                  <span>Verified Kukatpally Setup</span>
                </span>
                <h3 className="font-serif font-bold text-lg">Panoramic Celebration Dais &amp; Backdrop</h3>
                <p className="text-xs opacity-75 mt-1 leading-relaxed">
                  Wide celebration stage framing with ceremonial drapery, coordinated arch styling, and warm ambient stage lighting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client Launch Checklist & Blocker Table */}
        <div className="p-8 rounded border border-neutral-300 bg-[#FFFDF9] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={24} className="text-coral" />
            <h2 className="font-serif text-2xl font-bold">Launch Readiness &amp; Governance</h2>
          </div>
          <p className="text-sm opacity-85 leading-relaxed mb-6">
            This site is structured with rigorous honesty. Before public release, the following items require client sign-off:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-300 bg-neutral-100">
                  <th className="p-3 font-semibold">Requirement</th>
                  <th className="p-3 font-semibold">Current State</th>
                  <th className="p-3 font-semibold">Resolution Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {LAUNCH_CHECKLIST.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3 text-xs opacity-80">{item.status}</td>
                    <td className="p-3 text-xs">{item.actionRequired}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
