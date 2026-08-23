import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';

export default function SaveModal({ photo, onClose }) {
  const { collections, createCollection, addPhotoToCollection, removePhotoFromCollection, getPhotoCollections } = useFavorites();
  const { show } = useToast();
  
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const photoCollections = getPhotoCollections(photo.id);

  const handleToggle = (collectionId) => {
    const isSaved = photoCollections.includes(collectionId);
    if (isSaved) {
      removePhotoFromCollection(collectionId, photo.id);
      show('Removed from collection');
    } else {
      addPhotoToCollection(collectionId, photo);
      show('Saved to collection');
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    
    const newId = createCollection(newCollectionName.trim());
    addPhotoToCollection(newId, photo);
    show(`Saved to ${newCollectionName.trim()}`);
    setNewCollectionName('');
    setIsCreating(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Save to collection</h2>
          <button onClick={onClose} className="p-1 text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-secondary">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {collections.map(collection => {
            const isSaved = photoCollections.includes(collection.id);
            return (
              <button
                key={collection.id}
                onClick={() => handleToggle(collection.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-secondary transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-md bg-surface flex items-center justify-center overflow-hidden border ${isSaved ? 'border-accent' : 'border-border'}`}>
                    {collection.photos[0] ? (
                      <img src={collection.photos[0].urls.thumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <svg width="20" height="20" fill="none" stroke="currentColor" className="text-text-muted" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-text-primary">{collection.name}</span>
                </div>
                
                {isSaved ? (
                  <span className="text-xs font-semibold px-2 py-1 bg-accent/10 text-accent rounded-full">Saved</span>
                ) : (
                  <span className="text-sm font-medium text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">Save</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-border bg-surface-secondary">
          {isCreating ? (
            <form onSubmit={handleCreate} className="flex flex-col gap-2">
              <input
                type="text"
                autoFocus
                placeholder="Collection name"
                value={newCollectionName}
                onChange={e => setNewCollectionName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white"
              />
              <div className="flex justify-end gap-2 mt-1">
                <button type="button" onClick={() => setIsCreating(false)} className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary">Cancel</button>
                <button type="submit" disabled={!newCollectionName.trim()} className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50">Create</button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-border rounded-lg hover:border-accent hover:text-accent transition-colors text-sm font-medium text-text-primary"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create new collection
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
