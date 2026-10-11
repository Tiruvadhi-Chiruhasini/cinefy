import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';

export function LoadingBlock({ label = 'Loading…', className = '' }) {
  return (
    <div role="status" aria-live="polite" className={`flex items-center justify-center gap-2 py-12 text-sm text-muted ${className}`}>
      <Loader2 size={18} className="animate-spin" aria-hidden="true" />
      {label}
    </div>
  );
}

export function ErrorState({ error, onRetry, className = '' }) {
  return (
    <div role="alert" className={`flex flex-col items-center gap-2 py-10 text-center ${className}`}>
      <AlertTriangle size={22} className="text-danger" aria-hidden="true" />
      <p className="max-w-md text-sm">{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <button type="button" className="btn mt-1" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, hint, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center gap-1.5 py-10 text-center ${className}`}>
      <Inbox size={22} className="text-muted" aria-hidden="true" />
      <p className="font-medium">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted">{hint}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

/**
 * Handles loading / error / empty for a useFetch result so every screen behaves the same.
 * children is a render function that receives the data.
 */
export function Async({ state, empty, emptyTitle = 'Nothing here yet', emptyHint, emptyAction, loadingLabel, children }) {
  const { data, loading, error, reload } = state;
  if (error) return <ErrorState error={error} onRetry={reload} />;
  if (loading && !data) return <LoadingBlock label={loadingLabel} />;
  if (!data) return null;
  if (empty && empty(data)) return <EmptyState title={emptyTitle} hint={emptyHint} action={emptyAction} />;
  return <div className={loading ? 'opacity-60 transition-opacity' : ''}>{children(data)}</div>;
}
