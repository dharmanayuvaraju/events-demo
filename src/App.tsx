import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DecorationsPage } from './pages/DecorationsPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Scroll to top and set document title on navigation
const RouteHandler: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Only scroll to top if there is no hash
    if (!location.hash) {
      window.scrollTo(0, 0);
    }

    // Dynamic document title update for A3Y Celebrations
    switch (location.pathname) {
      case '/':
        document.title = 'A3Y Celebrations | Concept Studio Demo';
        break;
      case '/decorations':
        document.title = 'Themes & Architectural Scope | A3Y Celebrations';
        break;
      case '/gallery':
        document.title = 'Visual Lookbook & Plates | A3Y Celebrations';
        break;
      case '/about':
        document.title = 'Concept & Engineering Notes | A3Y Celebrations';
        break;
      case '/contact':
        document.title = 'Interactive Event Planner & Contact | A3Y Celebrations';
        break;
      default:
        document.title = 'A3Y Celebrations | Event Studio Concept Demo';
    }
  }, [location.pathname, location.hash]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <RouteHandler />

      <div className="app-wrapper">
        <Header />
        <div className="app-content-body">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/decorations" element={<DecorationsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Direct fallback to home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
