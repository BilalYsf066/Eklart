// src/hooks/usePermissions.ts
import { useAuth } from "@/contexts/AuthContext"

export function usePermissions() {
  const { user } = useAuth()

  return {
    isClient: user?.role === "CLIENT",
    isArtisan: user?.role === "ARTISAN",
    isAdmin: user?.role === "ADMIN",
    isApprovedArtisan: user?.role === "ARTISAN" && user?.artisan?.is_approved,
    canSell: user?.role === "ARTISAN" && user?.artisan?.is_approved,
    canManageUsers: user?.role === "ADMIN",
  }
}
