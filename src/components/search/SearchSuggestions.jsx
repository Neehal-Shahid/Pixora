import { TRENDING_SEARCHES } from '../../constants';

export default function SearchSuggestions({
  recentSearches = [],
  onSuggestionClick,
  onRemoveRecent,
  onClearAll,
}) {
  const hasRecent = recentSearches.length > 0;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-30">
      {/* Recent searches */}
      {hasRecent && (
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Recent Searches
            </span>
            <button
              onClick={onClearAll}
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((search) => (
              <span
                key={search}
                className="group inline-flex items-center gap-1 px-2.5 py-1 text-xs text-text-secondary bg-surface-secondary rounded-md hover:bg-accent-light hover:text-accent transition-colors cursor-pointer"
              >
                <span onClick={() => onSuggestionClick(search)}>{search}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveRecent(search); }}
                  className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all ml-0.5"
                  aria-label={`Remove ${search} from recent searches`}
                >
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M7.5 2.5l-5 5M2.5 2.5l5 5"/>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      {hasRecent && <div className="border-t border-border-subtle" />}

      {/* Trending */}
      <div className="p-3">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">
          Trending
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TRENDING_SEARCHES.map((term) => (
            <button
              key={term}
              onClick={() => onSuggestionClick(term.toLowerCase())}
              className="px-2.5 py-1 text-xs text-text-secondary bg-surface-secondary rounded-md hover:bg-accent-light hover:text-accent transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
