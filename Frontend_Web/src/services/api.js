import axios from 'axios';

const API_BASE_URL = 'http://localhost:8817/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom API client that bypasses authentication
const customApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeAPI = {
  getAll: () => api.get('/empleados/'),
  getById: (id) => api.get(`/empleados/${id}/`),
  create: (data) => customApi.post('/empleados/', data),
  update: (id, data) => api.put(`/empleados/${id}/`, data),
  delete: (id) => customApi.delete(`/empleados/${id}/`),
};

export const addressAPI = {
  getAll: () => api.get('/direcciones/'),
  getById: (id) => api.get(`/direcciones/${id}/`),
  create: (data) => customApi.post('/direcciones/', data),
  update: (id, data) => api.put(`/direcciones/${id}/`, data),
  delete: (id) => customApi.delete(`/direcciones/${id}/`),
  getByEmployee: (employeeId) => api.get(`/direcciones/?empleado=${employeeId}`),
};

export default api;
