import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { usersApi } from '../api/users';
import { useFetch } from '../hooks/useFetch';
import { formatDate, formatRating } from '../utils/format';
import { EmptyState, ErrorState, LoadingBlock } from '../components/States';
import Section from '../components/Section';

export default function UserDetails() {
  const { id } = useParams();
  const user = useFetch(() => usersApi.get(id), [id]);

  const back = (
    <Link to="/users" className="link mb-4 inline-flex items-center gap-1 text-sm">
      <ChevronLeft size={16} aria-hidden="true" /> All users
    </Link>
  );

  if (user.loading && !user.data) return <LoadingBlock label="Loading user…" />;
  if (user.error?.status === 404) {
    return (
      <>
        {back}
        <EmptyState title="User not found" action={<Link to="/users" className="btn">Back to users</Link>} />
      </>
    );
  }
  if (user.error) return <ErrorState error={user.error} onRetry={user.reload} />;
  const u = user.data;

  return (
    <>
      {back}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{u.name}</h1>
          <p className="mt-1 text-sm text-muted">
            {u.email}. Joined {formatDate(u.createdAt)}.
          </p>
        </div>
        <Link to={`/recommendations?user=${u.id}`} className="btn btn-primary">
          <Sparkles size={15} aria-hidden="true" /> See recommendations
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <Section title="Preferred genres" description="Ranked by this user's own average rating.">
          {u.preferredGenres.length === 0 ? (
            <EmptyState title="No ratings yet" hint="Preferred genres appear after this user rates movies." />
          ) : (
            <ul className="space-y-3">
              {u.preferredGenres.map((g) => (
                <li key={g.genre}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{g.genre}</span>
                    <span className="text-muted tabular-nums">
                      {formatRating(g.averageRating)} avg, {g.ratingCount} {g.ratingCount === 1 ? 'rating' : 'ratings'}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 rounded bg-paper" role="presentation">
                    <div className="h-1.5 rounded bg-accent" style={{ width: `${(g.averageRating / 5) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Rating activity" description={`${u.ratingCount} ${u.ratingCount === 1 ? 'rating' : 'ratings'}, average ${formatRating(u.averageRating)}.`}>
          {u.ratings.length === 0 ? (
            <EmptyState title="No ratings yet" hint="Rate a movie as this user from a movie page." action={<Link to="/movies" className="btn">Browse movies</Link>} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[28rem] text-left text-sm">
                <caption className="sr-only">Movies rated by {u.name}</caption>
                <thead className="border-b border-line text-muted">
                  <tr>
                    <th scope="col" className="py-2 pr-3 font-medium">Movie</th>
                    <th scope="col" className="py-2 pr-3 font-medium">Genre</th>
                    <th scope="col" className="py-2 pr-3 text-right font-medium">Rating</th>
                    <th scope="col" className="py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {u.ratings.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 pr-3">
                        <Link to={`/movies/${r.movieId}`} className="font-medium hover:text-accent">
                          {r.movieTitle}
                        </Link>
                      </td>
                      <td className="py-2 pr-3 text-muted">{r.movieGenre}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.rating} / 5</td>
                      <td className="py-2 text-muted">{formatDate(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </>
  );
}
