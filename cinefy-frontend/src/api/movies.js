import client from './client';

export const moviesApi = {
  list: (params) => client.get('/api/movies', { params }).then((r) => r.data),
  get: (id) => client.get(`/api/movies/${id}`).then((r) => r.data),
  genres: () => client.get('/api/movies/genres').then((r) => r.data),
  related: (id, limit = 4) => client.get(`/api/movies/${id}/related`, { params: { limit } }).then((r) => r.data),
  create: (payload) => client.post('/api/movies', payload).then((r) => r.data),
  update: (id, payload) => client.put(`/api/movies/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/api/movies/${id}`),
};
