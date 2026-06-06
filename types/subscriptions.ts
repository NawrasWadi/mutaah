import { PlanType } from "@/types/auth";
export interface PlanFeature {
  text: string;
  active: boolean;
}

export interface Plan {
  plan_type:PlanType ;
  name: string;
  price: string;
  unit: string;
  max_listings_per_month: number;
  max_rentals_per_month: number;
  commission_rate: number;
  has_detailed_reports: boolean;
  features: PlanFeature[];
  isPopular: boolean;
  buttonText: string;
}