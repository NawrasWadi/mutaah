import { apiClient } from "@/api/client";
import { PublicProduct } from "@/types/product";

export const favoritesService = {
 // ✅ الشكل مؤكد 100% من اختبار Postman: { data: [{ id, saved_at, product: {...} }] }
// كل عنصر بالقائمة هو "saved item wrapper" فيه المنتج الفعلي جوا مفتاح product،
// و governorate/district متغلفين جوا location — نفكهم هون لسهولة الاستخدام
// بكل مكان تاني بالمشروع (ProductCard وغيرها) بدون أي تعديل إضافي عليهم.
getSavedItems: async (): Promise<PublicProduct[]> => {
  const res = await apiClient.get("/saved-items");
  return res.data.data.map((item: {
    product: PublicProduct & { primary_image?: string; location?: { governorate: string; district: string } };
  }) => ({
    ...item.product,
    governorate: item.product.location?.governorate ?? "",
    district: item.product.location?.district ?? "",
  }));
},

  toggleSave: async (productId: string): Promise<{ is_saved: boolean }> => {
    const res = await apiClient.post(`/products/${productId}/toggle-save`);
    // نفس تعامل getSavedItems: نتوقع تغليف { success, data } حسب الشكل
    // العام بالتوثيق، لكن غير مؤكد لهذا الـ endpoint تحديداً بعد.
    return res.data.data ?? res.data;
  },
  removeSavedItem: async (productId: string) => {
    const res = await apiClient.delete(`/saved-items/${productId}`);
    return res.data.data ?? res.data;
  },
};