import { useMemo } from 'react';

/**
 * Distributes images into columns using shortest-column-first algorithm.
 * This avoids the DOM-order issue of CSS columns while remaining performant.
 */
export function useMasonryColumns(images, columnCount) {
  return useMemo(() => {
    if (!images || images.length === 0 || columnCount <= 0) {
      return Array.from({ length: columnCount || 1 }, () => []);
    }

    // Initialize columns with height trackers
    const columns = Array.from({ length: columnCount }, () => []);
    const columnHeights = new Array(columnCount).fill(0);

    images.forEach((image) => {
      // Find shortest column
      const shortestIndex = columnHeights.indexOf(Math.min(...columnHeights));

      // Add image to shortest column
      columns[shortestIndex].push(image);

      // Update column height using aspect ratio
      const aspectRatio = image.width && image.height
        ? image.height / image.width
        : 1;
      columnHeights[shortestIndex] += aspectRatio;
    });

    return columns;
  }, [images, columnCount]);
}
