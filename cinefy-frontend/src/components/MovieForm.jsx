import { useState } from 'react';
import Modal from './Modal';

const EMPTY = { title: '', genre: '', releaseYear: new Date().getFullYear(), posterUrl: '', description: '' };

/** Add / edit dialog. onSubmit receives the payload and should return a promise. */
export default function MovieForm({ movie, genres = [], onSubmit, onClose }) {
  const [form, setForm] = useState(
    movie
      ? {
          title: movie.title,
          genre: movie.genre,
          releaseYear: movie.releaseYear,
          posterUrl: movie.posterUrl ?? '',
          description: movie.description ?? '',
        }
      : EMPTY,
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = 'Title is required.';
    if (!form.genre.trim()) next.genre = 'Genre is required.';
    const year = Number(form.releaseYear);
    if (!Number.isInteger(year) || year < 1888 || year > 2100) next.releaseYear = 'Enter a year between 1888 and 2100.';
    return next;
  }

  async function submit(e) {
    e.preventDefault();
    const problems = validate();
    setErrors(problems);
    setFormError('');
    if (Object.keys(problems).length) return;
    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        genre: form.genre.trim(),
        releaseYear: Number(form.releaseYear),
        posterUrl: form.posterUrl.trim() || null,
        description: form.description.trim() || null,
      });
    } catch (err) {
      setErrors(err.fieldErrors || {});
      setFormError(err.message);
      setSaving(false);
    }
  }

  const field = (id, label, input, error) => (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {input}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <Modal title={movie ? 'Edit movie' : 'Add movie'} onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-3">
        {field(
          'movie-title',
          'Title',
          <input id="movie-title" className="input" value={form.title} onChange={set('title')} maxLength={200} aria-describedby="movie-title-error" />,
          errors.title,
        )}
        <div className="grid grid-cols-2 gap-3">
          {field(
            'movie-genre',
            'Genre',
            <>
              <input id="movie-genre" className="input" list="genre-options" value={form.genre} onChange={set('genre')} maxLength={50} aria-describedby="movie-genre-error" />
              <datalist id="genre-options">
                {genres.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </>,
            errors.genre,
          )}
          {field(
            'movie-year',
            'Release year',
            <input id="movie-year" type="number" className="input" value={form.releaseYear} onChange={set('releaseYear')} aria-describedby="movie-year-error" />,
            errors.releaseYear,
          )}
        </div>
        {field(
          'movie-poster',
          'Poster URL (optional)',
          <input id="movie-poster" type="url" className="input" placeholder="https://…" value={form.posterUrl} onChange={set('posterUrl')} maxLength={500} />,
          errors.posterUrl,
        )}
        {field(
          'movie-description',
          'Description',
          <textarea id="movie-description" rows={4} className="input" value={form.description} onChange={set('description')} maxLength={2000} />,
          errors.description,
        )}
        {formError && (
          <p role="alert" className="text-sm text-danger">
            {formError}
          </p>
        )}
        <div className="flex justify-end gap-2 pt-1">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : movie ? 'Save changes' : 'Add movie'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
