import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { A3Y_CONFIG } from '../data/config';
import { Phone, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const firstDrawerFocusRef = useRef<HTMLAnchorElement>(null);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  // Manage body scroll locking and keyboard Escape / Tab focus trap when drawer is open
  useEffect(() => {
    if (!isDrawerOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the first link in drawer
    setTimeout(() => {
      firstDrawerFocusRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/decorations', label: 'Themes' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Planner & Contact' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <header className="site-header" role="banner">
        <div className="container header-inner">
          {/* Left: Brand Wordmark & Concept Demo Pill */}
          <div className="header-brand-wrap">
            <Link to="/" className="header-brand" aria-label="A3Y Celebrations Home">
              <span className="brand-primary">{A3Y_CONFIG.conceptName}</span>
            </Link>
            <span className="header-demo-pill" title="Fictional concept demonstration">
              {A3Y_CONFIG.conceptBadge}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Primary Navigation">
            <ul className="nav-list">
              {navLinks.map((item) => (
                <li key={item.to} className="nav-item">
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    end={item.to === '/'}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Header Action: Developer Contact */}
          <div className="header-actions">
            <a
              href={A3Y_CONFIG.developer.callHref}
              className="header-contact-btn"
              aria-label={`${A3Y_CONFIG.developer.label}: call ${A3Y_CONFIG.developer.phone}`}
              title={A3Y_CONFIG.developer.label}
            >
              <Phone size={15} />
              <span className="contact-btn-text">Contact A3Y</span>
            </a>

            {/* Mobile Menu Toggle Button (44px target) */}
            <button
              ref={toggleBtnRef}
              type="button"
              className="mobile-menu-toggle"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={isDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setIsDrawerOpen((prev) => !prev)}
            >
              {isDrawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Drawer Navigation */}
      {isDrawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => {
            setIsDrawerOpen(false);
            toggleBtnRef.current?.focus();
          }}
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-navigation-drawer"
        ref={drawerRef}
        className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        tabIndex={-1}
      >
        <div className="drawer-header">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg">{A3Y_CONFIG.conceptName}</span>
            <span className="header-demo-pill">{A3Y_CONFIG.conceptBadge}</span>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            aria-label="Close navigation menu"
            onClick={() => {
              setIsDrawerOpen(false);
              toggleBtnRef.current?.focus();
            }}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="drawer-nav" aria-label="Mobile Navigation">
          <ul className="drawer-list">
            {navLinks.map((item, idx) => (
              <li key={item.to} className="drawer-item">
                <NavLink
                  ref={idx === 0 ? firstDrawerFocusRef : undefined}
                  to={item.to}
                  className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
                  end={item.to === '/'}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer Developer Contact Footer */}
        <div className="drawer-footer">
          <div className="text-xs uppercase tracking-wider font-semibold opacity-60 mb-2">
            Developer Inquiries
          </div>
          <a
            href={A3Y_CONFIG.developer.callHref}
            className="btn-primary w-full text-center inline-flex items-center justify-center gap-2"
          >
            <Phone size={15} />
            <span>Call Yuvaraj ({A3Y_CONFIG.developer.phone})</span>
          </a>
          <p className="text-[11px] opacity-70 mt-2 text-center leading-normal">
            {A3Y_CONFIG.developer.label}
          </p>
        </div>
      </div>
    </>
  );
};
