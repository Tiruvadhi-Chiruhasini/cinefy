import { useSelectedUser } from '../hooks/useSelectedUser';

/** Dropdown for choosing which user the app is acting as (no login in this demo version). */
export default function UserSelect({ id = 'user-select', label = 'User', className = '' }) {
  const { users, loading, error, selectedId, select } = useSelectedUser();
  return (
    <div className={className}>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <select
        id={id}
        className="input"
        value={selectedId ?? ''}
        disabled={loading || users.length === 0}
        onChange={(e) => select(e.target.value)}
      >
        {loading && <option value="">Loading users…</option>}
        {error && <option value="">Could not load users</option>}
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </div>
  );
}
