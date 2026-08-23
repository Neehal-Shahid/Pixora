export const UNSPLASH_BASE_URL = 'https://api.unsplash.com';

export const PER_PAGE = 20;

export const TRENDING_SEARCHES = [
  'Nature',
  'Architecture',
  'Travel',
  'Minimal',
  'Technology',
  'People',
  'Workspace',
  'Animals',
];

export const CATEGORIES = [
  { slug: 'nature', title: 'Nature', query: 'nature landscape' },
  { slug: 'travel', title: 'Travel', query: 'travel adventure' },
  { slug: 'architecture', title: 'Architecture', query: 'architecture building' },
  { slug: 'technology', title: 'Technology', query: 'technology digital' },
  { slug: 'food', title: 'Food', query: 'food cooking' },
  { slug: 'animals', title: 'Animals', query: 'animals wildlife' },
  { slug: 'fashion', title: 'Fashion', query: 'fashion style' },
  { slug: 'art', title: 'Art', query: 'art creative' },
  { slug: 'business', title: 'Business', query: 'business office' },
  { slug: 'street-photography', title: 'Street Photography', query: 'street photography urban' },
  { slug: 'wallpapers', title: 'Wallpapers', query: 'wallpaper 4k' },
  { slug: 'minimal', title: 'Minimal', query: 'minimal clean simple' },
];

export const ORIENTATION_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'landscape', label: 'Landscape' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'squarish', label: 'Square' },
];

export const RECENT_SEARCHES_KEY = 'pixora_recent_searches';
export const FAVORITES_KEY = 'pixora_favorites';
export const MAX_RECENT_SEARCHES = 8;
