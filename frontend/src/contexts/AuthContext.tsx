// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, type User, type RegisterData } from '@/services/authService'
import { useCart } from '@/hooks/use-cart';

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, phone: string, password: string, remember?: boolean) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { mergeLocalCart, _clearLocalCart, fetchCart } = useCart()


  const isAuthenticated = !!user

  const checkAuth = async () => {
    try {
      const response = await authService.checkAuth()
      if (response.authenticated && response.user) {
        setUser(response.user)
        await fetchCart() // Fetch server cart for authenticated user
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, phone: string, password: string, remember = false) => {
    const response = await authService.login({
      email: email || undefined,
      phone: phone || undefined,
      password,
      remember
    })

    if (response.success && response.user) {
      setUser(response.user)
      await mergeLocalCart() // Merge local cart to server and sync
    } else {
      throw new Error(response.message)
    }
  }

  const register = async (data: RegisterData) => {
    const response = await authService.register(data)

    if (response.success && response.user) {
      setUser(response.user)
      await mergeLocalCart() // Merge local cart to server and sync
    } else {
      throw new Error(response.message + response.error)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Même en cas d'erreur, on déconnecte l'utilisateur côté client
    } finally {
      setUser(null)
      _clearLocalCart()
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}