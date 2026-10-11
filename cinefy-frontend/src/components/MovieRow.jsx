import { Link } from 'react-router-dom';
import Poster from './Poster';
import RatingBadge from './RatingBadge';

/** Compact list item used for rankings. `meta` is an optional right-aligned element. */
export default function MovieRow({ movie, rank, meta }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      {rank !== undefined && <span className="w-5 text-right text-sm tabular-nums text-muted">{rank}</span>}
      <div className="w-9 shrink-0">
        <Poster movie={movie} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <Link to={`/movies/${movie.id}`} className="block truncate font-medium hover:text-accent">
          {movie.title}
        </Link>
        <p className="text-xs text-muted">
          {movie.genre}, {movie.releaseYear}
        </p>
      </div>
      {meta ?? <RatingBadge value={movie.averageRating} count={movie.ratingCount} />}
    </li>
  );
}
