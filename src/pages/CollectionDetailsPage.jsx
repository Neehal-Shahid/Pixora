import { useParams, useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import ImageGrid from '../components/images/ImageGrid';
import EmptyState from '../components/feedback/EmptyState';
import { useFavorites } from '../context/FavoritesContext';
import SEO from '../components/seo/SEO';

export default function CollectionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { collections, deleteCollection } = useFavorites();
  
  const collection = collections.find(c => c.id === id);

  if (!collection) {
    return (
      <Container>
        <div className="mt-12">
          <EmptyState
            title="Collection not found"
            description="This collection may have been deleted."
            actionLabel="Go to My Collections"
            actionTo="/saved"
          />
        </div>
      </Container>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id);
      navigate('/saved');
    }
  };

  return (
    <>
      <SEO title={`${collection.name} — My Collections`} noindex />
      <section className="mt-8 mb-10">
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/saved')}
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10 3L5 8l5 5"/>
              </svg>
              Back to Collections
            </button>
            <button
              onClick={handleDelete}
              className="text-sm font-medium text-danger hover:text-red-700 transition-colors"
            >
              Delete Collection
            </button>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-bold text-text-primary mb-2">{collection.name}</h1>
            <p className="text-text-secondary">
              {collection.photos.length} {collection.photos.length === 1 ? 'image' : 'images'}
            </p>
          </div>

          {collection.photos.length === 0 ? (
            <EmptyState
              title="No images yet"
              description="Start exploring and save images to this collection."
              actionLabel="Start exploring"
              actionTo="/explore"
              icon={
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              }
            />
          ) : (
            <ImageGrid images={collection.photos} />
          )}
        </Container>
      </section>
    </>
  );
}
