import Container from '../components/layout/Container';
import ImageGrid from '../components/images/ImageGrid';
import EmptyState from '../components/feedback/EmptyState';
import SEO from '../components/seo/SEO';
import { useFavorites } from '../context/FavoritesContext';
import { useState } from 'react';

export default function SavedPage() {
  const { favorites, customCollections, createCollection, deleteCollection } = useFavorites();
  const [activeTab, setActiveTab] = useState('all'); // 'all' or collection id
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (newCollectionName.trim()) {
      createCollection(newCollectionName.trim());
      setNewCollectionName('');
      setIsCreating(false);
    }
  };

  const currentPhotos = activeTab === 'all' 
    ? favorites 
    : favorites.filter(f => customCollections.find(c => c.id === activeTab)?.photoIds.includes(f.id));

  return (
    <>
      <SEO title="Saved Images" description="View your saved images and collections on Pixora." />
      <section className="mt-8 mb-10">
        <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Saved Images</h1>
          <p className="text-text-secondary mb-6">
            Your personal gallery of inspiring images.
          </p>

          <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle pb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-text-primary text-background' 
                  : 'bg-surface-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              All Saved
            </button>
            
            {customCollections.map(collection => (
              <button
                key={collection.id}
                onClick={() => setActiveTab(collection.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === collection.id
                    ? 'bg-text-primary text-background'
                    : 'bg-surface-secondary text-text-secondary hover:text-text-primary'
                }`}
              >
                {collection.name}
              </button>
            ))}

            {isCreating ? (
              <form onSubmit={handleCreateCollection} className="flex items-center gap-2 ml-2">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Board name..."
                  autoFocus
                  className="px-3 py-1.5 text-sm bg-surface-secondary border border-border rounded-lg focus:outline-none focus:border-accent"
                />
                <button type="submit" className="text-sm font-medium text-accent hover:text-accent-hover">Save</button>
                <button type="button" onClick={() => setIsCreating(false)} className="text-sm text-text-muted hover:text-text-primary">Cancel</button>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="px-4 py-2 rounded-full text-sm font-medium text-text-secondary border border-dashed border-border hover:border-text-muted hover:text-text-primary transition-all ml-2 flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14m-7-7h14"/></svg>
                New Board
              </button>
            )}
          </div>
        </div>

        {currentPhotos.length > 0 ? (
          <div>
            {activeTab !== 'all' && (
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{customCollections.find(c => c.id === activeTab)?.name}</h2>
                <button 
                  onClick={() => {
                    deleteCollection(activeTab);
                    setActiveTab('all');
                  }}
                  className="text-sm text-danger hover:text-red-700"
                >
                  Delete Board
                </button>
              </div>
            )}
            <ImageGrid images={currentPhotos} />
          </div>
        ) : (
          <EmptyState
            title={activeTab === 'all' ? "No saved images yet" : "This board is empty"}
            description={activeTab === 'all' ? "Images you save will appear here." : "Save images to this board to organize your inspiration."}
            icon={
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            }
          />
        )}
      </Container>
    </section>
    </>
  );
}
