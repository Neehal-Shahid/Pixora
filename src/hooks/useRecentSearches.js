import { useState, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { RECENT_SEARCHES_KEY, MAX_RECENT_SEARCHES } from '../constants';

/**
 * Manages recent search history in localStorage.
 */
export function useRecentSearches() {
  const [searches, setSearches] = useState(() =>
    getStorageItem(RECENT_SEARCHES_KEY, [])
  );

  const addSearch = useCallback((query) => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return;

    setSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      setStorageItem(RECENT_SEARCHES_KEY, updated);
      return updated;
    });
  }, []);

  const removeSearch = useCallback((query) => {
    setSearches((prev) => {
      const updated = prev.filter((s) => s !== query);
      setStorageItem(RECENT_SEARCHES_KEY, updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSearches([]);
    setStorageItem(RECENT_SEARCHES_KEY, []);
  }, []);

  return { searches, addSearch, removeSearch, clearAll };
}
