import { Star } from 'lucide-react';

/** Five-star picker built from real radio buttons so it works with keyboard and screen readers. */
export default function RatingInput({ value, onChange, disabled = false, name = 'rating' }) {
  return (
    <div role="radiogroup" aria-label="Your rating" className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= (value || 0);
        return (
          <label
            key={n}
            className={`cursor-pointer rounded p-1 focus-within:outline focus-within:outline-2 focus-within:outline-accent ${
              disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-accent-soft'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              disabled={disabled}
              onChange={() => onChange(n)}
              className="sr-only"
              aria-label={`${n} ${n === 1 ? 'star' : 'stars'}`}
            />
            <Star size={24} className={active ? 'fill-accent text-accent' : 'text-line'} aria-hidden="true" />
          </label>
        );
      })}
    </div>
  );
}
