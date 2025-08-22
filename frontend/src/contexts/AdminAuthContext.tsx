// src/contexts/AdminAuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  adminAuthService,
  type AdminUser,
  type AdminLoginData,
  type Application,
  type User,
} from "@/services/adminAuthService";

interface AdminAuthContextType {
  admin: AdminUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  users: User[];
  applications: Application[];
  login: (data: AdminLoginData) => Promise<void>;
  logout: () => Promise<void>;
  loadUsers: () => Promise<void>;
  loadApplications: () => Promise<void>;
  approveApplication: (id: number) => Promise<void>;
  rejectApplication: (id: number, reason?: string) => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined
);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const isAuthenticated = !!admin;

  const login = async (data: AdminLoginData) => {
    const response = await adminAuthService.login(data);
    console.log("Login response:", response);
    if (response.success && response.user) {
      setAdmin(response.user);
    } else {
      throw new Error(response.message);
    }
  };

  const logout = async () => {
    try {
      await adminAuthService.logout();
    } catch {
      // Même en cas d'erreur, on déconnecte l'admin côté client
    } finally {
      setAdmin(null);
      setUsers([]);
      setApplications([]);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminAuthService.getUsers();
      if (response.success && response.users) {
        setUsers(response.users as User[]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await adminAuthService.getPendingApplications();
      if (response.success && response.applications) {
        setApplications(response.applications as Application[]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
    }
  };

  const approveApplication = async (id: number) => {
    const response = await adminAuthService.approveApplication(id);

    if (response.success) {
      // Recharger les données
      await Promise.all([loadUsers(), loadApplications()]);
    } else {
      throw new Error(response.message);
    }
  };

  const rejectApplication = async (id: number, reason?: string) => {
    const response = await adminAuthService.rejectApplication(id, reason);

    if (response.success) {
      // Recharger les applications
      await loadApplications();
    } else {
      throw new Error(response.message);
    }
  };

  // Vérifier si l'admin est connecté au chargement
  useEffect(() => {
    if (admin) {
      setLoading(false);
      return;
    }

    const checkAdminAuth = async () => {
      try {
        // Vérifier si l'admin est connecté via le service d'auth normal
        // car nous utilisons la même session
        const authResponse = await fetch("/api/auth/check", {
          credentials: "include",
        });
        const authData = await authResponse.json();

        if (
          authData.authenticated &&
          (authData.user?.role === "ADMIN" ||
            authData.user?.role === "admin" ||
            authData.user?.is_admin === true)
        ) {
          setAdmin(authData.user);
        }
      } catch {
        // Pas connecté
      } finally {
        setLoading(false);
      }
    };

    checkAdminAuth();
  }, [admin]);

  // Charger les données quand l'admin se connecte
  useEffect(() => {
    if (admin) {
      Promise.all([loadUsers(), loadApplications()]);
    }
  }, [admin]);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated,
        users,
        applications,
        login,
        logout,
        loadUsers,
        loadApplications,
        approveApplication,
        rejectApplication,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
