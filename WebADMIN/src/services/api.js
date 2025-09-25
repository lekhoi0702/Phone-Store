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
      console.log('🔑 Request with token:', {
        url: config.url,
        method: config.method,
        token: token.substring(0, 20) + '...'
      });
    } else {
      console.log('❌ Request without token:', {
        url: config.url,
        method: config.method
      });
      
      // Nếu không có token và không phải là request login, có thể cần redirect
      if (!config.url?.includes('/auth/login')) {
        console.log('⚠️ No token for protected endpoint, this may cause 401');
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('🚪 401 Unauthorized - Token may be invalid or expired');
      
      // Chỉ redirect nếu không phải là request đăng nhập
      if (!error.config?.url?.includes('/auth/login')) {
        console.log('🔄 Redirecting to login page...');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => {
    console.log('🔐 Login request:', credentials);
    return api.post('/auth/login', credentials);
  },
  registerStaff: (staffData) => {
    console.log(' Register staff request:', staffData);
    return api.post('/auth/register/staff', staffData);
  },
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
