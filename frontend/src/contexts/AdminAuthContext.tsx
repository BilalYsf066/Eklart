import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAdminAuthToken, clearAdminAuthToken, getAdminAuthToken } from '@/lib/api'

interface Admin {
  id: number
  name: string
  email: string
}

interface AdminAuthContextType {
  admin: Admin | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const isAuthenticated = !!admin

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = getAdminAuthToken()
      if (token) {
        try {
          const response = await api.get('/admin/auth/user')
          setAdmin(response.data)
        } catch {
          clearAdminAuthToken()
        }
      }
      setLoading(false)
    }
    checkAdminAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/admin/auth/login', { email, password })
      setAdminAuthToken(response.data.token)
      setAdmin(response.data.admin)
      navigate('/admin')
    } catch (error) {
      console.error("Admin login failed", error)
      throw error
    }
  }

  const logout = () => {
    api.post('/admin/auth/logout').finally(() => {
      clearAdminAuthToken()
      setAdmin(null)
      navigate('/admin/login')
    })
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}