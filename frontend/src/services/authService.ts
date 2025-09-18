// src/services/authService.ts
import { api, initCsrf, setAuthToken, clearAuthToken } from '@/lib/api'

export interface User {
  id: number
  first_name: string
  last_name: string
  full_name: string
  email: string | null
  phone: string | null
  role: 'CLIENT' | 'ARTISAN' | 'ADMIN'
  is_artisan: boolean
  artisan?: {
    shop_name: string
    description: string | null
    validation_status: 'PENDING' | 'APPROVED' | 'REJECTED'
    is_approved: boolean
  }
}

export interface RegisterData {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  password: string
  confirmPassword: string
  isArtisan: boolean
  shopName?: string
  description?: string
  identityDocument?: File
}

export interface LoginData {
  email?: string
  phone?: string
  password: string
  remember?: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  user?: T
  error?: string
  token?: string
}

class AuthService {
  async register(data: RegisterData): Promise<ApiResponse<User>> {
    try {
      await initCsrf()
      
      const formData = new FormData()
      formData.append('first_name', data.firstName)
      formData.append('last_name', data.lastName)
      formData.append('password', data.password)
      formData.append('password_confirmation', data.confirmPassword)
      formData.append('is_artisan', data.isArtisan ? '1' : '0')
      formData.append('role', data.isArtisan ? 'ARTISAN' : 'CLIENT')
      formData.append('is_active', '1')

      if (data.email) {
        formData.append('email', data.email)
      }
      
      if (data.phone) {
        formData.append('phone', data.phone)
      }
      
      if (data.isArtisan) {
        if (data.shopName) {
          formData.append('shop_name', data.shopName)
        }
        if (data.description) {
          formData.append('description', data.description)
        }
        if (data.identityDocument) {
          formData.append('identity_document', data.identityDocument)
        }
      }

      const response = await api.post('/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      // Store the token if it exists
      if (response.data.token) {
        setAuthToken(response.data.token)
      }
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse } }
      throw axiosError.response?.data || { success: false, message: 'Erreur de connexion' }
    }
  }

  async login(data: LoginData): Promise<ApiResponse<User>> {
    try {
      await initCsrf()
      
      const response = await api.post('/auth/login', {
        email: data.email || null,
        phone: data.phone || null,
        password: data.password,
        remember: data.remember || false
      })

      // Store the token if it exists
      if (response.data.token) {
        setAuthToken(response.data.token)
      }

      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse } }
      throw axiosError.response?.data || { success: false, message: 'Erreur de connexion' }
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post('/auth/logout')
      // Clear the token on logout
      clearAuthToken()
      return response.data
    } catch (error: unknown) {
      // Clear token even if there's an error
      clearAuthToken()
      const axiosError = error as { response?: { data?: ApiResponse } }
      throw axiosError.response?.data || { success: false, message: 'Erreur de déconnexion' }
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get('/auth/user')
      return response.data
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse } }
      throw axiosError.response?.data || { success: false, message: 'Erreur lors de la récupération des données utilisateur' }
    }
  }

  async checkAuth(): Promise<{ authenticated: boolean; user?: User }> {
    try {
      const response = await api.get('/auth/check')
      // If we get a new token, store it
      if (response.data.token) {
        setAuthToken(response.data.token)
      }
      return response.data
    } catch {
      // Clear token if check fails
      clearAuthToken()
      return { authenticated: false }
    }
  }
}

export const authService = new AuthService()