// frontend/src/lib/api.ts
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
const TOKEN_KEY = 'auth_token'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
})

// Token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const clearAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  delete api.defaults.headers.common['Authorization']
}

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    const isAdminRoute = config.url?.includes('/admin')
    
    // Only add token if it's not an admin route (admin uses different auth)
    if (token && !isAdminRoute) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (isAdminRoute && typeof config.headers.Authorization === 'string' && config.headers.Authorization.startsWith('Bearer ')) {
      // Ensure we don't send user token to admin routes
      delete config.headers.Authorization
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
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
      
      // Redirect based on route
      const isAdminRoute = originalRequest.url?.includes('/admin')
      window.location.href = isAdminRoute ? '/admin/login' : '/login'
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