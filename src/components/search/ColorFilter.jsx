import { COLOR_OPTIONS } from '../../constants';

export default function ColorFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar" role="radiogroup" aria-label="Filter by color">
      {COLOR_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          role="radio"
          aria-checked={value === option.value}
          title={option.label}
          className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all border-2 ${
            value === option.value
              ? 'border-accent scale-110 shadow-sm z-10'
              : 'border-transparent hover:scale-105'
          } ${!option.value ? 'bg-surface-secondary text-text-secondary hover:text-text-primary border-border' : ''}`}
          style={option.hex ? { background: option.hex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)' } : {}}
          aria-label={option.label}
        >
          {!option.value && (
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 4L4 12M4 4l8 8"/>
            </svg>
          )}
          {value === option.value && option.value && (
            <svg width="14" height="14" fill="none" stroke={option.value === 'white' || option.value === 'yellow' ? '#000' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm">
              <path d="M20 6L9 17l-5-5" viewBox="0 0 24 24" />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
}
