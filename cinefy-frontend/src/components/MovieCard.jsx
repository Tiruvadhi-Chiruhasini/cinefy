import { Link } from 'react-router-dom';
import Poster from './Poster';
import RatingBadge from './RatingBadge';

export default function MovieCard({ movie, size = 'md' }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="card group block overflow-hidden p-2.5 transition-colors hover:border-accent"
    >
      <Poster movie={movie} size={size} />
      <div className="mt-2.5 px-0.5 pb-0.5">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug group-hover:text-accent">{movie.title}</h3>
        <p className="mt-0.5 text-xs text-muted">
          {movie.genre}, {movie.releaseYear}
        </p>
        <RatingBadge value={movie.averageRating} count={movie.ratingCount} className="mt-1.5" />
      </div>
    </Link>
  );
}
