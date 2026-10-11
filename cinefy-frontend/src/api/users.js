import client from './client';

export const usersApi = {
  list: (params) => client.get('/api/users', { params }).then((r) => r.data),
  get: (id) => client.get(`/api/users/${id}`).then((r) => r.data),
};
