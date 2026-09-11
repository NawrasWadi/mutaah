import { apiClient } from "@/api/client";
import { PublicProduct, ProductDetails , MyProduct } from "@/types/product";

export interface PaginatedProducts {
  data: PublicProduct[];
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    [key: string]: unknown;
  };
}

interface GetProductsParams {
  page?: number;
  category?: string;
    search?: string;

}

interface CreateProductPayload {
  title: string;
  category: string;
  description: string;
  price_per_hour: string;
  deposit_amount: string;
  images: File[];
  available_dates: string[];
  is_all_day: boolean;
  start_time?: string;
  end_time?: string;
}

export const productService = {
  getProducts: async (params?: GetProductsParams): Promise<PaginatedProducts> => {
    const res = await apiClient.get("/products", { params });
    return res.data;
  },

  // ✅ مؤكد من اختبار Postman فعلي: GET /products?owner=me يرجع منتجات
// المستخدم الحالي بنفس شكل الرد العام (data array مباشرة، بدون pagination إضافي)
getMyProducts: async (): Promise<MyProduct[]> => {
  // إضافة status: "all" لضمان إرجاع المنتجات المجمدة والنشطة معاً
  const res = await apiClient.get("/products", { 
    params: { owner: "me", status: "all" } 
  });
  return res.data.data;
},

  getProduct: async (id: string): Promise<ProductDetails> => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data;
  },

  createProduct: async (payload: CreateProductPayload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("category", payload.category);
    formData.append("description", payload.description);
    formData.append("price_per_hour", payload.price_per_hour);
    formData.append("deposit_amount", payload.deposit_amount);

    payload.images.forEach((file) => {
      formData.append("images[]", file);
    });

    // ✅ مصححة: available_dates[] بدون فهرسة (مطابق للدوك حرفياً)
    payload.available_dates.forEach((date) => {
      formData.append("available_dates[]", date);
    });

    formData.append("is_all_day", payload.is_all_day ? "1" : "0");

    const res = await apiClient.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteProduct: async (id: string) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },

  toggleProductStatus: async (id: string) => {
    const res = await apiClient.post(`/products/${id}/toggle-status`);
    return res.data;
  },

  updateProduct: async (id: string, payload: Partial<CreateProductPayload>) => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    if (payload.title) formData.append("title", payload.title);
    if (payload.category) formData.append("category", payload.category);
    if (payload.description) formData.append("description", payload.description);
    if (payload.price_per_hour) formData.append("price_per_hour", payload.price_per_hour);
    if (payload.deposit_amount) formData.append("deposit_amount", payload.deposit_amount);
    payload.images?.forEach((file) => formData.append("images[]", file));
    // ✅ مصححة: نفس إصلاح available_dates[]
    payload.available_dates?.forEach((date) => formData.append("available_dates[]", date));
    if (payload.is_all_day !== undefined) formData.append("is_all_day", payload.is_all_day ? "1" : "0");

    const res = await apiClient.post(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};