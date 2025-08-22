// src/services/adminAuthService.ts
import { api, initCsrf } from "@/lib/api";

export interface AdminUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  role: "ADMIN";
  is_admin: boolean;
}

export interface AdminLoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface Application {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  shopName: string;
  description: string | null;
  identityDocument: string;
  submitDate: string;
  status: string;
}

export interface User {
  id: number;
  name: string;
  identifier: string;
  role: string;
  joinDate: string;
  status: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  user?: T;
  users?: T;
  applications?: T;
  error?: string;
}

class AdminAuthService {
  async login(data: AdminLoginData): Promise<ApiResponse<AdminUser>> {
    try {
      await initCsrf();

      const response = await api.post("/admin/login", {
        email: data.email,
        password: data.password,
        remember: data.remember || false,
      });

      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse } };
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Erreur de connexion admin",
        }
      );
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post("/admin/logout");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse } };
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Erreur de déconnexion admin",
        }
      );
    }
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await api.get("/admin/users");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse } };
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Erreur lors de la récupération des utilisateurs",
        }
      );
    }
  }

  async getPendingApplications(): Promise<ApiResponse<Application[]>> {
    try {
      const response = await api.get("/admin/applications");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse } };
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Erreur lors de la récupération des demandes",
        }
      );
    }
  }

  async approveApplication(id: number): Promise<ApiResponse> {
    try {
      const response = await api.post(`/admin/applications/${id}/approve`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse } };
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Erreur lors de l'approbation",
        }
      );
    }
  }

  async rejectApplication(id: number, reason?: string): Promise<ApiResponse> {
    try {
      const response = await api.post(`/admin/applications/${id}/reject`, {
        reason: reason || "",
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse } };
      throw (
        axiosError.response?.data || {
          success: false,
          message: "Erreur lors du rejet",
        }
      );
    }
  }
}

export const adminAuthService = new AdminAuthService();
