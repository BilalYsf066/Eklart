// frontend/src/lib/api.ts
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Ne pas rediriger automatiquement pour les vérifications d'auth
      const isAuthCheck = error.config?.url?.includes('/check')
      if (!isAuthCheck) {
        // Vérifier si c'est une route admin
        const isAdminRoute = error.config?.url?.includes('/admin')
        if (isAdminRoute) {
          // Rediriger vers la page de connexion admin
          window.location.href = '/admin/login'
        } else {
          // Rediriger vers la page de connexion utilisateur
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

// Récupérer le token CSRF au démarrage de l'application
export const initCsrf = async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    })
  } catch (error) {
    console.error('Erreur lors de la récupération du token CSRF:', error)
  }
}