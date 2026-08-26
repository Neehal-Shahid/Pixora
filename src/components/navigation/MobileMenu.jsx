import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function MobileMenu({ isOpen, onClose, links }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/search/${encodeURIComponent(q)}`);
      setSearchQuery('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl"
        style={{ animation: 'slide-in-right 0.25s ease-out' }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-text-primary">Menu</span>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 5L5 15M5 5l10 10"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="7" cy="7" r="5"/>
                <path d="M11 11l3.5 3.5"/>
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="w-full h-10 pl-9 pr-3 text-sm bg-surface-secondary rounded-lg border border-border focus:border-text-muted focus:outline-none"
                aria-label="Search images"
              />
            </div>
          </form>
        </div>

        {/* Nav links */}
        <nav className="px-4 space-y-1" aria-label="Mobile navigation">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-accent bg-accent-light'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
