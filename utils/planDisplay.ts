import { PlanType, PlanFeature } from "@/types/subscriptions";

interface PlanDisplayInfo {
  name: string;
  unit: string;
  isPopular: boolean;
  features: PlanFeature[];
}

interface PlanLimitsInput {
  max_listings_per_month: number;
  max_rentals_per_month: number;
  has_detailed_reports: boolean;
  commission_rate: string;
}

// ⚠️ كل هذه القيم محلية بالفرونت فقط — الباك لا يرسل name/features/isPopular
export const getPlanDisplayInfo = (
  planType: PlanType,
  limits: PlanLimitsInput
): PlanDisplayInfo => {
  const map: Record<PlanType, Omit<PlanDisplayInfo, "features">> = {
    standard: { name: "Standard", unit: "", isPopular: false },
    plus: { name: "Plus", unit: "شهرياً", isPopular: true },
    pro: { name: "Pro 💎", unit: "شهرياً", isPopular: false },
  };

  const featuresByPlan: Record<PlanType, PlanFeature[]> = {
    standard: [
      { text: `إضافة منتج واحد/شهرياً`, active: true },
      { text: `استئجار حتى ${limits.max_rentals_per_month} منتجات/شهرياً`, active: true },
      { text: "تقارير تفصيلية", active: false },
      { text: "عمولة مخفضة", active: false },
    ],
    plus: [
      { text: `إضافة حتى ${limits.max_listings_per_month} منتجات`, active: true },
      { text: `استئجار حتى ${limits.max_rentals_per_month} منتجات`, active: true },
      { text: "عمولة مخفضة", active: true },
      { text: "تقارير تفصيلية", active: false },
    ],
    pro: [
      { text: `إضافة حتى ${limits.max_listings_per_month} منتجات`, active: true },
      { text: `استئجار حتى ${limits.max_rentals_per_month} منتجاً`, active: true },
      { text: "تقارير شهرية مفصّلة", active: true },
      { text: "أقل عمولة ممكنة", active: true },
    ],
  };

  return { ...map[planType], features: featuresByPlan[planType] };
};

export const formatPlanPrice = (price: string): string => {
  const num = Number(price);
  return num === 0 ? "مجاناً" : price;
};