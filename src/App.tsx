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

    // Dynamic document title update
    switch (location.pathname) {
      case '/':
        document.title = 'Colors Events & Entertainment | Kukatpally, Hyderabad';
        break;
      case '/decorations':
        document.title = 'Decoration Themes & Scope | Colors Events Kukatpally';
        break;
      case '/gallery':
        document.title = 'Visual Portfolio Gallery | Colors Events Kukatpally';
        break;
      case '/about':
        document.title = 'About Studio & Locality | Colors Events Kukatpally';
        break;
      case '/contact':
        document.title = 'Plan Your Celebration | Colors Events Kukatpally';
        break;
      default:
        document.title = 'Colors Events & Entertainment | Kukatpally, Hyderabad';
    }
  }, [location.pathname, location.hash]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <RouteHandler />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/decorations" element={<DecorationsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Fallback to home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
