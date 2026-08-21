/**
 * Safe localStorage getter with JSON parsing
 */
export function getStorageItem(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Safe localStorage setter with JSON stringify
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage might be full or unavailable
    console.warn('Failed to save to localStorage');
  }
}
