// ✅ الشكل مؤكد 100% من اختبار فعلي عبر Postman بتاريخ 2026-08-26

export type NotificationType =
  | "identity_verification" // ✅ مؤكد حرفياً من الباك
  | "rental_status"         // 🔴 افتراضي، لم يُختبر فعلياً بعد
  | "payment_update"        // 🔴 افتراضي، لم يُختبر فعلياً بعد
  | "subscription_update"   // 🔴 افتراضي، لم يُختبر فعلياً بعد
  | "plan_expired";         // 🔴 افتراضي، لم يُختبر فعلياً بعد

export interface Notification {
  id: string;               // UUID — كان number بالخطأ سابقاً
  user_id: string;          // UUID — حقل جديد لم يكن موجوداً
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  ref_id: string;           // UUID — كان number|string بالخطأ سابقاً
  created_at: string;       // ISO timestamp — بديل حقل "time" غير الموجود فعلياً
  updated_at: string;       // ISO timestamp
}

// شكل رد الـ pagination الخاص بالإشعارات — مختلف عن شكل pagination المنتجات!
// هنا كل شيء متداخل جوا "data" نفسها (مؤكد من اختبار GET /notifications فعلي)
export interface NotificationsPaginated {
  success: boolean;
  data: {
    current_page: number;
    data: Notification[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    // باقي الحقول (per_page, prev_page_url, to, total) لم تظهر بالرد الفارغ
    // المُختبر — أضيفي عند ظهورها بأول اختبار فيه بيانات فعلية
    [key: string]: unknown;
  };
}