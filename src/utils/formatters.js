/**
 * Format a number with commas (e.g. 12345 → "12,345")
 */
export function formatNumber(num) {
  if (!num && num !== 0) return '';
  return num.toLocaleString();
}

/**
 * Get a readable orientation label from width/height
 */
export function getOrientation(width, height) {
  const ratio = width / height;
  if (ratio > 1.1) return 'Landscape';
  if (ratio < 0.9) return 'Portrait';
  return 'Square';
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
