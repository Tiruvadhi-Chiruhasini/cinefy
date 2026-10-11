import { useState } from 'react';
import { genreTint } from '../utils/format';

/**
 * Movie poster. Uses posterUrl when present and loadable; otherwise draws a quiet typographic
 * placeholder from the title, so no image files or paid image APIs are needed.
 */
export default function Poster({ movie, className = '', size = 'md' }) {
  const [failed, setFailed] = useState(false);
  const tint = genreTint(movie.genre);
  const titleSize = size === 'sm' ? 'text-[9px] leading-tight' : size === 'lg' ? 'text-2xl' : 'text-base';

  if (movie.posterUrl && !failed) {
    return (
      <img
        src={movie.posterUrl}
        alt={`Poster of ${movie.title}`}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`aspect-[2/3] w-full rounded object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`Placeholder poster for ${movie.title}`}
      className={`flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded p-3 ${className}`}
      style={{ background: tint.background, color: tint.color }}
    >
      <span className="block h-px w-8" style={{ background: tint.rule }} />
      <span className={`font-serif font-semibold ${titleSize} line-clamp-4`}>{movie.title}</span>
      <span className={size === 'sm' ? 'text-[8px]' : 'text-xs'}>{movie.releaseYear}</span>
    </div>
  );
}
