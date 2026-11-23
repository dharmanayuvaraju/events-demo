import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../data/business';
import { Phone, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <header className="site-header" role="banner">
        <div className="container header-inner">
          {/* Brand Wordmark */}
          <Link to="/" className="brand-wordmark" aria-label="Colors Events & Entertainment Home">
            <span className="brand-name">Colors Events</span>
            <span className="brand-locality">Kukatpally</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="nav-links-desktop" aria-label="Main Navigation">
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Reel
            </NavLink>
            <NavLink
              to="/decorations"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Decorations
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Inquire
            </NavLink>
          </nav>

          {/* Header Action Controls */}
          <div className="header-actions">
            {/* Concept preview badge */}
            <span className="concept-preview-pill hidden sm:inline-flex" title="Unapproved client preview draft">
              {BUSINESS_CONFIG.previewNotice.badgeText}
            </span>

            {/* Direct Phone Call Action (44px target minimum) */}
            <a
              href={BUSINESS_CONFIG.callHref}
              className="btn-call-compact"
              aria-label={`Call Colors Events at ${BUSINESS_CONFIG.phone}`}
            >
              <Phone size={16} />
              <span className="hidden md:inline">Call Us</span>
            </a>

            {/* Mobile Hamburger Toggle (44px target) */}
            <button
              type="button"
              className="btn-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div id="mobile-nav-menu" className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">Directory</span>
            <span className="concept-preview-pill">{BUSINESS_CONFIG.previewNotice.badgeText}</span>
          </div>

          <ul className="mobile-nav-list">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                end
              >
                <span>01. Home &amp; Reel</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/decorations"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <span>02. Decoration Themes</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gallery"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <span>03. Portfolio Gallery</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <span>04. About Our Focus</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <span>05. Plan Celebration</span>
              </NavLink>
            </li>
          </ul>

          <div className="mobile-drawer-footer">
            <a
              href={BUSINESS_CONFIG.callHref}
              className="btn-primary w-full text-center flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              <span>Call {BUSINESS_CONFIG.phone}</span>
            </a>
            <p className="text-xs opacity-60 text-center">
              {BUSINESS_CONFIG.location.landmark}, Kukatpally, Hyderabad
            </p>
          </div>
        </div>
      )}
    </>
  );
};
