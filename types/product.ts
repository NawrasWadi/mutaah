import { IdentityVerificationStatus } from "./verification";

export type ProductStatus = 'active' | 'frozen' | 'deleted' | 'pending';

export interface BaseProduct {
  id: string;
  title: string;
  category: string;
  price_per_hour: number;
  status: ProductStatus;
}

// 🆕 كائنات متداخلة مؤكدة من اختبار فعلي (GET /products)
export interface ProductLocation {
  governorate: string;
  district: string;
}

export interface ProductOwnerSummary {
  id: string;
  full_name: string;
  is_verified: boolean; // ✅ boolean بسيط، مش IdentityVerificationStatus enum
}

// ===== منتج للعرض العام (الداشبورد + المفضلة) =====
export interface PublicProduct extends BaseProduct {
  icon: string; // front-end only — يتحدد حسب category
  primary_image?: string;
  location: ProductLocation; // ✅ مصححة: كائن متداخل بدل governorate/district مسطحين
  is_available: boolean; // 🆕 مضافة، كانت ناقصة
  is_currently_rented?: boolean;
}

// ===== منتج اليوزر بصفحة "إدارة عناصري" =====
export interface MyProduct extends BaseProduct {
  deposit_amount: number;
  rental_count?: number; // جعلناه optional لأن الـ API لا يرجعه بـ GET /products?owner=me
  rating?: number;
  expiry_date?: string;
  is_currently_rented?: boolean;
  primary_image?: string;
  description?: string;
  location?: ProductLocation;
}

export interface RentedItem extends MyProduct {
  renter_name: string;
  rental_end_date: string;
}

export interface MyItemsStats {
  active_count: number;
  rented_count: number;
  favorites_count: number;
  pending_requests_count: number;
}

// ⚠️ NOTE: لا يوجد إطلاقاً "ساعات مختلفة لكل يوم" بالـ API — حذف
// DayAvailability القديم بالكامل. available_dates مجرد array من
// نصوص تواريخ بسيطة (Y-m-d)، وstart_time/end_time/is_all_day حقول
// واحدة تخص المنتج كامل، لا علاقة لها بيوم محدد.
// كذلك: لا يوجد حقل is_booked بالرد — تحديد التواريخ المحجوزة
// محتاج مقارنة يدوية مع rental-requests المقبولة (منطق منفصل
// لازم يُبنى لاحقاً، مش جزء من بيانات المنتج نفسه).

export interface ProductDetails extends BaseProduct {
  description: string;
  deposit_amount: number;
  primary_image?: string;
  product_images: string[];
  location: ProductLocation; // ✅ مصححة
  owner: ProductOwnerSummary; // ✅ مصححة بالكامل (كان owner_full_name/owner_identity_status)
  available_dates: string[]; // ✅ مصححة: array من نصوص تواريخ بسيطة "Y-m-d"
  start_time: string; // ✅ حقل واحد للمنتج كامل (H:i:s)
  end_time: string;   // ✅ حقل واحد للمنتج كامل
  is_all_day: boolean; // ✅ حقل واحد للمنتج كامل
  is_available: boolean;
}

// ===== بيانات طلب الحجز (المستأجر) =====
// ⚠️ مصححة لتطابق POST /rental-requests الفعلي: start_time/end_time
// كاملين (تاريخ+وقت بصيغة واحدة)، وليس slots منفصلة لكل يوم —
// مطابق لما بنيناه فعلياً بـ RentalBookingRequest بـ types/rental.ts
export interface RentalBookingRequest {
  product_id: string;
  start_time: string; // "Y-m-d H:i:s"
  end_time: string;
}