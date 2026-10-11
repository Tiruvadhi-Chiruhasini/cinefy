import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Pencil, Trash2 } from 'lucide-react';
import { moviesApi } from '../api/movies';
import { ratingsApi } from '../api/ratings';
import { useFetch } from '../hooks/useFetch';
import { useSelectedUser } from '../hooks/useSelectedUser';
import { Async, EmptyState, ErrorState, LoadingBlock } from '../components/States';
import MovieCard from '../components/MovieCard';
import MovieForm from '../components/MovieForm';
import Poster from '../components/Poster';
import RatingBadge from '../components/RatingBadge';
import RatingInput from '../components/RatingInput';
import Section from '../components/Section';
import UserSelect from '../components/UserSelect';

function RatePanel({ movie, onChanged }) {
  const { selectedId } = useSelectedUser();
  const existing = useFetch(
    () => ratingsApi.list({ userId: selectedId, movieId: movie.id, size: 1 }),
    [selectedId, movie.id],
    { enabled: selectedId != null },
  );
  const current = existing.data?.content?.[0];
  const [value, setValue] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setValue(current?.rating ?? 0);
    setMessage('');
    setError('');
  }, [current?.id, current?.rating, selectedId]);

  async function run(action, success) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(success);
      existing.reload();
      onChanged();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const save = () =>
    run(
      () => (current ? ratingsApi.update(current.id, value) : ratingsApi.create({ userId: selectedId, movieId: movie.id, rating: value })),
      current ? 'Rating updated.' : 'Rating saved.',
    );
  const remove = () => run(() => ratingsApi.remove(current.id), 'Rating removed.');

  return (
    <Section title="Rate this movie" description="Pick a user, then choose 1 to 5 stars. Each user can rate a movie once; saving again updates it.">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,16rem)_1fr] sm:items-end">
        <UserSelect id="rate-user" label="Rating as" />
        <div>
          <RatingInput value={value} onChange={setValue} disabled={busy || selectedId == null || existing.loading} name={`rating-${movie.id}`} />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-primary" disabled={busy || value === 0 || selectedId == null} onClick={save}>
          {current ? 'Update rating' : 'Save rating'}
        </button>
        {current && (
          <button type="button" className="btn" disabled={busy} onClick={remove}>
            Remove rating
          </button>
        )}
        <span role="status" aria-live="polite" className="text-sm text-accent-dark">
          {message}
        </span>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </Section>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = useFetch(() => moviesApi.get(id), [id]);
  const related = useFetch(() => moviesApi.related(id, 4), [id]);
  const genres = useFetch(() => moviesApi.genres(), []);
  const [editing, setEditing] = useState(false);
  const [actionError, setActionError] = useState('');

  const back = (
    <Link to="/movies" className="link mb-4 inline-flex items-center gap-1 text-sm">
      <ChevronLeft size={16} aria-hidden="true" /> All movies
    </Link>
  );

  if (movie.loading && !movie.data) return <LoadingBlock label="Loading movie…" />;
  if (movie.error?.status === 404) {
    return (
      <>
        {back}
        <EmptyState
          title="Movie not found"
          hint="It may have been deleted, or the link is wrong."
          action={
            <Link to="/movies" className="btn">
              Back to movies
            </Link>
          }
        />
      </>
    );
  }
  if (movie.error) return <ErrorState error={movie.error} onRetry={movie.reload} />;
  const m = movie.data;

  async function update(payload) {
    await moviesApi.update(m.id, payload);
    setEditing(false);
    movie.reload();
    related.reload();
    genres.reload();
  }

  async function remove() {
    if (!window.confirm(`Delete "${m.title}" and all of its ratings? This cannot be undone.`)) return;
    try {
      await moviesApi.remove(m.id);
      navigate('/movies');
    } catch (e) {
      setActionError(e.message);
    }
  }

  return (
    <>
      {back}
      <div className="grid gap-6 md:grid-cols-[14rem_1fr]">
        <div className="mx-auto w-44 md:w-full">
          <Poster movie={m} size="lg" />
        </div>
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{m.title}</h1>
              <p className="mt-1 text-sm text-muted">
                {m.genre}, {m.releaseYear}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn" onClick={() => setEditing(true)}>
                <Pencil size={15} aria-hidden="true" /> Edit
              </button>
              <button type="button" className="btn btn-danger" onClick={remove}>
                <Trash2 size={15} aria-hidden="true" /> Delete
              </button>
            </div>
          </div>
          {actionError && (
            <p role="alert" className="mt-2 text-sm text-danger">
              {actionError}
            </p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <RatingBadge value={m.averageRating} count={m.ratingCount} className="text-base" />
            <span className="text-sm text-muted">{m.ratingCount === 0 ? 'No ratings yet' : `${m.ratingCount} ${m.ratingCount === 1 ? 'rating' : 'ratings'}`}</span>
          </div>
          <p className="mt-4 max-w-prose leading-relaxed">{m.description || 'No description has been added for this movie.'}</p>
        </div>
      </div>

      <div className="mt-8">
        <RatePanel
          movie={m}
          onChanged={() => {
            movie.reload();
            related.reload();
          }}
        />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Related movies</h2>
      <Async state={related} empty={(d) => d.length === 0} emptyTitle="No related movies yet" emptyHint={`There are no other ${m.genre} movies in the catalog.`}>
        {(d) => (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {d.map((r) => (
              <MovieCard key={r.id} movie={r} size="sm" />
            ))}
          </div>
        )}
      </Async>

      {editing && <MovieForm movie={m} genres={genres.data ?? []} onSubmit={update} onClose={() => setEditing(false)} />}
    </>
  );
}
