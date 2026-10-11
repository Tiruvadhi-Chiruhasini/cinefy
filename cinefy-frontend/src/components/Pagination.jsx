import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-3">
      <button type="button" className="btn" disabled={page === 0} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} aria-hidden="true" /> Previous
      </button>
      <span className="text-sm text-muted" aria-live="polite">
        Page {page + 1} of {totalPages}
      </span>
      <button type="button" className="btn" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>
        Next <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
