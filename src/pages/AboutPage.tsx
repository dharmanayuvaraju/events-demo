import React from 'react';
import { A3Y_CONFIG } from '../data/config';
import { Phone, Code2, Palette, Shield, Layers, Layout, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <main id="main-content" className="section-paper">
      <div className="container">
        {/* Header */}
        <div className="section-header max-w-3xl mb-12">
          <span className="section-label">Concept &amp; Engineering</span>
          <h1 className="section-title">About the A3Y Concept</h1>
          <p className="section-lead">
            A fictional celebration-studio web application engineered by {A3Y_CONFIG.creator} to demonstrate calm wedding-editorial art direction, responsive interactive layouts, and accessible frontend architecture.
          </p>
        </div>

        {/* Identity & Scope Distinction */}
        <div className="about-callout-card mb-14">
          <div className="flex items-start gap-3">
            <Shield size={22} className="text-leaf flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-serif font-bold text-xl mb-2 text-ink">
                Concept Demonstration Scope &amp; Transparency
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed mb-3">
                <strong>{A3Y_CONFIG.conceptName}</strong> is a self-initiated digital design concept by <strong>{A3Y_CONFIG.creator}</strong>. It is not an operational event management company, does not accept commercial bookings, and has zero affiliation with physical event vendors.
              </p>
              <p className="text-xs text-neutral-600 leading-relaxed">
                All visual plates are curated from licensed photographic repositories (Unsplash) with full photographer attributions to demonstrate editorial layout hierarchies, tactile interactions, and responsive typography.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Architecture Grid */}
        <div className="about-features-grid mb-16">
          <div className="feature-block-card">
            <div className="feature-icon">
              <Palette size={22} className="text-leaf" />
            </div>
            <h3 className="feature-title">Calm Wedding Editorial Palette</h3>
            <p className="feature-text">
              Composed with warm ivory (#FAF7F2), deep forest green (#1F2921), and restrained warm gold (#C29B68) accents. Typography pairs high-contrast Fraunces serif for display headings with Plus Jakarta Sans for clean reading.
            </p>
          </div>

          <div className="feature-block-card">
            <div className="feature-icon">
              <Layout size={22} className="text-leaf" />
            </div>
            <h3 className="feature-title">Expanding Photo Accordion</h3>
            <p className="feature-text">
              Features 7 tall desktop panels with staggered heights (490px–540px), vertical typography on inactive panels, and smooth 550ms horizontal expansion on hover or focus, plus a touch-friendly card strip on mobile.
            </p>
          </div>

          <div className="feature-block-card">
            <div className="feature-icon">
              <Layers size={22} className="text-leaf" />
            </div>
            <h3 className="feature-title">Tactile Photo Wall Mosaic</h3>
            <p className="feature-text">
              An asymmetrical 9-tile photo wall with bounded pointer-pan interaction, gentle continuous drift, an accessible motion pause toggle, and native HTML5 &lt;dialog&gt; lightbox over a deep green backdrop.
            </p>
          </div>

          <div className="feature-block-card">
            <div className="feature-icon">
              <Code2 size={22} className="text-leaf" />
            </div>
            <h3 className="feature-title">Strict TypeScript &amp; a11y</h3>
            <p className="feature-text">
              Type-safe React codebase with strict compilation. Implements accessible keyboard navigation, ARIA landmarks, and native HTML5 &lt;dialog&gt; modals with focus management.
            </p>
          </div>
        </div>

        {/* Developer Contact Card */}
        <div className="developer-profile-section">
          <div className="profile-inner-grid">
            <div>
              <span className="section-label">Engineering &amp; Design Lead</span>
              <h2 className="font-serif font-bold text-3xl mb-3 text-ink">
                Built by {A3Y_CONFIG.developer.name}
              </h2>
              <p className="text-sm text-neutral-700 leading-relaxed mb-6 max-w-xl">
                {A3Y_CONFIG.developer.role} at <strong>{A3Y_CONFIG.creator}</strong>. Specialized in high-performance React web applications, bespoke editorial design systems, and responsive web platforms.
              </p>

              <div className="developer-cta-row">
                <a
                  href={A3Y_CONFIG.developer.callHref}
                  className="btn-primary"
                  aria-label={`${A3Y_CONFIG.developer.label}: call ${A3Y_CONFIG.developer.phone}`}
                >
                  <Phone size={16} />
                  <span>Call {A3Y_CONFIG.developer.phone}</span>
                </a>
                <span className="text-xs text-neutral-600">
                  {A3Y_CONFIG.developer.label}
                </span>
              </div>
            </div>

            <div className="project-metadata-card">
              <h3 className="font-serif font-bold text-lg mb-3">Project Metadata</h3>
              <dl className="metadata-list">
                <dt>Project Type:</dt>
                <dd>Self-Initiated Concept Demonstration</dd>

                <dt>Frontend Stack:</dt>
                <dd>React 18 &bull; TypeScript &bull; Vite</dd>

                <dt>Visual &amp; Motion:</dt>
                <dd>Semantic CSS &bull; Native Scroll Scrubbing &bull; HTML5 Dialog</dd>

                <dt>Typography:</dt>
                <dd>Fraunces &bull; Plus Jakarta Sans</dd>

                <dt>Developer:</dt>
                <dd>{A3Y_CONFIG.developer.name} (+91 73374 22054)</dd>
              </dl>

              <div className="mt-4 pt-4 border-t border-subtle">
                <Link to="/contact" className="text-xs font-semibold text-ink flex items-center gap-1 hover:text-leaf">
                  <span>Open Interactive Event Planner</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
