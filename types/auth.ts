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
  fullName: string;
  username: string;
  email: string;
  governorate: string;
  area: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export interface RegisterErrors {
  fullName?: string;
  username?: string;
  email?: string;
  governorate?: string;
  area?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}
 export interface UserProfile {
  full_name: string;
  username: string;
  email: string; 
  phone?: string; 
  governorate: string;
  district: string;
  avatar?: string;
  identity_status?: "pending" | "accepted" | "rejected";
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
  products_count: number;
  rentals_count: number;
}

export interface FinancialSummary {
  rental_price_total: number;
  deposit_amount: number;
}

export interface UserPlan extends PlanLimits {
  listings_count_this_month: number;
  rentals_count_this_month: number;
}