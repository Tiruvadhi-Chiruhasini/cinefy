import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usersApi } from '../api/users';
import { useFetch } from './useFetch';

// Cinefy has no login in this first version. "Acting as" user is chosen from a list
// and remembered in the browser so ratings and recommendations use the same person.
const STORAGE_KEY = 'cinefy.userId';
const UserContext = createContext(null);

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? Number(raw) : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const { data, loading, error, reload } = useFetch(() => usersApi.list({ size: 100 }), []);
  const [selectedId, setSelectedId] = useState(readStored);
  const users = data?.content ?? [];

  // Default to the first user, and recover if the stored id no longer exists.
  useEffect(() => {
    if (users.length === 0) return;
    if (!users.some((u) => u.id === selectedId)) setSelectedId(users[0].id);
  }, [users, selectedId]);

  const select = useCallback((id) => {
    const value = Number(id);
    setSelectedId(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      /* storage can be unavailable (private mode); selection still works for this visit */
    }
  }, []);

  const value = useMemo(
    () => ({ users, loading, error, reload, selectedId, select }),
    [users, loading, error, reload, selectedId, select],
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useSelectedUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useSelectedUser must be used inside <UserProvider>');
  return ctx;
}
