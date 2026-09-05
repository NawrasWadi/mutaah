import { PlanLimits } from "@/types/subscriptions";

export interface LoginFormData {
  identifier: string;
  password: string;
}

export interface LoginErrors {
  identifier?: string;
  password?: string;
}

export interface RegisterFormData {
  full_name: string;
  username: string;
  email: string;
  phone: string;
  governorate: string;
  district: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface RegisterErrors {
  full_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  governorate?: string;
  district?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  governorate: string;
  district: string;
  avatar: string | null;
  is_verified: boolean;
  subscription_plan: string;
    role?: "user" | "admin";
  stats: UserStats;
}

export interface ProfileErrors {
  full_name?: string;
  username?: string;
  email?: string;
  phone?: string;
  governorate?: string;
  district?: string;
}

export interface UserStats {
  my_products_count: number;
  my_rentals_count: number;
  rental_earnings: number;
  held_deposits: number;
}

export interface UserPlan extends PlanLimits {
  listings_used_this_month: number;
  rentals_used_this_month: number;
}

// 🆕 معادة: كانت انحذفت سهواً عند إعادة كتابة UserProfile — لازمة لـ auth.service.ts
export interface ResetPasswordFormData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordErrors {
  password?: string;
  password_confirmation?: string;
  general?: string;
}