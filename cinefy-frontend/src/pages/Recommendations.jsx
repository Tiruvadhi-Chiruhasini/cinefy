import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { recommendationsApi } from '../api/recommendations';
import { useFetch } from '../hooks/useFetch';
import { useSelectedUser } from '../hooks/useSelectedUser';
import { formatRating } from '../utils/format';
import { Async, EmptyState } from '../components/States';
import PageHeader from '../components/PageHeader';
import Poster from '../components/Poster';
import RatingBadge from '../components/RatingBadge';
import Section from '../components/Section';
import UserSelect from '../components/UserSelect';

export default function Recommendations() {
  const { users, selectedId, select } = useSelectedUser();
  const [params] = useSearchParams();
  const applied = useRef(false);

  // Honour ?user=ID once (for links from other pages); the dropdown takes over afterwards.
  useEffect(() => {
    if (applied.current || users.length === 0) return;
    applied.current = true;
    const wanted = Number(params.get('user'));
    if (wanted && wanted !== selectedId && users.some((u) => u.id === wanted)) select(wanted);
  }, [users, params, selectedId, select]);

  const recs = useFetch(() => recommendationsApi.forUser(selectedId, 8), [selectedId], { enabled: selectedId != null });

  return (
    <>
      <PageHeader title="Recommendations" subtitle="Movies a user has not rated yet, ranked for their taste." />

      <div className="mb-6 max-w-xs">
        <UserSelect id="rec-user" label="Recommend for" />
      </div>

      {selectedId == null ? (
        <EmptyState title="No users available" hint="Start the backend with sample data, then reload this page." />
      ) : (
        <Async state={recs} loadingLabel="Scoring movies…">
          {(d) => (
            <>
              <Section title={`${d.userName}'s favourite genres`} description="Based on the ratings this user has given.">
                {d.topGenres.length === 0 ? (
                  <p className="text-sm text-muted">This user has not rated anything yet, so the list below shows popular, well-rated movies.</p>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {d.topGenres.map((g) => (
                      <li key={g.genre} className="rounded border border-line bg-accent-soft px-3 py-1.5 text-sm">
                        <span className="font-medium">{g.genre}</span>
                        <span className="text-muted">
                          {' '}
                          {formatRating(g.averageRating)} avg, {g.ratingCount} {g.ratingCount === 1 ? 'rating' : 'ratings'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <h2 className="mb-3 mt-8 text-lg font-semibold">Recommended movies</h2>
              {d.recommendations.length === 0 ? (
                <EmptyState title="Nothing left to recommend" hint="This user has already rated every movie in the catalog." />
              ) : (
                <ul className="grid gap-4 lg:grid-cols-2">
                  {d.recommendations.map((r) => (
                    <li key={r.movie.id} className="card flex gap-4 p-3.5">
                      <div className="w-20 shrink-0 sm:w-24">
                        <Poster movie={r.movie} size="sm" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-semibold leading-snug">{r.movie.title}</h3>
                          <span className="shrink-0 rounded bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-dark" title="Overall score from 0 to 100">
                            {Math.round(r.score * 100)} match
                          </span>
                        </div>
                        <p className="text-xs text-muted">
                          {r.movie.genre}, {r.movie.releaseYear}
                        </p>
                        <RatingBadge value={r.movie.averageRating} count={r.movie.ratingCount} className="mt-1" />
                        <p className="mt-2 text-sm text-muted">{r.reason}</p>
                        <Link to={`/movies/${r.movie.id}`} className="btn mt-auto self-start">
                          Open details
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-8 max-w-prose text-sm text-muted">
                How scores work: each movie gets a score from 0 to 100 built from the user's taste in its genre (50%), its community rating adjusted for how few ratings it has (35%), and how many people rated it (15%). New users, who have no taste yet, get popular well-rated movies. This is rule-based scoring, not machine learning.
              </p>
            </>
          )}
        </Async>
      )}
    </>
  );
}
