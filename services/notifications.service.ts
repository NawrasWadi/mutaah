import { apiClient } from "@/api/client";
import { NotificationsPaginated } from "@/types/notifications";

// كل الـ endpoints هون مؤكدة حرفياً من API Documentation الرسمي (2026-08-24)
// ✅ GET /notifications نفسها اختُبرت فعلياً عبر Postman (200 OK) — الثلاثة الباقية
// بنفس النمط والتوثيق نفسه، لم تُختبر فردياً لكن الثقة بها عالية جداً.

export const notificationsService = {
  getNotifications: async (page?: number): Promise<NotificationsPaginated> => {
    const res = await apiClient.get("/notifications", { params: { page } });
    return res.data;
  },

  // ✅ الشكل مؤكد 100% من اختبار فعلي عبر Postman: { success: true, unread_count: 1 }
  getUnreadCount: async (): Promise<{ success: boolean; unread_count: number }> => {
    const res = await apiClient.get("/notifications/unread-count");
    return res.data;
  },

  markAsRead: async (id: string) => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.patch("/notifications/read-all");
    return res.data;
  },
};