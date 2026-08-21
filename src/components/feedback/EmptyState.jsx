import { Link } from 'react-router-dom';

export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  description = '',
  actionLabel = 'Explore images',
  actionTo = '/explore',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-surface-secondary text-text-muted mb-5">
        {icon || (
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="22" height="22" rx="5"/>
            <circle cx="10" cy="11" r="2.5"/>
            <path d="M3 19l5.5-5.5a2.5 2.5 0 0 1 3.5 0L17 19"/>
            <path d="M15.5 16.5l1.5-1.5a2.5 2.5 0 0 1 3.5 0L25 19"/>
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      )}
      <Link
        to={actionTo}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
      >
        {actionLabel}
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 2l5 5-5 5"/>
        </svg>
      </Link>
    </div>
  );
}
