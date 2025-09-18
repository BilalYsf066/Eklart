// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: "CLIENT" | "ARTISAN" | "ADMIN"
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Si l'authentification est requise mais l'utilisateur n'est pas connecté
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Si un rôle spécifique est requis
  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/unauthorized" replace />
  }

  // Si l'utilisateur est connecté mais tente d'accéder aux pages de connexion/inscription
  if (!requireAuth && user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
