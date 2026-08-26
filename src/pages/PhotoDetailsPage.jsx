import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import ImageGrid from '../components/images/ImageGrid';
import ImageSkeleton from '../components/images/ImageSkeleton';
import SaveButton from '../components/ui/SaveButton';
import DownloadButton from '../components/ui/DownloadButton';
import PhotographerInfo from '../components/ui/PhotographerInfo';
import ErrorState from '../components/feedback/ErrorState';
import { getPhoto, getRandomPhotos } from '../api/unsplash';
import { getOrientation, formatNumber } from '../utils/formatters';
import SEO from '../components/seo/SEO';

export default function PhotoDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [relatedPhotos, setRelatedPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setImageLoaded(false);

      try {
        const photoData = await getPhoto(id);
        if (cancelled) return;
        setPhoto(photoData);

        // Fetch related images based on tags or description
        const searchTerm =
          photoData.tags?.[0]?.title ||
          photoData.alt_description?.split(' ').slice(0, 3).join(' ') ||
          'photography';

        const related = await getRandomPhotos(8, searchTerm).catch(() => []);
        if (!cancelled) {
          setRelatedPhotos(related.filter((p) => p.id !== id));
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    window.scrollTo(0, 0);
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="mt-8">
          <div className="skeleton w-24 h-6 rounded mb-8" />
          <div className="skeleton w-full aspect-[3/2] rounded-xl mb-8" />
          <div className="skeleton w-48 h-5 rounded mb-3" />
          <div className="skeleton w-72 h-4 rounded" />
        </div>
      </Container>
    );
  }

  if (error || !photo) {
    return (
      <Container>
        <div className="mt-8">
          <ErrorState
            title="Photo not found"
            description="This photo may have been removed or is no longer available."
            onRetry={() => navigate('/explore')}
          />
        </div>
      </Container>
    );
  }

  const orientation = getOrientation(photo.width, photo.height);
  const photoTitle = photo.alt_description
    ? photo.alt_description.charAt(0).toUpperCase() + photo.alt_description.slice(1)
    : `Photo by ${photo.user?.name}`;

  const imageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: photo.urls?.regular,
    thumbnailUrl: photo.urls?.small,
    name: photoTitle,
    description: photo.description || photo.alt_description || photoTitle,
    width: photo.width,
    height: photo.height,
    datePublished: photo.created_at,
    creditText: photo.user?.name,
    creator: {
      '@type': 'Person',
      name: photo.user?.name,
      url: photo.user?.links?.html,
    },
    license: 'https://unsplash.com/license',
    acquireLicensePage: 'https://unsplash.com/license',
  };

  return (
    <>
      <SEO
        title={photoTitle}
        description={photo.description || `${photoTitle} — free high-resolution photo by ${photo.user?.name}, available to download on Pixora.`}
        image={photo.urls?.regular}
        jsonLd={imageJsonLd}
      />
      <Container>
        <div className="mt-6 mb-12">
          {/* Back + Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10 3L5 8l5 5"/>
              </svg>
              Back
            </button>

            <div className="flex items-center gap-2">
              <SaveButton photo={photo} size="lg" showLabel />
              <DownloadButton photo={photo} size="lg" showLabel />
            </div>
          </div>

          {/* Main Image */}
          <div className="flex justify-center mb-8">
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                backgroundColor: photo.color || '#e4e4e7',
                maxWidth: '100%',
                width: photo.width > photo.height ? '100%' : 'auto',
              }}
            >
              <img
                src={photo.urls.regular}
                alt={photo.alt_description || `Photo by ${photo.user?.name}`}
                fetchpriority="high"
                onLoad={() => setImageLoaded(true)}
                className={`block max-h-[75vh] w-auto max-w-full mx-auto transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  aspectRatio: `${photo.width} / ${photo.height}`,
                }}
              />
            </div>
          </div>

          {/* Photo Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Photographer + Description */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-xl font-semibold text-text-primary">{photoTitle}</h1>
              <PhotographerInfo user={photo.user} size="lg" />

              {(photo.description || photo.alt_description) && (
                <p className="text-text-secondary text-sm leading-relaxed">
                  {photo.description || photo.alt_description}
                </p>
              )}
            </div>

            {/* Right: Metadata */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-text-primary">Details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-muted">Dimensions</dt>
                  <dd className="text-text-primary font-medium">{formatNumber(photo.width)} × {formatNumber(photo.height)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-muted">Orientation</dt>
                  <dd className="text-text-primary font-medium">{orientation}</dd>
                </div>
                {photo.color && (
                  <div className="flex justify-between items-center">
                    <dt className="text-text-muted">Color</dt>
                    <dd className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded border border-border"
                        style={{ backgroundColor: photo.color }}
                      />
                      <span className="text-text-primary font-medium text-xs uppercase">{photo.color}</span>
                    </dd>
                  </div>
                )}
                {photo.views && (
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Views</dt>
                    <dd className="text-text-primary font-medium">{formatNumber(photo.views)}</dd>
                  </div>
                )}
                {photo.downloads && (
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Downloads</dt>
                    <dd className="text-text-primary font-medium">{formatNumber(photo.downloads)}</dd>
                  </div>
                )}
                {photo.likes && (
                  <div className="flex justify-between">
                    <dt className="text-text-muted">Likes</dt>
                    <dd className="text-text-primary font-medium">{formatNumber(photo.likes)}</dd>
                  </div>
                )}
              </dl>

              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="pt-3 border-t border-border-subtle">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {photo.tags.slice(0, 10).map((tag) => (
                      <Link
                        key={tag.title}
                        to={`/search/${encodeURIComponent(tag.title)}`}
                        className="px-2.5 py-1 text-xs text-text-secondary bg-surface-secondary rounded-md hover:bg-accent-light hover:text-accent transition-colors"
                      >
                        {tag.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Related Images */}
      {relatedPhotos.length > 0 && (
        <section className="border-t border-border-subtle pt-10 mb-10">
          <Container>
            <h2 className="text-lg font-semibold text-text-primary mb-6">
              Related Images
            </h2>
            <ImageGrid images={relatedPhotos} />
          </Container>
        </section>
      )}
    </>
  );
}
