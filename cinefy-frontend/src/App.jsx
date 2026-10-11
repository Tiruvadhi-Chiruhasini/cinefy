import { Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import { UserProvider } from './hooks/useSelectedUser.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Movies from './pages/Movies.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import Users from './pages/Users.jsx';
import UserDetails from './pages/UserDetails.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Analytics from './pages/Analytics.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="movies" element={<Movies />} />
          <Route path="movies/:id" element={<MovieDetails />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetails />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
