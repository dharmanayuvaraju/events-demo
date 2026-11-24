import React from 'react';
import { Link } from 'react-router-dom';
import { A3Y_CONFIG } from '../data/config';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-compact-wrap">
          {/* Top Row: Concept Brand & Quick Links */}
          <div className="footer-top-row">
            <div className="footer-brand-info">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-serif font-bold text-lg tracking-tight text-ivory">
                  {A3Y_CONFIG.conceptName}
                </span>
                <span className="header-demo-pill text-[10px]">{A3Y_CONFIG.conceptBadge}</span>
              </div>
              <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                {A3Y_CONFIG.footerNotice}
              </p>
            </div>

            <nav className="footer-compact-nav" aria-label="Footer navigation">
              <Link to="/" className="footer-compact-link">Home</Link>
              <Link to="/decorations" className="footer-compact-link">Themes</Link>
              <Link to="/story" className="footer-compact-link">Story</Link>
              <Link to="/gallery" className="footer-compact-link">Gallery</Link>
              <Link to="/contact" className="footer-compact-link">Contact</Link>
              <Link to="/about" className="footer-compact-link">About</Link>
            </nav>
          </div>

          {/* Bottom Row: Direct Engineering Credit & Legal */}
          <div className="footer-bottom-row">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <ShieldCheck size={13} className="text-leaf flex-shrink-0" />
              <span>Concept showcase by {A3Y_CONFIG.developer.name} ({A3Y_CONFIG.creator}) &bull; <a href={A3Y_CONFIG.developer.callHref} className="hover:text-gold transition-colors font-medium">{A3Y_CONFIG.developer.phone}</a></span>
            </div>

            <div className="text-[11px] text-neutral-500">
              &copy; {new Date().getFullYear()} {A3Y_CONFIG.creator}. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
