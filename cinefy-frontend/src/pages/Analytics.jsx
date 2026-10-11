import { useState } from 'react';
import { analyticsApi } from '../api/analytics';
import { moviesApi } from '../api/movies';
import { useFetch } from '../hooks/useFetch';
import { Async } from '../components/States';
import PageHeader from '../components/PageHeader';
import Section from '../components/Section';
import { HorizontalBars, RatingColumns, TrendLine } from '../components/Charts';

export default function Analytics() {
  const [genre, setGenre] = useState('');
  const genres = useFetch(() => moviesApi.genres(), []);
  const genreCounts = useFetch(() => analyticsApi.genres(), []);
  const ratings = useFetch(() => analyticsApi.ratings(genre), [genre]);
  const top = useFetch(() => analyticsApi.topMovies({ limit: 8, minRatings: 3, genre }), [genre]);
  const popular = useFetch(() => analyticsApi.popularMovies({ limit: 8, genre }), [genre]);

  const scope = genre ? `in ${genre}` : 'across all genres';

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="All figures are calculated by the backend from the database."
        actions={
          <div>
            <label htmlFor="analytics-genre" className="sr-only">
              Filter ratings charts by genre
            </label>
            <select id="analytics-genre" className="input" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">All genres</option>
              {(genres.data ?? []).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Movies per genre" description="Not affected by the genre filter.">
          <Async state={genreCounts} empty={(d) => d.length === 0} emptyTitle="No movies yet">
            {(d) => (
              <HorizontalBars data={d} nameKey="genre" valueKey="movieCount" valueLabel="Movies" label="Number of movies in each genre" height={Math.max(220, d.length * 32)} />
            )}
          </Async>
        </Section>

        <Section title="Rating distribution" description={`Ratings ${scope}.`}>
          <Async state={ratings} empty={(d) => d.totalRatings === 0} emptyTitle="No ratings for this selection">
            {(d) => (
              <>
                <p className="mb-2 text-sm text-muted">
                  {d.totalRatings} ratings, average {d.averageRating.toFixed(2)}
                </p>
                <RatingColumns data={d.distribution} height={Math.max(200, (genreCounts.data?.length ?? 8) * 28)} />
              </>
            )}
          </Async>
        </Section>

        <Section title="Highest rated" description={`Best average rating ${scope}, with at least 3 ratings.`}>
          <Async state={top} empty={(d) => d.length === 0} emptyTitle="Not enough ratings" emptyHint="A movie needs at least 3 ratings to appear here.">
            {(d) => (
              <HorizontalBars
                data={d}
                nameKey="title"
                valueKey="averageRating"
                valueLabel="Average rating"
                label="Highest rated movies by average rating"
                domain={[0, 5]}
                format={(v) => Number(v).toFixed(1)}
                nameWidth={150}
                height={Math.max(200, d.length * 34)}
              />
            )}
          </Async>
        </Section>

        <Section title="Most rated" description={`Movies with the most ratings ${scope}.`}>
          <Async state={popular} empty={(d) => d.length === 0} emptyTitle="No ratings for this selection">
            {(d) => (
              <HorizontalBars data={d} nameKey="title" valueKey="ratingCount" valueLabel="Ratings" label="Most rated movies by number of ratings" nameWidth={150} height={Math.max(200, d.length * 34)} />
            )}
          </Async>
        </Section>

        <Section title="Ratings per month" description={`Number of ratings submitted ${scope}.`}>
          <Async state={ratings} empty={(d) => d.trend.length === 0} emptyTitle="No ratings for this selection">
            {(d) => <TrendLine data={d.trend} valueKey="count" valueLabel="Ratings" label="Ratings submitted per month" />}
          </Async>
        </Section>

        <Section title="Average rating per month" description={`Average star rating by month ${scope}.`}>
          <Async state={ratings} empty={(d) => d.trend.length === 0} emptyTitle="No ratings for this selection">
            {(d) => <TrendLine data={d.trend} valueKey="averageRating" valueLabel="Average rating" label="Average rating per month" domain={[1, 5]} />}
          </Async>
        </Section>
      </div>
    </>
  );
}
