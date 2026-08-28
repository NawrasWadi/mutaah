import { apiClient } from "@/api/client";
import { IdentityVerification } from "@/types/verification";

export const verificationService = {
  // POST /identity-verifications (multipart: id_image, selfie_image)
  // الرد المتوقع: طلب جديد بحالة manual_review دايماً
  submit: async (idImage: File, selfieImage: File): Promise<IdentityVerification> => {
    const formData = new FormData();
    formData.append("id_image", idImage);
    formData.append("selfie_image", selfieImage);

    const res = await apiClient.post("/identity-verifications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data ?? res.data;
  },

  // GET /identity-verifications/current
  // ✅ مؤكد من اختبار فعلي: لما ما في طلب سابق، الرد 200 مع
  // { success: true, data: null } — مش 404. الـ catch (لو صار خطأ
  // فعلي: شبكة، 401، إلخ) رح يوصل الـ error object لصاعد للـ caller
  // (useQuery)، مش يتبلع بصمت كـ null.
  getCurrent: async (): Promise<IdentityVerification | null> => {
    const res = await apiClient.get("/identity-verifications/current");
    return res.data.data ?? null;
  },
};