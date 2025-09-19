// frontend/src/lib/api.ts
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const TOKEN_KEY = 'auth_token'
const ADMIN_TOKEN_KEY = 'admin_auth_token'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
})

// User Token management
export const getAuthToken = (): string | null => localStorage.getItem(TOKEN_KEY)
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}
export const clearAuthToken = (): void => localStorage.removeItem(TOKEN_KEY)

// Admin Token management
export const getAdminAuthToken = (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY)
export const setAdminAuthToken = (token: string): void => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token)
}
export const clearAdminAuthToken = (): void => localStorage.removeItem(ADMIN_TOKEN_KEY)

api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    if (url.startsWith('/admin')) {
      const adminToken = getAdminAuthToken();
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
)

// Handle responses and auth errors
api.interceptors.response.use(
  (response) => {
    // Store new token if it's included in the response
    if (response.data?.token) {
      setAuthToken(response.data.token)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Don't redirect for auth check endpoints
      if (originalRequest.url?.includes('/check')) {
        return Promise.reject(error)
      }
      
      // Clear token and redirect to login
      clearAuthToken()
    }
    
    return Promise.reject(error)
  }
)

// Initialize CSRF token and restore auth state
export const initCsrf = async (): Promise<void> => {
  try {
    await axios.get(`${API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
      withCredentials: true
    })
    
    // Restore auth token if it exists
    const token = getAuthToken()
    if (token) {
      setAuthToken(token)
    }
  } catch (error) {
    console.error('Error initializing CSRF token:', error)
    throw error
  }
}