import { Star } from 'lucide-react';
import { formatRating } from '../utils/format';

export default function RatingBadge({ value, count, className = '' }) {
  const rated = Number(value) > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm ${className}`}
      aria-label={rated ? `Average rating ${formatRating(value)} out of 5` : 'No ratings yet'}
    >
      <Star size={14} className={rated ? 'fill-accent text-accent' : 'text-muted'} aria-hidden="true" />
      <span className="font-medium">{formatRating(value)}</span>
      {count !== undefined && <span className="text-muted">({count})</span>}
    </span>
  );
}
