import { useState, useEffect } from 'react';
import Container from '../components/layout/Container';
import ImageGrid from '../components/images/ImageGrid';
import ImageSkeleton from '../components/images/ImageSkeleton';
import ErrorState from '../components/feedback/ErrorState';
import { getTopics, getTopicPhotos } from '../api/unsplash';
import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';

export default function ExplorePage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const topics = await getTopics(1, 6, 'featured');
        if (cancelled) return;

        // Load photos for each topic
        const sectionsData = await Promise.all(
          topics.map(async (topic) => {
            const photos = await getTopicPhotos(topic.slug, 1, 8).catch(() => []);
            return { topic, photos };
          })
        );

        if (!cancelled) setSections(sectionsData.filter((s) => s.photos.length > 0));
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <SEO title="Explore" description="Explore curated photography topics from talented creators." />
      <section className="mt-8 mb-10">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Explore</h1>
          <p className="text-text-secondary">
            Discover curated photography topics from talented creators.
          </p>
        </div>

        {loading ? (
          <div className="space-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="skeleton w-40 h-6 rounded mb-6" />
                <ImageSkeleton count={8} />
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="Unable to load topics"
            description="We couldn't fetch explore content. Please try again."
            onRetry={() => window.location.reload()}
          />
        ) : (
          <div className="space-y-16">
            {sections.map(({ topic, photos }) => (
              <div key={topic.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">{topic.title}</h2>
                    {topic.description && (
                      <p className="text-sm text-text-secondary mt-1 line-clamp-1 max-w-lg">
                        {topic.description}
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/search/${encodeURIComponent(topic.slug)}`}
                    className="shrink-0 text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    View all →
                  </Link>
                </div>
                <ImageGrid images={photos} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
    </>
  );
}
