import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReelHero } from '../components/ReelHero';
import { MarqueeStrip } from '../components/MarqueeStrip';
import { DecorArtwork } from '../components/DecorArtwork';
import { BUSINESS_CONFIG } from '../data/business';
import { REEL_CHAPTERS } from '../data/chapters';
import { ASSETS_MANIFEST } from '../data/assetsManifest';
import { ArrowUpRight, CheckCircle2, MapPin, Star, Sparkles, Award } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const HomePage: React.FC = () => {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll reveal: staggered rise-fade of lines and cards (20px, 250ms, 60ms stagger)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.reveal-item');
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Curate 6 balanced portfolio items across all 4 themes for home showcase
  const curatedHomeShowcase = [
    ASSETS_MANIFEST.find((a) => a.id === 'decor-wed-grand-mandap') || ASSETS_MANIFEST[0],
    ASSETS_MANIFEST.find((a) => a.id === 'decor-bday-safari-stage') || ASSETS_MANIFEST[1],
    ASSETS_MANIFEST.find((a) => a.id === 'decor-balloon-entrance-arch') || ASSETS_MANIFEST[2],
    ASSETS_MANIFEST.find((a) => a.id === 'decor-flower-temple-toran') || ASSETS_MANIFEST[3],
    ASSETS_MANIFEST.find((a) => a.id === 'decor-bday-pastel-ring') || ASSETS_MANIFEST[4],
    ASSETS_MANIFEST.find((a) => a.id === 'decor-flower-haldi-canopy') || ASSETS_MANIFEST[5],
  ];

  return (
    <div ref={sectionsRef}>
      {/* 1. Reel Hero: Fast-Cut Celebration Reel System */}
      <ReelHero />

      {/* 2. Scrolling Marquee Strip */}
      <MarqueeStrip />

      {/* 3. Editorial Overview & Philosophy: Warm Paper */}
      <section className="section-paper">
        <div className="container">
          <div className="section-header max-w-3xl">
            <span className="section-label">Colors Events &amp; Entertainment</span>
            <h1 className="section-title">
              Make room for a little wonder.
            </h1>
            <p className="section-lead">
              Birthday, wedding, balloon and flower decorations in Kukatpally, Hyderabad. Designed with editorial clarity, balanced color palettes, and respect for your celebration venue.
            </p>
          </div>

          {/* Quick Credibility / Verified Google Listing bar */}
          <div className="p-4 rounded border border-neutral-300 bg-[#FFFDF9] flex flex-wrap items-center justify-between gap-4 mb-12 reveal-item">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-600 font-bold text-lg">
                <Star size={18} fill="#D97706" />
                <span>{BUSINESS_CONFIG.reputation.rating}</span>
              </div>
              <div className="text-xs md:text-sm">
                <strong>Google Listing Verified:</strong> {BUSINESS_CONFIG.reputation.reviewCount} customer reviews as of {BUSINESS_CONFIG.reputation.verifiedDate}.
              </div>
            </div>

            <a
              href={BUSINESS_CONFIG.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:underline"
            >
              <span>{BUSINESS_CONFIG.reputation.mapsLinkText}</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* Service Chapters Grid */}
          <div className="services-editorial-grid">
            {REEL_CHAPTERS.map((chap) => (
              <article key={chap.id} className="service-card reveal-item">
                <div>
                  <div className="service-card-top">
                    <span className="service-card-num">Chapter {chap.index}</span>
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: chap.bgColor }}
                    />
                  </div>

                  <h2 className="service-card-title">{chap.name}</h2>
                  <p className="service-card-desc">{chap.scopeLine}</p>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-xs opacity-70 italic">{chap.ticketNote}</span>
                  <Link
                    to={`/contact?category=${chap.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
                  >
                    <span>Plan {chap.name.split(' ')[0]}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Signature Showcase Spotlight: Authentic Venue Execution */}
      <section className="section-paper" style={{ backgroundColor: '#F6EFE6', borderTop: '1px solid rgba(33, 29, 36, 0.08)', borderBottom: '1px solid rgba(33, 29, 36, 0.08)' }}>
        <div className="container">
          <div className="max-w-3xl mb-10">
            <span className="section-label">Signature Staging Spotlight</span>
            <h2 className="section-title">Authentic Venue Transformations in Hyderabad</h2>
            <p className="section-lead">
              From landmark 1st birthday milestone stages with custom 3D props to traditional floral ceremony mandaps, discover how we transform Kukatpally venues with precision craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature 1: Authentic Safari 1st Birthday Stage */}
            <div className="bg-[#FFFDF9] rounded border border-neutral-300 overflow-hidden shadow-sm reveal-item flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                  <img
                    src="/portfolio/maps_photo_stage_2.jpg"
                    alt="1st Birthday Safari Stage with 3D animal props in Kukatpally"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-amber-600 text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span>Verified Kukatpally Setup</span>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-coral uppercase tracking-wider mb-2">
                    <Sparkles size={14} />
                    <span>Milestone Birthday Staging</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">
                    1st Birthday Jungle Safari Celebration Stage
                  </h3>
                  <p className="text-sm opacity-85 leading-relaxed mb-4">
                    Complete experiential stage setup in Kukatpally featuring 3D life-sized animal props (Giraffe, Elephant, Zebra, Lion), illuminated marquee letters, multi-tier balloon framing, and ceiling fabric swags.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["3D Animal Props", "Marquee Lettering", "Organic Balloon Clusters", "Ceiling Canopy"].map((tag, i) => (
                      <span key={i} className="text-xs bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 md:px-8 pb-6 pt-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <span className="text-xs opacity-75">Banquet Hall &bull; Kukatpally</span>
                <Link
                  to="/contact?category=birthday&title=1st%20Birthday%20Safari%20Stage"
                  className="btn-primary text-xs py-2 px-3"
                >
                  <span>Plan Safari Theme</span>
                  <ArrowUpRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 2: Grand Indian Wedding Mandap */}
            <div className="bg-[#FFFDF9] rounded border border-neutral-300 overflow-hidden shadow-sm reveal-item flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                  <img
                    src="/portfolio/photo_wedding_mandap_grand.jpg"
                    alt="Grand Indian Wedding Stage with traditional marigold floral mandap"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#244AD3] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow flex items-center gap-1.5">
                    <Award size={12} />
                    <span>Grand Ceremony Mandap</span>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-coral uppercase tracking-wider mb-2">
                    <Sparkles size={14} />
                    <span>Wedding &amp; Reception Decor</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold mb-3">
                    Traditional Floral Mandap &amp; Royal Fabric Drapery
                  </h3>
                  <p className="text-sm opacity-85 leading-relaxed mb-4">
                    Grand four-pillar ceremonial mandap adorned with fragrant golden marigold strings, fresh jasmine latkans, royal blue and gold silk drapery, and ceremonial brass urlis.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Four-Pillar Mandap", "Fresh Marigold Strings", "Silk Fabric Drapery", "Brass Diya Staging"].map((tag, i) => (
                      <span key={i} className="text-xs bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 md:px-8 pb-6 pt-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <span className="text-xs opacity-75">Convention Hall &bull; Hyderabad</span>
                <Link
                  to="/contact?category=wedding&title=Grand%20Floral%20Mandap"
                  className="btn-primary text-xs py-2 px-3"
                >
                  <span>Plan Wedding Mandap</span>
                  <ArrowUpRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Visual Gallery Plate Preview */}
      <section className="section-paper" style={{ backgroundColor: '#FAF4EB' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="section-label">Real Celebrations &amp; Concepts</span>
              <h2 className="section-title">Decor Portfolio Showcase</h2>
              <p className="section-lead">
                Explore authentic venue photographs and curated celebration setups for Kukatpally events.
              </p>
            </div>

            <Link to="/gallery" className="btn-secondary self-start md:self-auto">
              View All 12 Portfolio Works
            </Link>
          </div>

          <div className="gallery-grid">
            {curatedHomeShowcase.map((item) => (
              <div key={item.id} className="gallery-card reveal-item">
                <div className="gallery-thumb-wrap">
                  <DecorArtwork asset={item} variant="thumb" />
                </div>
                <div className="gallery-card-body">
                  <div className="flex items-center justify-between">
                    <span className="pending-label">{item.statusLabel}</span>
                    <span className="text-[11px] font-bold uppercase opacity-50">{item.category}</span>
                  </div>
                  <h3 className="gallery-card-title">{item.title}</h3>
                  <p className="gallery-card-meta">{item.spec.recommendedVenue}</p>
                  <Link
                    to={`/contact?category=${item.category}&title=${encodeURIComponent(item.title)}`}
                    className="text-xs font-bold text-coral inline-flex items-center gap-1 mt-2 hover:underline"
                  >
                    <span>Inquire this style</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Proposed Planning Process */}
      <section className="section-paper">
        <div className="container">
          <div className="section-header text-center max-w-2xl mx-auto">
            <span className="section-label">Proposed Workflow</span>
            <h2 className="section-title">How We Plan Together</h2>
            <p className="section-lead mx-auto">
              A transparent, pressure-free planning approach tailored to apartments and venues across Kukatpally.
            </p>
          </div>

          <div className="process-grid">
            <div className="process-step reveal-item">
              <div className="step-num">01</div>
              <h3 className="step-title">Theme &amp; Venue Scoping</h3>
              <p className="step-desc">
                Select your preferred celebration category (birthday, wedding, balloon, or floral) and provide your venue dimensions and timing requirements.
              </p>
            </div>

            <div className="process-step reveal-item">
              <div className="step-num">02</div>
              <h3 className="step-title">Direct Verification</h3>
              <p className="step-desc">
                Review your inquiry summary and connect directly via phone to confirm date feasibility, color options, and exact layout specifications.
              </p>
            </div>

            <div className="process-step reveal-item">
              <div className="step-num">03</div>
              <h3 className="step-title">Punctual On-Site Setup</h3>
              <p className="step-desc">
                On event day, our local crew handles prompt installation, non-damaging anchors, and flawless focal staging well before guests arrive.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/contact" className="btn-primary">
              Start Planning Your Event
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Locality & Contact Finish */}
      <section className="section-paper" style={{ backgroundColor: '#FDFBF7' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="reveal-item">
              <span className="section-label">Locality &amp; Service Radius</span>
              <h2 className="section-title mb-4">
                Rooted in Kukatpally, Mahankali Nagar
              </h2>
              <p className="text-sm opacity-85 leading-relaxed mb-6">
                Located near Ramalayam Temple on HMT Road, we provide dedicated decor coordination across Shamshiguda, Tulasi Nagar, KPHB Colony, Nizampet, and neighboring residential communities.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-coral flex-shrink-0 mt-1" />
                  <div className="text-sm">
                    <strong>Address:</strong> {BUSINESS_CONFIG.location.fullText}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-leaf flex-shrink-0 mt-1" />
                  <div className="text-sm">
                    <strong>Specialization:</strong> Birthday arches, mandap drapery, organic balloons, and temple floral styling.
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={BUSINESS_CONFIG.callHref}
                  className="btn-primary"
                >
                  Call +91 81868 37404
                </a>
                <a
                  href={BUSINESS_CONFIG.location.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  View on Google Maps
                </a>
              </div>
            </div>

            <div className="p-8 rounded border border-neutral-300 bg-[#FFF8EE] shadow-sm reveal-item">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-marigold" />
                <h3 className="font-serif text-xl font-bold">Concept Preview Draft</h3>
              </div>
              <p className="text-sm opacity-85 leading-relaxed mb-4">
                This digital presentation is an unapproved client demonstration for Colors Events &amp; Entertainment. Prior to commercial launch, custom photo rights and inquiry routing will be finalized.
              </p>
              <div className="text-xs opacity-65 leading-normal border-t border-neutral-200 pt-3">
                No corporate events, catering, DJs, photography or destination packages are claimed without explicit client authorization.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
