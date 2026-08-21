import { UNSPLASH_BASE_URL, PER_PAGE } from '../constants';

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Simple in-memory cache to reduce API calls (important for 50 req/hr demo limit)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(url) {
  return url;
}

function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchFromAPI(endpoint, params = {}) {
  const url = new URL(`${UNSPLASH_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const cacheKey = getCacheKey(url.toString());
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
    },
  });

  if (!response.ok) {
    const error = new Error(`API request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  // For search endpoints, include total_pages from response
  const result = { data };

  // Extract pagination info from headers
  const totalHeader = response.headers.get('X-Total');
  if (totalHeader) {
    result.total = parseInt(totalHeader, 10);
  }

  setCache(cacheKey, result);
  return result;
}

/**
 * Get editorial photos (home feed)
 */
export async function getPhotos(page = 1, perPage = PER_PAGE, orderBy = 'latest') {
  const result = await fetchFromAPI('/photos', {
    page,
    per_page: perPage,
    order_by: orderBy,
  });
  return { photos: result.data, total: result.total };
}

/**
 * Search photos by query
 */
export async function searchPhotos(query, page = 1, perPage = PER_PAGE, orientation = '') {
  const result = await fetchFromAPI('/search/photos', {
    query,
    page,
    per_page: perPage,
    orientation: orientation || undefined,
  });
  return {
    photos: result.data.results,
    total: result.data.total,
    totalPages: result.data.total_pages,
  };
}

/**
 * Get a single photo by ID
 */
export async function getPhoto(id) {
  const result = await fetchFromAPI(`/photos/${id}`);
  return result.data;
}

/**
 * Get random photos (optionally filtered by query)
 */
export async function getRandomPhotos(count = 12, query = '') {
  const result = await fetchFromAPI('/photos/random', {
    count,
    query: query || undefined,
  });
  return Array.isArray(result.data) ? result.data : [result.data];
}

/**
 * Get topics list
 */
export async function getTopics(page = 1, perPage = 12, orderBy = 'featured') {
  const result = await fetchFromAPI('/topics', {
    page,
    per_page: perPage,
    order_by: orderBy,
  });
  return result.data;
}

/**
 * Get photos for a specific topic
 */
export async function getTopicPhotos(slug, page = 1, perPage = PER_PAGE) {
  const result = await fetchFromAPI(`/topics/${slug}/photos`, {
    page,
    per_page: perPage,
  });
  return result.data;
}

/**
 * Trigger download tracking (required by Unsplash API guidelines)
 */
export async function trackDownload(downloadLocation) {
  const url = downloadLocation.includes('?')
    ? `${downloadLocation}&client_id=${ACCESS_KEY}`
    : `${downloadLocation}?client_id=${ACCESS_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Download tracking failed');
  }
  return response.json();
}

/**
 * Download an image file
 */
export async function downloadPhoto(photo) {
  // Step 1: Track the download (required by Unsplash)
  const tracking = await trackDownload(photo.links.download_location);

  // Step 2: Fetch image as blob
  const imageResponse = await fetch(tracking.url);
  const blob = await imageResponse.blob();

  // Step 3: Trigger browser download
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `pixora-${photo.id}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}
