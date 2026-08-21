export default function LoadMoreButton({ onClick, loading, hasMore }) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center pt-10 pb-4">
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium
          text-text-primary bg-surface-secondary border border-border
          rounded-xl hover:bg-border-subtle hover:border-border
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-colors"
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="8" r="5" strokeDasharray="15" strokeDashoffset="4"/>
            </svg>
            Loading...
          </>
        ) : (
          <>
            Load more
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M7 3v8M3 7l4 4 4-4"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
