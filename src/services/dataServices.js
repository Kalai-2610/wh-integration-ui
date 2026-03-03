import api from './api';

export const userService = {
  getAll: () => api.get('/api/v1/users'),
  getById: (id) => api.get(`/api/v1/users/${id}`),
  create: (data) => api.post('/api/v1/users', data),
  update: (id, data) => api.patch(`/api/v1/users/${id}`, data),
  delete: (id) => api.delete(`/api/v1/users/${id}`),
};

export const resourceService = {
  getAll: () => api.get('/api/v1/resources'),
  getById: (id) => api.get(`/api/v1/resources/${id}`),
  create: (data) => api.post('/api/v1/resources', data),
  update: (id, data) => api.patch(`/api/v1/resources/${id}`, data),
  delete: (id) => api.delete(`/api/v1/resources/${id}`),
};

export const credentialService = {
  getAll: () => api.get('/api/v1/credentials'),
  getById: (id) => api.get(`/api/v1/credentials/${id}`),
  create: (data) => api.post('/api/v1/credentials', data),
  update: (id, data) => api.patch(`/api/v1/credentials/${id}`, data),
  delete: (id) => api.delete(`/api/v1/credentials/${id}`),
  clearAll: () => api.delete('/api/v1/credentials/clear'),
};
