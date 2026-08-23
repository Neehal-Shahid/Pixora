import { useState, useEffect, useCallback } from 'react';
import Container from '../components/layout/Container';
import SearchBar from '../components/search/SearchBar';
import ImageGrid from '../components/images/ImageGrid';
import ImageSkeleton from '../components/images/ImageSkeleton';
import FeaturedSlider from '../components/images/FeaturedSlider';
import LoadMoreButton from '../components/ui/LoadMoreButton';
import ErrorState from '../components/feedback/ErrorState';
import { getPhotos, getRandomPhotos, getTopics } from '../api/unsplash';
import { TRENDING_SEARCHES } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/seo/SEO';

export default function HomePage() {
  const [photos, setPhotos] = useState([]);
  const [topics, setTopics] = useState([]);
  const [featuredImages, setFeaturedImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [seenIds, setSeenIds] = useState(new Set());
  const navigate = useNavigate();

  // Initial load
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [photosResult, topicsData, featured] = await Promise.all([
          getPhotos(1, 20),
          getTopics(1, 8).catch(() => []),
          getRandomPhotos(8, 'popular').catch(() => []),
        ]);

        if (cancelled) return;

        const newIds = new Set(photosResult.photos.map((p) => p.id));
        setSeenIds(newIds);
        setPhotos(photosResult.photos);
        setTopics(topicsData);
        setFeaturedImages(featured);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  // Load more
  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getPhotos(nextPage, 20);

      // Filter duplicates
      const newPhotos = result.photos.filter((p) => !seenIds.has(p.id));

      if (newPhotos.length === 0) {
        setHasMore(false);
      } else {
        setSeenIds((prev) => {
          const updated = new Set(prev);
          newPhotos.forEach((p) => updated.add(p.id));
          return updated;
        });
        setPhotos((prev) => [...prev, ...newPhotos]);
        setPage(nextPage);
      }
    } catch (err) {
      // Silently fail for load more — existing content remains
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, seenIds]);

  return (
    <>
      <SEO title="Home" />
      {/* Hero Section */}
      <section className="relative bg-surface-secondary border-b border-border-subtle">
        <Container>
          <div className="py-16 sm:py-20 lg:py-24 max-w-2xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight mb-4">
              Discover images{' '}
              <span className="text-text-secondary">that inspire</span>
            </h1>
            <p className="text-text-secondary text-base sm:text-lg mb-8 max-w-lg mx-auto">
              Explore millions of high-quality images from talented photographers around the world.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-6">
              <SearchBar variant="hero" />
            </div>

            {/* Trending */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs text-text-muted mr-1">Trending:</span>
              {TRENDING_SEARCHES.slice(0, 6).map((term) => (
                <Link
                  key={term}
                  to={`/search/${encodeURIComponent(term.toLowerCase())}`}
                  className="px-2.5 py-1 text-xs text-text-secondary bg-white border border-border rounded-md hover:border-accent hover:text-accent transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Topics Slider */}
      {featuredImages.length > 0 && (
        <section className="mt-12">
          <Container>
            <FeaturedSlider
              title="Featured"
              items={featuredImages}
              renderItem={(photo) => (
                <Link
                  to={`/photo/${photo.id}`}
                  className="group block relative w-72 sm:w-80 aspect-[3/2] rounded-xl overflow-hidden"
                >
                  <img
                    src={photo.urls.small}
                    alt={photo.alt_description || 'Featured photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-medium truncate">
                      {photo.user?.name}
                    </p>
                  </div>
                </Link>
              )}
            />
          </Container>
        </section>
      )}

      {/* Browse Topics */}
      {topics.length > 0 && (
        <section className="mt-14">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-text-primary">Browse Topics</h2>
              <Link
                to="/explore"
                className="text-sm text-text-secondary hover:text-accent transition-colors"
              >
                View all →
              </Link>
            </div>
            <FeaturedSlider
              items={topics}
              renderItem={(topic) => (
                <Link
                  to={`/search/${encodeURIComponent(topic.slug)}`}
                  className="group block relative w-52 sm:w-56 aspect-[4/3] rounded-xl overflow-hidden"
                >
                  {topic.cover_photo?.urls?.small && (
                    <img
                      src={topic.cover_photo.urls.small}
                      alt={topic.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white text-sm font-semibold">{topic.title}</p>
                  </div>
                </Link>
              )}
            />
          </Container>
        </section>
      )}

      {/* Editorial Feed */}
      <section className="mt-14 mb-10">
        <Container>
          <h2 className="text-lg font-semibold text-text-primary mb-6">
            Editorial
          </h2>

          {loading ? (
            <ImageSkeleton count={12} />
          ) : error ? (
            <ErrorState
              title="Unable to load images"
              description="We couldn't fetch the latest images. Please check your connection and try again."
              onRetry={() => window.location.reload()}
            />
          ) : (
            <>
              <ImageGrid images={photos} />
              <LoadMoreButton
                onClick={handleLoadMore}
                loading={loadingMore}
                hasMore={hasMore}
              />
            </>
          )}
        </Container>
      </section>
    </>
  );
}
