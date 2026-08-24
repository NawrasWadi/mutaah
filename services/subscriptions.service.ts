import { apiClient } from "@/api/client";
import { Plan } from "@/types/subscriptions";
import { UserPlan } from "@/types/auth";

export const subscriptionsService = {
  // جلب كل الخطط المتاحة (Standard / Plus / Pro) للعرض بصفحة /subscriptions
  getPlans: async (): Promise<Plan[]> => {
    const res = await apiClient.get("/plans");
    return res.data;
  },

  // جلب خطة اليوزر الحالية + استهلاكه الشهري (listings_count_this_month, rentals_count_this_month)
  getCurrentPlan: async (): Promise<UserPlan> => {
    const res = await apiClient.get("/subscriptions/current");
    return res.data;
  },
};