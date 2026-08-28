export interface AdminDashboardSummary {
  total_users: number;
  active_products: number;
  pending_rental_requests: number;
  pending_payments: number;
  pending_subscriptions: number;
  active_subscriptions: number;
  manual_identity_reviews: number;
  recent_rental_requests: unknown[];
  pending_payments_list: unknown[];
  pending_subscriptions_list: unknown[];
  identity_reviews_list: unknown[];
}

export type PaymentStatus = "pending" | "verified" | "failed" | "partially_refunded";

export interface AdminPayment {
  id: string;
  rental_id: string;
  price_snapshot: number;
  rental_price_total: number;
  deposit_amount: number;
  grand_total: number;
  receipt_image: string;
  payment_status: PaymentStatus;
  created_at?: string;
}

export type AdminSubscriptionStatus = "pending" | "approved" | "rejected";

export interface AdminSubscription {
  id: string;
  plan_id: string;
  user_id: string;
  receipt_image: string;
  status: AdminSubscriptionStatus;
  admin_note?: string;
  created_at?: string;
}

export type AdminVerificationStatus = "manual_review" | "verified" | "approved" | "rejected";

// ✅ مصححة بالكامل حسب اختبار Postman فعلي (2026-08-28) — الشكل الحقيقي
// أغنى بكثير من الافتراض الأصلي، شامل بيانات المستخدم الكاملة متداخلة
export interface AdminVerificationUser {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string | null;
  governorate: string;
  district: string;
  role: string;
}

export interface AdminVerification {
  id: string;
  user_id: string;
  id_image_url: string;      // ⭐ كان id_image بالخطأ
  selfie_image_url: string;  // ⭐ كان selfie_image بالخطأ
  status: AdminVerificationStatus;
  error_status: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  failure_reason: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  user: AdminVerificationUser; // ⭐ حقل جديد بالكامل، مؤكد من الرد الفعلي
}