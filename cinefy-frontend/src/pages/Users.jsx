import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { usersApi } from '../api/users';
import { useDebounce } from '../hooks/useDebounce';
import { useFetch } from '../hooks/useFetch';
import { formatDate, formatRating } from '../utils/format';
import { Async } from '../components/States';
import PageHeader from '../components/PageHeader';
import Pagination from '../components/Pagination';

export default function Users() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const q = useDebounce(query);
  useEffect(() => setPage(0), [q]);
  const users = useFetch(() => usersApi.list({ q, page, size: 15 }), [q, page]);

  return (
    <>
      <PageHeader title="Users" subtitle="People who have rated movies. Emails are sample addresses." />
      <div className="mb-4 max-w-sm">
        <label htmlFor="user-search" className="sr-only">
          Search users
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input id="user-search" type="search" className="input pl-8" placeholder="Search by name or email" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <Async state={users} empty={(d) => d.content.length === 0} emptyTitle="No users found" emptyHint={q ? 'Try a different name or email.' : 'There are no users yet.'}>
        {(d) => (
          <>
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <caption className="sr-only">Users and their rating activity</caption>
                <thead className="border-b border-line text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">Name</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Email</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">Ratings</th>
                    <th scope="col" className="px-4 py-2.5 text-right font-medium">Average given</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {d.content.map((u) => (
                    <tr key={u.id} className="hover:bg-paper">
                      <td className="px-4 py-2.5">
                        <Link to={`/users/${u.id}`} className="font-medium hover:text-accent">
                          {u.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-muted">{u.email}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{u.ratingCount}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{formatRating(u.averageRating)}</td>
                      <td className="px-4 py-2.5 text-muted">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={d.page} totalPages={d.totalPages} onChange={setPage} />
          </>
        )}
      </Async>
    </>
  );
}
