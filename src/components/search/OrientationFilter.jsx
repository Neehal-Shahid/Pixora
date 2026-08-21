import { ORIENTATION_OPTIONS } from '../../constants';

export default function OrientationFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar" role="radiogroup" aria-label="Filter by orientation">
      {ORIENTATION_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          role="radio"
          aria-checked={value === option.value}
          className={`shrink-0 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            value === option.value
              ? 'bg-primary text-white'
              : 'bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-border-subtle'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
