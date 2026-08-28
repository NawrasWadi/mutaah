export type RentalRequestStatus = "pending" | "accepted" | "rejected" | "cancelled";
// ⚠️ "cancelled" مضافة بناءً على قسم Cancel بالدوك (rental يصير cancelled بعد الإلغاء)
// لسا غير مؤكد إذا owner_status نفسه بياخد هاي القيمة أو في حقل منفصل

export interface RentalBookingRequest {
  product_id: string;
  start_time: string; // "Y-m-d H:i:s"
  end_time: string;
}

// ✅ مؤكد من اختبار فعلي (POST /rental-requests → 201)
export interface RentalProductOwner {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string | null;
  governorate: string;
  district: string;
  email_verified: number; // 0 | 1 — ⚠️ رقم مش boolean، لاحظتها فعلياً بالرد
  user_status: string;
  role: string;
  plan_id: string;
}

export interface RentalProduct {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  category: string;
  price_per_hour: string; // ⚠️ نص "10.00" مش رقم — لاحظناها فعلياً بالرد
  deposit_amount: string;
  product_images: string[];
  available_dates: string[];
  status: string;
  owner: RentalProductOwner;
}

// الطلب كما يرجع فعلياً من POST /rental-requests و GET /rental-requests
export interface RentalRequest {
  id: string;
  renter_id: string;
  product_id: string;
  start_time: string;
  end_time: string;
  owner_status: RentalRequestStatus;
  created_at: string;
  updated_at?: string;
  product: RentalProduct; // ✅ متداخل بالكامل، مؤكد
}