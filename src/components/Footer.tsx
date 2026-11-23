import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../data/business';
import { Star, MapPin, Phone, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Business Identification & Locality */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="footer-brand-title">{BUSINESS_CONFIG.name}</h2>
              <span className="concept-preview-pill light">
                {BUSINESS_CONFIG.previewNotice.badgeText}
              </span>
            </div>
            <p className="footer-text mb-4">
              Local event decor studio specializing exclusively in birthday, wedding, balloon, and flower decorations across Kukatpally and neighboring Hyderabad localities.
            </p>
            
            <div className="flex items-start gap-2 text-xs opacity-80 mb-2">
              <MapPin size={16} className="flex-shrink-0 mt-0.5 text-coral" />
              <span>{BUSINESS_CONFIG.location.fullText}</span>
            </div>

            <div className="flex items-center gap-2 text-xs opacity-80">
              <Phone size={16} className="flex-shrink-0 text-coral" />
              <a href={BUSINESS_CONFIG.callHref} className="hover:underline">
                Direct phone: {BUSINESS_CONFIG.phone}
              </a>
            </div>
          </div>

          {/* Column 2: Supported Decoration Scope */}
          <div>
            <h3 className="footer-heading">Decoration Themes</h3>
            <ul className="footer-links">
              <li>
                <Link to="/decorations#birthday" className="footer-link">
                  Birthday Decorations
                </Link>
              </li>
              <li>
                <Link to="/decorations#wedding" className="footer-link">
                  Wedding Decorations
                </Link>
              </li>
              <li>
                <Link to="/decorations#balloons" className="footer-link">
                  Balloon Decorations
                </Link>
              </li>
              <li>
                <Link to="/decorations#flowers" className="footer-link">
                  Flower Decorations
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="footer-link">
                  Visual Gallery Plates
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Verified Listing & Google Reviews Card */}
          <div>
            <h3 className="footer-heading">Verified Listing</h3>
            <div className="google-rating-card mb-4">
              <div className="rating-badge">
                <Star size={18} fill="#E5AC32" stroke="#E5AC32" />
                <span>{BUSINESS_CONFIG.reputation.rating} / 5.0</span>
              </div>
              <div className="text-xs opacity-85 mb-2">
                Based on {BUSINESS_CONFIG.reputation.reviewCount} customer reviews
              </div>
              <div className="rating-label mb-3">
                {BUSINESS_CONFIG.reputation.label}
              </div>
              <a
                href={BUSINESS_CONFIG.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold hover:underline"
              >
                <span>{BUSINESS_CONFIG.reputation.mapsLinkText}</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className="text-[11px] opacity-60 leading-relaxed">
              <strong>Verification Notice:</strong> This website is an unapproved client preview for Colors Events &amp; Entertainment (Kukatpally, Hyderabad). Unverified emails, hours, and unrelated external businesses (including colorsevents.in) are strictly omitted.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Checklist Status */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} {BUSINESS_CONFIG.name}. Concept preview draft.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:underline">About Studio</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:underline">Planning Process</Link>
            <span>&bull;</span>
            <a
              href={BUSINESS_CONFIG.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Google Maps Location
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
