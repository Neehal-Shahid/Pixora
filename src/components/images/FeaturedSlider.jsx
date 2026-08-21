import { useState, useRef, useEffect } from 'react';

export default function FeaturedSlider({ items, renderItem, title }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', checkScroll, { passive: true });
    return () => el?.removeEventListener('scroll', checkScroll);
  }, [items]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      {title && (
        <h2 className="text-lg font-semibold text-text-primary mb-4">{title}</h2>
      )}

      <div className="relative group/slider">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center
              bg-white border border-border rounded-full shadow-md text-text-primary
              opacity-0 group-hover/slider:opacity-100 transition-opacity
              hover:bg-surface-secondary"
            aria-label="Scroll left"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10 3L5 8l5 5"/>
            </svg>
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center
              bg-white border border-border rounded-full shadow-md text-text-primary
              opacity-0 group-hover/slider:opacity-100 transition-opacity
              hover:bg-surface-secondary"
            aria-label="Scroll right"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 3l5 5-5 5"/>
            </svg>
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-1"
        >
          {items.map((item, index) => (
            <div key={item.id || index} className="shrink-0 snap-start">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
