import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { FAVORITES_KEY } from '../constants';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() =>
    getStorageItem(FAVORITES_KEY, [])
  );

  const toggleFavorite = useCallback((photo) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === photo.id);
      let updated;

      if (exists) {
        updated = prev.filter((f) => f.id !== photo.id);
      } else {
        // Store only essential data to keep localStorage lean
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

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite }),
    [favorites, toggleFavorite, isFavorite]
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
