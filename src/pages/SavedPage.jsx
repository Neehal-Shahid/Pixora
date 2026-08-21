import Container from '../components/layout/Container';
import ImageGrid from '../components/images/ImageGrid';
import EmptyState from '../components/feedback/EmptyState';
import { useFavorites } from '../context/FavoritesContext';

export default function SavedPage() {
  const { favorites } = useFavorites();

  return (
    <section className="mt-8 mb-10">
      <Container>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Saved Images</h1>
          <p className="text-text-secondary">
            {favorites.length > 0
              ? `${favorites.length} ${favorites.length === 1 ? 'image' : 'images'} in your collection`
              : 'Your saved images will appear here.'}
          </p>
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            title="No saved images yet"
            description="Start exploring and save images you love. They'll be waiting for you right here."
            actionLabel="Start exploring"
            actionTo="/explore"
            icon={
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            }
          />
        ) : (
          <ImageGrid images={favorites} />
        )}
      </Container>
    </section>
  );
}
