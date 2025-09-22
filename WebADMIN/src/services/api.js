import axios from 'axios';

const API_BASE_URL = '/api';

// Tạo axios instance với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Brand API
export const brandAPI = {
  getAll: () => api.get('/brand'),
  getById: (id) => api.get(`/brand/${id}`),
  create: (brand) => api.post('/brand', brand),
  update: (id, brand) => api.put(`/brand/${id}`, brand),
  delete: (id) => api.delete(`/brand/${id}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/category'),
  getById: (id) => api.get(`/category/${id}`),
  create: (category) => api.post('/category', category),
  update: (id, category) => api.put(`/category/${id}`, category),
  delete: (id) => api.delete(`/category/${id}`),
};

// User API
export const userAPI = {
  getAll: () => api.get('/user'),
  getById: (id) => api.get(`/user/${id}`),
  create: (user) => api.post('/user', user),
  update: (id, user) => api.put(`/user/${id}`, user),
  delete: (id) => api.delete(`/user/${id}`),
};

export default api;
