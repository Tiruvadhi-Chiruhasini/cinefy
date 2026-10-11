import client from './client';

export const analyticsApi = {
  overview: () => client.get('/api/analytics/overview').then((r) => r.data),
  genres: () => client.get('/api/analytics/genres').then((r) => r.data),
  ratings: (genre = '') => client.get('/api/analytics/ratings', { params: { genre } }).then((r) => r.data),
  topMovies: (params) => client.get('/api/analytics/top-movies', { params }).then((r) => r.data),
  popularMovies: (params) => client.get('/api/analytics/popular-movies', { params }).then((r) => r.data),
};
