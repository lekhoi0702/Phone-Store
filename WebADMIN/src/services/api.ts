import axios from 'axios';
import { Brand, Category, CreateBrandRequest, UpdateBrandRequest, CreateCategoryRequest, UpdateCategoryRequest } from '../types';

const API_BASE_URL = 'https://localhost:7000/api'; // Update this to match your WebAPI URL

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
  getAll: async (): Promise<Brand[]> => {
    const response = await api.get<Brand[]>('/brand');
    return response.data;
  },

  getById: async (id: number): Promise<Brand> => {
    const response = await api.get<Brand>(`/brand/${id}`);
    return response.data;
  },

  create: async (data: CreateBrandRequest): Promise<Brand> => {
    const response = await api.post<Brand>('/brand', data);
    return response.data;
  },

  update: async (id: number, data: UpdateBrandRequest): Promise<void> => {
    await api.put(`/brand/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/brand/${id}`);
  },
};

// Category API
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/category');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/category/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await api.post<Category>('/category', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCategoryRequest): Promise<void> => {
    await api.put(`/category/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/category/${id}`);
  },
};

export default api;
