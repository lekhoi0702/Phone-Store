import axios from 'axios';
import { mockBrands, mockCategories } from './mockData';

const API_BASE_URL = 'http://localhost:5214/api'; // Update this to match your WebAPI URL
const USE_MOCK_DATA = false; // Set to false when API is available

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Brand API
export const brandApi = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...mockBrands];
    }
    const response = await api.get('/Brand');
    return response.data;
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockBrands.find(brand => brand.brandId === id);
    }
    const response = await api.get(`/Brand/${id}`);
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newBrand = {
        brandId: Math.max(...mockBrands.map(b => b.brandId)) + 1,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockBrands.push(newBrand);
      return newBrand;
    }
    const response = await api.post('/Brand', data);
    return response.data;
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockBrands.findIndex(brand => brand.brandId === id);
      if (index !== -1) {
        mockBrands[index] = { ...mockBrands[index], ...data, updatedAt: new Date().toISOString() };
      }
      return;
    }
    await api.put(`/Brand/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockBrands.findIndex(brand => brand.brandId === id);
      if (index !== -1) {
        mockBrands.splice(index, 1);
      }
      return;
    }
    await api.delete(`/Brand/${id}`);
  },
};

// Category API
export const categoryApi = {
  getAll: async () => {
    if (USE_MOCK_DATA) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return [...mockCategories];
    }
    const response = await api.get('/category');
    return response.data;
  },

  getById: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCategories.find(category => category.categoryId === id);
    }
    const response = await api.get(`/category/${id}`);
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newCategory = {
        categoryId: Math.max(...mockCategories.map(c => c.categoryId)) + 1,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockCategories.push(newCategory);
      return newCategory;
    }
    const response = await api.post('/category', data);
    return response.data;
  },

  update: async (id, data) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockCategories.findIndex(category => category.categoryId === id);
      if (index !== -1) {
        mockCategories[index] = { ...mockCategories[index], ...data, updatedAt: new Date().toISOString() };
      }
      return;
    }
    await api.put(`/category/${id}`, data);
  },

  delete: async (id) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const index = mockCategories.findIndex(category => category.categoryId === id);
      if (index !== -1) {
        mockCategories.splice(index, 1);
      }
      return;
    }
    await api.delete(`/category/${id}`);
  },
};

export default api;
