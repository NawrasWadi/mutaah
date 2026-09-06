import { PaymentStatus } from "@/types/payment";

export interface AdminDashboardStats {
  users_count: number;
  active_products_count: number;
  pending_rental_requests_count: number;
  pending_payments_count: number;
  pending_subscriptions_count: number;
  active_subscriptions_count: number;
  manual_identity_reviews_count: number;
}

export interface AdminDashboardSummary {
  stats: AdminDashboardStats;
  recent_rental_requests: unknown[];
  pending_payments: AdminPayment[];
  identity_reviews: unknown[];
  pending_subscriptions: AdminSubscription[];
}

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
  id_image_url: string;
  selfie_image_url: string;
  status: AdminVerificationStatus;
  error_status: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  failure_reason: string | null;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  user: AdminVerificationUser;
}