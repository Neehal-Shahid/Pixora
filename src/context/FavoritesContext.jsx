import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { FAVORITES_KEY } from '../constants';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  // favorites now stores all saved photos (backwards compatible)
  const [favorites, setFavorites] = useState(() =>
    getStorageItem(FAVORITES_KEY, [])
  );

  // customCollections stores { id, name, photoIds[] }
  const [customCollections, setCustomCollections] = useState(() =>
    getStorageItem('pixora_custom_collections', [])
  );

  const toggleFavorite = useCallback((photo) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === photo.id);
      let updated;

      if (exists) {
        updated = prev.filter((f) => f.id !== photo.id);
      } else {
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
          links: {
            download_location: photo.links.download_location,
          },
          user: {
            name: photo.user.name,
            username: photo.user.username,
            profile_image: {
              medium: photo.user.profile_image?.medium,
            },
            links: {
              html: photo.user.links?.html,
            },
          },
        };
        updated = [minimal, ...prev];
      }

      setStorageItem(FAVORITES_KEY, updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (photoId) => favorites.some((f) => f.id === photoId),
    [favorites]
  );

  // --- Multi-Collections API ---
  const createCollection = useCallback((name) => {
    setCustomCollections((prev) => {
      const updated = [...prev, { id: Date.now().toString(), name, photoIds: [] }];
      setStorageItem('pixora_custom_collections', updated);
      return updated;
    });
  }, []);

  const deleteCollection = useCallback((id) => {
    setCustomCollections((prev) => {
      const updated = prev.filter(c => c.id !== id);
      setStorageItem('pixora_custom_collections', updated);
      return updated;
    });
  }, []);

  const toggleInCollection = useCallback((collectionId, photo) => {
    // First ensure it's in the main favorites pool
    setFavorites((prev) => {
      if (!prev.some((f) => f.id === photo.id)) {
        const minimal = {
          id: photo.id, width: photo.width, height: photo.height, color: photo.color,
          urls: { small: photo.urls.small, regular: photo.urls.regular },
          user: { name: photo.user.name }
        };
        const updated = [minimal, ...prev];
        setStorageItem(FAVORITES_KEY, updated);
        return updated;
      }
      return prev;
    });

    setCustomCollections((prev) => {
      const updated = prev.map(c => {
        if (c.id === collectionId) {
          const hasPhoto = c.photoIds.includes(photo.id);
          return {
            ...c,
            photoIds: hasPhoto ? c.photoIds.filter(id => id !== photo.id) : [...c.photoIds, photo.id]
          };
        }
        return c;
      });
      setStorageItem('pixora_custom_collections', updated);
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ 
      favorites, 
      toggleFavorite, 
      isFavorite,
      customCollections,
      createCollection,
      deleteCollection,
      toggleInCollection
    }),
    [favorites, toggleFavorite, isFavorite, customCollections, createCollection, deleteCollection, toggleInCollection]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
