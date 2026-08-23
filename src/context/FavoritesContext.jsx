import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

const FavoritesContext = createContext(null);
const COLLECTIONS_KEY = 'pixora_collections';

export function FavoritesProvider({ children }) {
  const [collections, setCollections] = useState(() => {
    const saved = getStorageItem(COLLECTIONS_KEY, null);
    if (saved) return saved;
    
    // Migrate old favorites if they exist
    const oldFavorites = getStorageItem('pixora_favorites', []);
    return [{
      id: 'default',
      name: 'Saved',
      photos: oldFavorites
    }];
  });

  useEffect(() => {
    setStorageItem(COLLECTIONS_KEY, collections);
  }, [collections]);

  const createCollection = useCallback((name) => {
    const newCollection = {
      id: Date.now().toString(),
      name,
      photos: []
    };
    setCollections(prev => [...prev, newCollection]);
    return newCollection.id;
  }, []);

  const deleteCollection = useCallback((id) => {
    setCollections(prev => prev.filter(c => c.id !== id));
  }, []);

  const addPhotoToCollection = useCallback((collectionId, photo) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        if (c.photos.some(p => p.id === photo.id)) return c; // Already exists
        const minimal = {
          id: photo.id,
          width: photo.width,
          height: photo.height,
          color: photo.color,
          alt_description: photo.alt_description,
          description: photo.description,
          urls: {
            small: photo.urls.small,
            regular: photo.urls.regular,
            thumb: photo.urls.thumb,
          },
          links: { download_location: photo.links.download_location },
          user: {
            name: photo.user.name,
            username: photo.user.username,
            profile_image: { medium: photo.user.profile_image?.medium },
            links: { html: photo.user.links?.html },
          },
        };
        return { ...c, photos: [minimal, ...c.photos] };
      }
      return c;
    }));
  }, []);

  const removePhotoFromCollection = useCallback((collectionId, photoId) => {
    setCollections(prev => prev.map(c => {
      if (c.id === collectionId) {
        return { ...c, photos: c.photos.filter(p => p.id !== photoId) };
      }
      return c;
    }));
  }, []);

  const isFavorite = useCallback((photoId) => {
    return collections.some(c => c.photos.some(p => p.id === photoId));
  }, [collections]);

  const getPhotoCollections = useCallback((photoId) => {
    return collections.filter(c => c.photos.some(p => p.id === photoId)).map(c => c.id);
  }, [collections]);

  const value = useMemo(() => ({
    collections,
    createCollection,
    deleteCollection,
    addPhotoToCollection,
    removePhotoFromCollection,
    isFavorite,
    getPhotoCollections
  }), [collections, createCollection, deleteCollection, addPhotoToCollection, removePhotoFromCollection, isFavorite, getPhotoCollections]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}
