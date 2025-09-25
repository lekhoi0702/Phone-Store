import axios from 'axios'

const API_BASE_URL = 'http://localhost:5214/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userInfo')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response
  },
  registerCustomer: async (payload) => {
    // Backend expects RegisterRequestDTO at POST /auth/register/customer
    const response = await api.post('/auth/register/customer', payload)
    return response
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
  }
}

// Auth API
export const UserApi = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response
  },
  registerCustomer: async (payload) => {
    // Backend expects RegisterRequestDTO at POST /auth/register/customer
    const response = await api.post('/auth/register/customer', payload)
    return response
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
  }
}

export default api
