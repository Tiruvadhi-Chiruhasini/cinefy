import client from './client';

export const ratingsApi = {
  list: (params) => client.get('/api/ratings', { params }).then((r) => r.data),
  create: (payload) => client.post('/api/ratings', payload).then((r) => r.data),
  update: (id, rating) => client.put(`/api/ratings/${id}`, { rating }).then((r) => r.data),
  remove: (id) => client.delete(`/api/ratings/${id}`),
};
