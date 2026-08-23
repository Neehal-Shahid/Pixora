import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Toast from './components/feedback/Toast';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import PhotoDetailsPage from './pages/PhotoDetailsPage';
import ExplorePage from './pages/ExplorePage';
import CollectionsPage from './pages/CollectionsPage';
import SavedPage from './pages/SavedPage';
import AboutPage from './pages/AboutPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main-content" className="min-h-[60vh]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:query" element={<SearchResultsPage />} />
          <Route path="/photo/:id" element={<PhotoDetailsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <FavoritesProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
