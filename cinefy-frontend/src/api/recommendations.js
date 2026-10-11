import client from './client';

export const recommendationsApi = {
  forUser: (userId, limit = 6) => client.get(`/api/recommendations/${userId}`, { params: { limit } }).then((r) => r.data),
};
