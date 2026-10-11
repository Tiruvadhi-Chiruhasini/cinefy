import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Search } from 'lucide-react';
import { moviesApi } from '../api/movies';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { Async } from '../components/States';
import PageHeader from '../components/PageHeader';
import MovieCard from '../components/MovieCard';
import MovieForm from '../components/MovieForm';
import Pagination from '../components/Pagination';

const SORTS = [
  { value: 'title', label: 'Title', defaultDir: 'asc' },
  { value: 'year', label: 'Release year', defaultDir: 'desc' },
  { value: 'rating', label: 'Rating', defaultDir: 'desc' },
  { value: 'popularity', label: 'Popularity', defaultDir: 'desc' },
];
const PAGE_SIZE = 12;

export default function Movies() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('title');
  const [dir, setDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [adding, setAdding] = useState(false);
  const q = useDebounce(query);

  useEffect(() => setPage(0), [q, genre, sort, dir]);

  const genres = useFetch(() => moviesApi.genres(), []);
  const movies = useFetch(
    () => moviesApi.list({ q, genre, sort, dir, page, size: PAGE_SIZE }),
    [q, genre, sort, dir, page],
  );

  function changeSort(value) {
    setSort(value);
    setDir(SORTS.find((s) => s.value === value).defaultDir);
  }

  async function create(payload) {
    await moviesApi.create(payload);
    setAdding(false);
    genres.reload();
    movies.reload();
  }

  const filtered = Boolean(q || genre);

  return (
    <>
      <PageHeader
        title="Movies"
        subtitle="Search, filter and sort the catalog."
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
            <Plus size={16} aria-hidden="true" /> Add movie
          </button>
        }
      />

      <div className="card mb-5 grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
        <div>
          <label htmlFor="movie-search" className="sr-only">
            Search by title
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="movie-search"
              type="search"
              className="input pl-8"
              placeholder="Search by title"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="genre-filter" className="sr-only">
            Filter by genre
          </label>
          <select id="genre-filter" className="input" value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All genres</option>
            {(genres.data ?? []).map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort-by" className="sr-only">
            Sort by
          </label>
          <select id="sort-by" className="input" value={sort} onChange={(e) => changeSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => setDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          aria-label={dir === 'asc' ? 'Sorted ascending. Switch to descending' : 'Sorted descending. Switch to ascending'}
        >
          {dir === 'asc' ? <ArrowUp size={16} aria-hidden="true" /> : <ArrowDown size={16} aria-hidden="true" />}
          {dir === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>

      <Async
        state={movies}
        empty={(d) => d.content.length === 0}
        emptyTitle={filtered ? 'No movies match your filters' : 'No movies yet'}
        emptyHint={filtered ? 'Try a different title or clear the genre filter.' : 'Add your first movie to get started.'}
        emptyAction={
          filtered ? (
            <button type="button" className="btn" onClick={() => { setQuery(''); setGenre(''); }}>
              Clear filters
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setAdding(true)}>
              Add movie
            </button>
          )
        }
      >
        {(d) => (
          <>
            <p className="mb-3 text-sm text-muted" aria-live="polite">
              {d.totalElements} {d.totalElements === 1 ? 'movie' : 'movies'}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {d.content.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
            <Pagination page={d.page} totalPages={d.totalPages} onChange={setPage} />
          </>
        )}
      </Async>

      {adding && <MovieForm genres={genres.data ?? []} onSubmit={create} onClose={() => setAdding(false)} />}
    </>
  );
}
