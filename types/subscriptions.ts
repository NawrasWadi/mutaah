export type PlanType = "standard" | "plus" | "pro";

export interface PlanFeature {
  text: string;
  active: boolean;
}

export interface PlanLimits {
  plan_type: PlanType;
  max_listings_per_month: number;
  max_rentals_per_month: number;
  commission_rate: string;
  has_detailed_reports: boolean;
}

export interface Plan extends PlanLimits {
  id: string;
  price: string;
  listings_count_this_month: number;
  rentals_count_this_month: number;
  created_at: string;
  updated_at: string;
}

// 🆕 الشكل الكامل الحقيقي لرد GET /my-subscription — مؤكد من Postman.
// listings_used/rentals_used هما الاستهلاك الفعلي للمستخدم (منفصلان
// تماماً عن plan.listings_count_this_month التي تبقى صفراً دائماً
// لأنها بيانات تعريف الخطة العامة، وليست استهلاكاً شخصياً).
export interface MySubscription {
  plan: Plan;
  subscription: {
    id: string;
    status: string; // "pending" | "active" | "expired" ... — غير مؤكد بعد كل القيم الممكنة
    plan_id: string;
    receipt_image?: string;
  } | null;
  listings_used: number;
  rentals_used: number;
}