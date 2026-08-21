import { useToast } from '../../context/ToastContext';

export default function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[70] flex flex-col gap-2 max-sm:left-4 max-sm:right-4 max-sm:bottom-4"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.exiting ? 'toast-exit' : 'toast-enter'
          } ${
            toast.type === 'error'
              ? 'bg-danger text-white'
              : 'bg-primary text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="8" cy="8" r="7"/>
              <path d="M8 5v3M8 11h.01"/>
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 8.5l3 3 6.5-7"/>
            </svg>
          )}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
