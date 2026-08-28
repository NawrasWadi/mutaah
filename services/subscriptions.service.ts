import { apiClient } from "@/api/client";
import { Plan, MySubscription } from "@/types/subscriptions";
import { UserPlan } from "@/types/auth";

export const subscriptionsService = {
  getPlans: async (): Promise<Plan[]> => {
    const res = await apiClient.get("/subscription-plans");
    return res.data.data;
  },

  // ✅ مصححة بالكامل: دمج بيانات الخطة (plan.*) مع الاستهلاك الحقيقي
  // (listings_used/rentals_used على مستوى أعلى) بكائن واحد يستخدمه الفرونت.
  // كان الكود القديم يرجّع plan فقط، وبالتالي أي فحص لحد النشر الشهري
  // كان يقارن بحقل plan.listings_count_this_month الثابت على صفر دائماً
  // (بيانات الخطة العامة، لا علاقة لها باستهلاك المستخدم)، مما يعطّل
  // Gate Logic الخاص بحد النشر الشهري بصمت تماماً.
  getCurrentPlan: async (): Promise<UserPlan> => {
    const res = await apiClient.get("/my-subscription");
    const data: MySubscription = res.data.data;
    return {
      ...data.plan,
      listings_used_this_month: data.listings_used,
      rentals_used_this_month: data.rentals_used,
    };
  },

  submitSubscriptionReceipt: async (planId: string, receiptImage: File) => {
    const formData = new FormData();
    formData.append("plan_id", planId);
    formData.append("receipt_image", receiptImage);

    const res = await apiClient.post("/subscriptions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};