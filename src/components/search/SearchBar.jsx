import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchSuggestions from './SearchSuggestions';
import { useRecentSearches } from '../../hooks/useRecentSearches';

export default function SearchBar({
  variant = 'hero', // 'hero' | 'compact'
  initialQuery = '',
  onSearch,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const { searches, addSearch, removeSearch, clearAll } = useRecentSearches();

  // Close suggestions on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      addSearch(q);
      if (onSearch) {
        onSearch(q);
      } else {
        navigate(`/search/${encodeURIComponent(q)}`);
      }
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    addSearch(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    } else {
      navigate(`/search/${encodeURIComponent(suggestion)}`);
    }
    setFocused(false);
  };

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <svg
            className={`absolute left-4 top-1/2 -translate-y-1/2 text-text-muted ${
              isHero ? '' : ''
            }`}
            width={isHero ? '20' : '16'}
            height={isHero ? '20' : '16'}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx={isHero ? '9' : '7'} cy={isHero ? '9' : '7'} r={isHero ? '6' : '5'}/>
            <path d={isHero ? 'M13.5 13.5L18 18' : 'M11 11l3.5 3.5'}/>
          </svg>

          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Search for images..."
            className={`w-full bg-surface-secondary border border-border rounded-xl
              focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/20
              transition-all placeholder:text-text-muted ${
              isHero
                ? 'h-14 pl-12 pr-12 text-base'
                : 'h-11 pl-10 pr-10 text-sm'
            }`}
            aria-label="Search for images"
          />

          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              aria-label="Clear search"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 4L4 12M4 4l8 8"/>
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {focused && (
        <SearchSuggestions
          recentSearches={searches}
          onSuggestionClick={handleSuggestionClick}
          onRemoveRecent={removeSearch}
          onClearAll={clearAll}
        />
      )}
    </div>
  );
}
