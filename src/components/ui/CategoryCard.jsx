import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CategoryCard({ category, coverUrl }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={`/search/${encodeURIComponent(category.query || category.title.toLowerCase())}`}
      className="group relative block overflow-hidden rounded-xl aspect-[4/3]"
    >
      <div className="absolute inset-0 bg-surface-secondary">
        {coverUrl && (
          <img
            src={coverUrl}
            alt={category.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-white font-semibold text-base">
          {category.title}
        </h3>
      </div>
    </Link>
  );
}
