import React from 'react';
import { Link } from 'react-router-dom';
import { A3Y_CONFIG } from '../data/config';
import { Phone, ArrowUpRight, Code, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        {/* Main Footer Grid */}
        <div className="footer-grid">
          {/* Brand & Concept Identity Column */}
          <div className="footer-brand-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-serif font-bold text-2xl tracking-tight text-ink">
                {A3Y_CONFIG.conceptName}
              </span>
              <span className="header-demo-pill">{A3Y_CONFIG.conceptBadge}</span>
            </div>
            
            <p className="footer-lead">
              {A3Y_CONFIG.tagline}
            </p>

            {/* Mandatory Fictional Concept Disclaimer */}
            <p className="footer-concept-notice">
              {A3Y_CONFIG.footerNotice}
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">Demonstration Pages</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/" className="footer-nav-link">Home (Atmospheres &amp; Accordion)</Link>
              </li>
              <li>
                <Link to="/decorations" className="footer-nav-link">Spatial Disciplines &amp; Specs</Link>
              </li>
              <li>
                <Link to="/gallery" className="footer-nav-link">Visual Lookbook &amp; Lightbox</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-nav-link">Interactive Event Planner</Link>
              </li>
              <li>
                <Link to="/about" className="footer-nav-link">Studio Philosophy &amp; Architecture</Link>
              </li>
            </ul>
          </div>

          {/* Developer Contact & Inquiries */}
          <div className="footer-contact-col">
            <h4 className="footer-col-title">Developer Contact</h4>
            <div className="footer-contact-card">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-1">
                <Code size={14} className="text-leaf" />
                <span>{A3Y_CONFIG.developer.role}</span>
              </div>
              <div className="font-serif font-bold text-base text-ink mb-1">
                {A3Y_CONFIG.developer.name} &bull; {A3Y_CONFIG.creator}
              </div>
              <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                {A3Y_CONFIG.developer.note}
              </p>
              
              <a
                href={A3Y_CONFIG.developer.callHref}
                className="footer-phone-btn"
                aria-label={`${A3Y_CONFIG.developer.label}: call ${A3Y_CONFIG.developer.phone}`}
              >
                <Phone size={14} />
                <span>Call {A3Y_CONFIG.developer.phone}</span>
                <ArrowUpRight size={14} />
              </a>
              <span className="text-[11px] text-neutral-500 block mt-1.5">
                {A3Y_CONFIG.developer.label}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <ShieldCheck size={14} className="text-leaf" />
            <span>Clean Architecture &bull; Accessible Semantic HTML &bull; Zero External Trackers</span>
          </div>

          <div className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} {A3Y_CONFIG.creator}. All rights reserved. Self-initiated design concept demo.
          </div>
        </div>
      </div>
    </footer>
  );
};
