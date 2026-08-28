import { apiClient } from "@/api/client";
import { SubmitPaymentRequest, Payment } from "@/types/payment";

export const paymentService = {
  // POST /payments (multipart) — ⚠️ لم يُختبر فعلياً بعد، بانتظار rental_id
  // حقيقي (معلّق بسبب 500 في POST /rental-requests)
  submit: async (payload: SubmitPaymentRequest): Promise<Payment> => {
    const formData = new FormData();
    formData.append("rental_id", payload.rental_id);
    formData.append("price_snapshot", String(payload.price_snapshot));
    formData.append("rental_price_total", String(payload.rental_price_total));
    formData.append("deposit_amount", String(payload.deposit_amount));
    formData.append("grand_total", String(payload.grand_total));
    formData.append("receipt_image", payload.receipt_image);

    const res = await apiClient.post("/payments", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data ?? res.data;
  },

  // GET /payments — طلباتي (كمستأجر)
  getMyPayments: async (): Promise<Payment[]> => {
    const res = await apiClient.get("/payments");
    // ⚠️ افتراض: نفس نمط pagination المكتشف بـ rental-requests، غير مؤكد بعد لهذا الـ endpoint تحديداً
    return res.data.data?.data ?? res.data.data ?? [];
  },
};