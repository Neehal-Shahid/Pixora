import { useState } from 'react';
import { downloadPhoto } from '../../api/unsplash';
import { useToast } from '../../context/ToastContext';

export default function DownloadButton({ photo, size = 'sm', showLabel = false }) {
  const [downloading, setDownloading] = useState(false);
  const { show } = useToast();

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (downloading) return;
    setDownloading(true);

    try {
      await downloadPhoto(photo);
      show('Download started');
    } catch (err) {
      show('Download failed. Please try again.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const sizeClasses = size === 'lg'
    ? 'w-10 h-10'
    : 'w-8 h-8';

  const iconSize = size === 'lg' ? 20 : 16;

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`${sizeClasses} flex items-center justify-center rounded-lg transition-all
        bg-white/90 text-text-primary hover:bg-white
        disabled:opacity-60 disabled:cursor-not-allowed
        ${showLabel ? 'w-auto px-3 gap-2' : ''}
      `}
      aria-label={downloading ? 'Downloading...' : 'Download image'}
    >
      {downloading ? (
        <svg className="animate-spin" width={iconSize} height={iconSize} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx={iconSize/2} cy={iconSize/2} r={iconSize/2-3} strokeDasharray="20" strokeDashoffset="5"/>
        </svg>
      ) : (
        <svg width={iconSize} height={iconSize} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={size === 'lg' ? 'M12 4v12M12 16l-4-4M12 16l4-4M4 18h16' : 'M8 3v8M8 11l-3-3M8 11l3-3M3 13h10'}/>
        </svg>
      )}
      {showLabel && (
        <span className="text-sm font-medium">{downloading ? 'Downloading...' : 'Download'}</span>
      )}
    </button>
  );
}
