import { apiClient } from "@/api/client";
import { RentalBookingRequest, RentalRequest } from "@/types/rental";

export const rentalService = {
  createRequest: async (payload: RentalBookingRequest): Promise<RentalRequest> => {
    const res = await apiClient.post("/rental-requests", payload);
    return res.data.data ?? res.data;
  },

  // ✅ مصححة: الرد paginated (Laravel pagination) — القائمة الفعلية
  // جوا data.data، مش data مباشرة. مؤكد من اختبار فعلي (GET /rental-requests).
  getMyRequests: async (): Promise<RentalRequest[]> => {
    const res = await apiClient.get("/rental-requests");
    return res.data.data?.data ?? [];
  },

  // ⚠️ غير مختبر بعد إذا نفس شكل pagination — افتراض بنفس النمط لحد التأكيد
  getAllRelatedRequests: async (): Promise<RentalRequest[]> => {
    const res = await apiClient.get("/rental-requests/my");
    return res.data.data?.data ?? res.data.data ?? [];
  },

  respondToRequest: async (id: string, status: "accepted" | "rejected") => {
    const res = await apiClient.patch(`/rental-requests/${id}/status`, { status });
    return res.data;
  },

  cancelRequest: async (id: string, reason: string) => {
    const res = await apiClient.patch(`/rental-requests/${id}/cancel`, { reason });
    return res.data;
  },

  // 🔴 جديد: جلب طلب واحد بالتفصيل عبر فلترة القائمة (لا يوجد endpoint مباشر بالدوك)
  // مستخدم من صفحة Checkout بدل GET /rental-requests/{id} غير الموجود
  getRequestById: async (id: string): Promise<RentalRequest | null> => {
    const requests = await rentalService.getMyRequests();
    return requests.find((r) => r.id === id) ?? null;
  },
};