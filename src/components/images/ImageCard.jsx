import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import SaveButton from '../ui/SaveButton';
import DownloadButton from '../ui/DownloadButton';

const ImageCard = memo(function ImageCard({ photo }) {
  const [loaded, setLoaded] = useState(false);
  const aspectRatio = photo.width && photo.height ? photo.width / photo.height : 1;

  return (
    <article className="group relative rounded-lg overflow-hidden bg-surface-secondary mb-4">
      <Link
        to={`/photo/${photo.id}`}
        className="block"
        aria-label={photo.alt_description || `Photo by ${photo.user?.name}`}
      >
        {/* Placeholder background using dominant color */}
        <div
          className="relative w-full"
          style={{
            aspectRatio: `${photo.width} / ${photo.height}`,
            backgroundColor: photo.color || '#e4e4e7',
          }}
        >
          <img
            src={photo.urls.small}
            alt={photo.alt_description || `Photo by ${photo.user?.name}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              loaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-[1.03]`}
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Actions (visible on hover/focus) */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
        <SaveButton photo={photo} size="sm" />
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
        {/* Photographer */}
        <Link
          to={`/search/${encodeURIComponent(photo.user?.username || '')}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 min-w-0"
        >
          {photo.user?.profile_image?.medium ? (
            <img
              src={photo.user.profile_image.medium}
              alt=""
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-white/30"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/20 shrink-0 flex items-center justify-center text-xs text-white font-medium">
              {photo.user?.name?.charAt(0) || '?'}
            </div>
          )}
          <span className="text-xs text-white/90 font-medium truncate">
            {photo.user?.name || 'Unknown'}
          </span>
        </Link>

        <DownloadButton photo={photo} size="sm" />
      </div>
    </article>
  );
});

export default ImageCard;
