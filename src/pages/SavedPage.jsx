import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import EmptyState from '../components/feedback/EmptyState';
import { useFavorites } from '../context/FavoritesContext';
import SEO from '../components/seo/SEO';

export default function SavedPage() {
  const { collections, createCollection } = useFavorites();
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    createCollection(newCollectionName.trim());
    setNewCollectionName('');
    setIsCreating(false);
  };

  return (
    <>
      <SEO title="My Collections" description="View your saved image collections on Pixora." />
      <section className="mt-8 mb-10">
        <Container>
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">My Collections</h1>
              <p className="text-text-secondary">
                {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
              </p>
            </div>
            
            {isCreating ? (
              <form onSubmit={handleCreate} className="flex items-center gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button type="submit" disabled={!newCollectionName.trim()} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50">Create</button>
                <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text-primary">Cancel</button>
              </form>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-primary bg-white border border-border rounded-lg hover:border-accent hover:text-accent transition-colors"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M7 2v10M2 7h10" />
                </svg>
                New Collection
              </button>
            )}
          </div>

          {collections.length === 0 ? (
            <EmptyState
              title="No collections yet"
              description="Create a collection to start saving your favorite images."
              actionLabel="Start exploring"
              actionTo="/explore"
              icon={
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                </svg>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {collections.map(collection => (
                <Link
                  key={collection.id}
                  to={`/saved/${collection.id}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] bg-surface-secondary rounded-xl overflow-hidden mb-3 border border-border group-hover:border-accent transition-colors">
                    {collection.photos[0] ? (
                      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-0.5">
                        <div className="col-span-2 row-span-2 relative">
                          <img 
                            src={collection.photos[0].urls.small} 
                            alt="" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-surface">
                        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="text-sm font-medium">Empty</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {collection.photos.length} {collection.photos.length === 1 ? 'image' : 'images'}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
