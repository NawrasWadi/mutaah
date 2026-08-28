export type PaymentStatus = "pending" | "verified" | "failed" | "partially_refunded";

export interface SubmitPaymentRequest {
  rental_id: string;
  price_snapshot: number;
  rental_price_total: number;
  deposit_amount: number;
  grand_total: number;
  receipt_image: File;
}

// ⚠️ شكل الرد غير مختبر فعلياً بعد (بانتظار حل مشكلة 500 بـ rental-requests
// أول، لأنه محتاجين rental_id حقيقي لاختبار /payments). بُني على نمط
// الاستجابة المتوقع من باقي endpoints المشابهة (POST /identity-verifications).
export interface Payment {
  id: string;
  rental_id: string;
  price_snapshot: number;
  rental_price_total: number;
  deposit_amount: number;
  grand_total: number;
  status: PaymentStatus;
  admin_note?: string | null; // ⚠️ تخمين بالتماثل مع نمط identity-verifications، غير مؤكد
  created_at: string;
}