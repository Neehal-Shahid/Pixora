import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './context/ToastContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Toast from './components/feedback/Toast';
import HomePage from './pages/HomePage';
import { HelmetProvider } from 'react-helmet-async';

// Route-level code splitting: keeps the initial bundle (and LCP/TTI) small —
// only the home page ships eagerly since it's the most common entry point.
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));
const PhotoDetailsPage = lazy(() => import('./pages/PhotoDetailsPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const SavedPage = lazy(() => import('./pages/SavedPage'));
const CollectionDetailsPage = lazy(() => import('./pages/CollectionDetailsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

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
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search/:query" element={<SearchResultsPage />} />
            <Route path="/photo/:id" element={<PhotoDetailsPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/saved/:id" element={<CollectionDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Suspense>
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
        <FavoritesProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </FavoritesProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
