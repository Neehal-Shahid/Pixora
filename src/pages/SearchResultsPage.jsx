import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import SearchBar from '../components/search/SearchBar';
import OrientationFilter from '../components/search/OrientationFilter';
import ImageGrid from '../components/images/ImageGrid';
import ImageSkeleton from '../components/images/ImageSkeleton';
import LoadMoreButton from '../components/ui/LoadMoreButton';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';
import { searchPhotos } from '../api/unsplash';
import { formatNumber } from '../utils/formatters';

export default function SearchResultsPage() {
  const { query } = useParams();
  const navigate = useNavigate();
  const decodedQuery = decodeURIComponent(query || '');

  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [orientation, setOrientation] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [seenIds, setSeenIds] = useState(new Set());

  // Initial search & orientation change
  useEffect(() => {
    let cancelled = false;

    async function search() {
      setLoading(true);
      setError(null);
      setPhotos([]);
      setPage(1);
      setSeenIds(new Set());

      try {
        const result = await searchPhotos(decodedQuery, 1, 20, orientation);
        if (cancelled) return;

        setPhotos(result.photos);
        setTotalResults(result.total);
        setTotalPages(result.totalPages);
        setSeenIds(new Set(result.photos.map((p) => p.id)));
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (decodedQuery) search();
    return () => { cancelled = true; };
  }, [decodedQuery, orientation]);

  // Load more
  const handleLoadMore = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await searchPhotos(decodedQuery, nextPage, 20, orientation);

      const newPhotos = result.photos.filter((p) => !seenIds.has(p.id));
      if (newPhotos.length > 0) {
        setSeenIds((prev) => {
          const updated = new Set(prev);
          newPhotos.forEach((p) => updated.add(p.id));
          return updated;
        });
        setPhotos((prev) => [...prev, ...newPhotos]);
      }
      setPage(nextPage);
    } catch {
      // Silently handle load more errors
    } finally {
      setLoadingMore(false);
    }
  }, [page, loadingMore, decodedQuery, orientation, seenIds]);

  const handleSearch = (newQuery) => {
    navigate(`/search/${encodeURIComponent(newQuery)}`);
  };

  const hasMore = page < totalPages;

  return (
    <section className="mt-6 mb-10">
      <Container>
        {/* Search bar */}
        <div className="max-w-2xl mb-6">
          <SearchBar variant="compact" initialQuery={decodedQuery} onSearch={handleSearch} />
        </div>

        {/* Header with filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {decodedQuery}
            </h1>
            {!loading && !error && (
              <p className="text-sm text-text-secondary mt-1">
                {formatNumber(totalResults)} {totalResults === 1 ? 'result' : 'results'}
              </p>
            )}
          </div>

          <OrientationFilter value={orientation} onChange={setOrientation} />
        </div>

        {/* Content */}
        {loading ? (
          <ImageSkeleton count={12} />
        ) : error ? (
          <ErrorState
            title="Search failed"
            description="We couldn't complete your search. Please try again."
            onRetry={() => window.location.reload()}
          />
        ) : photos.length === 0 ? (
          <EmptyState
            title={`No results for "${decodedQuery}"`}
            description="Try searching for something else or explore our curated collections."
            actionLabel="Explore images"
            actionTo="/explore"
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
  );
}
