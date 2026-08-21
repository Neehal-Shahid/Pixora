import { useState, useEffect, useRef } from 'react';
import ImageCard from './ImageCard';
import { useMasonryColumns } from '../../hooks/useMasonryColumns';

export default function ImageGrid({ images }) {
  const [columnCount, setColumnCount] = useState(4);
  const containerRef = useRef(null);

  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      const width = containerRef.current?.offsetWidth || window.innerWidth;
      if (width < 640) setColumnCount(2);
      else if (width < 1024) setColumnCount(3);
      else setColumnCount(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const columns = useMasonryColumns(images, columnCount);

  if (!images || images.length === 0) return null;

  return (
    <div ref={containerRef} className="flex gap-4" role="list" aria-label="Image gallery">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="flex-1 min-w-0" role="presentation">
          {column.map((photo) => (
            <ImageCard key={photo.id} photo={photo} />
          ))}
        </div>
      ))}
    </div>
  );
}
