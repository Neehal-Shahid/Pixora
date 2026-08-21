import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';

export default function SaveButton({ photo, size = 'sm', showLabel = false }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { show } = useToast();
  const saved = isFavorite(photo.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(photo);
    show(saved ? 'Removed from saved' : 'Saved to collection');
  };

  const sizeClasses = size === 'lg'
    ? 'w-10 h-10'
    : 'w-8 h-8';

  const iconSize = size === 'lg' ? 20 : 16;

  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses} flex items-center justify-center rounded-lg transition-all
        ${saved
          ? 'bg-danger text-white hover:bg-red-700'
          : 'bg-white/90 text-text-primary hover:bg-white hover:text-danger'
        }
        ${showLabel ? 'w-auto px-3 gap-2' : ''}
      `}
      aria-label={saved ? 'Remove from saved' : 'Save image'}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {showLabel && (
        <span className="text-sm font-medium">{saved ? 'Saved' : 'Save'}</span>
      )}
    </button>
  );
}
