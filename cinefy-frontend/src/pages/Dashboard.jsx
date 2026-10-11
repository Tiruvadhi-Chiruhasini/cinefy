import { Link } from 'react-router-dom';
import { Film, Star, Users, MessageSquareText } from 'lucide-react';
import { analyticsApi } from '../api/analytics';
import { recommendationsApi } from '../api/recommendations';
import { useFetch } from '../hooks/useFetch';
import { useSelectedUser } from '../hooks/useSelectedUser';
import { Async, EmptyState } from '../components/States';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import StatCard from '../components/StatCard';
import MovieCard from '../components/MovieCard';
import MovieRow from '../components/MovieRow';
import Poster from '../components/Poster';
import UserSelect from '../components/UserSelect';
import { HorizontalBars, RatingColumns } from '../components/Charts';
import { formatRating } from '../utils/format';

export default function Dashboard() {
  const overview = useFetch(() => analyticsApi.overview(), []);
  const genres = useFetch(() => analyticsApi.genres(), []);
  const ratings = useFetch(() => analyticsApi.ratings(''), []);
  const top = useFetch(() => analyticsApi.topMovies({ limit: 5, minRatings: 3 }), []);
  const popular = useFetch(() => analyticsApi.popularMovies({ limit: 5 }), []);
  const { selectedId } = useSelectedUser();
  const recs = useFetch(() => recommendationsApi.forUser(selectedId, 4), [selectedId], { enabled: selectedId != null });

  return (
    <>
      <PageHeader title="Dashboard" subtitle="What is in the catalog and how people are rating it." />

      <Async state={overview} loadingLabel="Loading overview…">
        {(o) => (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard label="Movies" value={o.totalMovies} icon={Film} />
            <StatCard label="Users" value={o.totalUsers} icon={Users} />
            <StatCard label="Ratings" value={o.totalRatings} icon={MessageSquareText} />
            <StatCard label="Average rating" value={formatRating(o.averageRating)} icon={Star} />
          </div>
        )}
      </Async>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Movies by genre" description="Number of movies in each genre.">
          <Async state={genres} empty={(d) => d.length === 0} emptyTitle="No movies yet" emptyHint="Add a movie or enable sample data to see charts.">
            {(d) => (
              <HorizontalBars
                data={d}
                nameKey="genre"
                valueKey="movieCount"
                valueLabel="Movies"
                label="Number of movies in each genre"
                height={Math.max(200, d.length * 32)}
              />
            )}
          </Async>
        </Section>
        <Section title="Rating distribution" description="How many ratings each star value has received.">
          <Async state={ratings} empty={(d) => d.totalRatings === 0} emptyTitle="No ratings yet" emptyHint="Rate a movie to see the distribution.">
            {(d) => <RatingColumns data={d.distribution} height={Math.max(200, genres.data ? genres.data.length * 32 : 240)} />}
          </Async>
        </Section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Top rated" description="Highest average rating, with at least 3 ratings.">
          <Async state={top} empty={(d) => d.length === 0} emptyTitle="Not enough ratings yet">
            {(d) => (
              <ul className="divide-y divide-line">
                {d.map((m, i) => (
                  <MovieRow key={m.id} movie={m} rank={i + 1} />
                ))}
              </ul>
            )}
          </Async>
        </Section>
        <Section title="Most popular" description="Movies with the most ratings.">
          <Async state={popular} empty={(d) => d.length === 0} emptyTitle="No ratings yet">
            {(d) => (
              <ul className="divide-y divide-line">
                {d.map((m, i) => (
                  <MovieRow
                    key={m.id}
                    movie={m}
                    rank={i + 1}
                    meta={<span className="text-sm tabular-nums text-muted">{m.ratingCount} ratings</span>}
                  />
                ))}
              </ul>
            )}
          </Async>
        </Section>
      </div>

      <Section
        className="mt-6"
        title="Recently added"
        actions={
          <Link to="/movies" className="link text-sm">
            Browse all movies
          </Link>
        }
      >
        <Async state={overview} empty={(d) => d.recentMovies.length === 0} emptyTitle="No movies yet">
          {(o) => (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {o.recentMovies.slice(0, 6).map((m) => (
                <MovieCard key={m.id} movie={m} size="sm" />
              ))}
            </div>
          )}
        </Async>
      </Section>

      <Section
        className="mt-6"
        title="Recommended for a user"
        description="Movies the selected user has not rated yet."
        actions={
          selectedId != null && (
            <Link to={`/recommendations?user=${selectedId}`} className="link text-sm">
              See all recommendations
            </Link>
          )
        }
      >
        <UserSelect id="dashboard-user" label="User" className="mb-4 max-w-xs" />
        {selectedId == null ? (
          <EmptyState title="No users available" hint="Start the backend with sample data to see recommendations." />
        ) : (
          <Async state={recs} empty={(d) => d.recommendations.length === 0} emptyTitle="Nothing to recommend" emptyHint="This user has rated every movie.">
            {(d) => (
              <ul className="grid gap-3 sm:grid-cols-2">
                {d.recommendations.map((r) => (
                  <li key={r.movie.id} className="flex gap-3 rounded border border-line p-2.5">
                    <div className="w-12 shrink-0">
                      <Poster movie={r.movie} size="sm" />
                    </div>
                    <div className="min-w-0">
                      <Link to={`/movies/${r.movie.id}`} className="block truncate font-medium hover:text-accent">
                        {r.movie.title}
                      </Link>
                      <p className="text-xs text-muted">{r.movie.genre}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted">{r.reason}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Async>
        )}
      </Section>
    </>
  );
}
