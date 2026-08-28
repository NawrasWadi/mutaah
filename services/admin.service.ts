import { apiClient } from "@/api/client";
import {
  AdminDashboardSummary,
  AdminPayment,
  AdminSubscription,
  AdminVerification,
} from "@/types/admin";

export const adminService = {
  getDashboard: async (): Promise<AdminDashboardSummary> => {
    const res = await apiClient.get("/admin/dashboard");
    return res.data.data ?? res.data;
  },

  // --- Payments ---
  // ✅ الرد مغلّف بـ pagination كاملة (current_page, data, ...) — القائمة
// الفعلية جوا data.data، مؤكد من اختبار Postman فعلي لنفس النمط بـ verifications
getPayments: async (): Promise<AdminPayment[]> => {
  const res = await apiClient.get("/admin/payments");
  return res.data.data?.data ?? [];
},
  verifyPayment: async (id: string) => {
    const res = await apiClient.patch(`/admin/payments/${id}/verify`);
    return res.data;
  },
  rejectPayment: async (id: string) => {
    const res = await apiClient.patch(`/admin/payments/${id}/reject`);
    return res.data;
  },

  // --- Subscriptions ---
getSubscriptions: async (status?: string): Promise<AdminSubscription[]> => {
  const res = await apiClient.get("/admin/subscriptions", { params: status ? { status } : undefined });
  return res.data.data?.data ?? [];
},
  approveSubscription: async (id: string) => {
    const res = await apiClient.patch(`/admin/subscriptions/${id}/approve`);
    return res.data;
  },
  rejectSubscription: async (id: string, adminNote: string) => {
    const res = await apiClient.patch(`/admin/subscriptions/${id}/reject`, { admin_note: adminNote });
    return res.data;
  },

  // --- Identity Verifications ---
  getVerifications: async (status?: string): Promise<AdminVerification[]> => {
  const res = await apiClient.get("/admin/identity-verifications", { params: status ? { status } : undefined });
  return res.data.data?.data ?? [];
},
  approveVerification: async (id: string) => {
    const res = await apiClient.patch(`/admin/identity-verifications/${id}/approve`);
    return res.data;
  },
  rejectVerification: async (id: string, adminNote: string) => {
    const res = await apiClient.patch(`/admin/identity-verifications/${id}/reject`, { admin_note: adminNote });
    return res.data;
  },
};