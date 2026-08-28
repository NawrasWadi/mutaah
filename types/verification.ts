// ⚠️ نظام أسباب الرفض القديم (VerificationErrorReason, AffectedImage,
// VERIFICATION_ERROR_MESSAGES, ERROR_TO_AFFECTED_IMAGE) انحذف بالكامل.
// السبب: الدوك الرسمي يقول صراحة إن نموذج الـ AI (Colab) غير متصل حالياً،
// وكل طلب يذهب مباشرة لمراجعة يدوية. لا يوجد أي "سبب رفض مصنّف" بالـ API —
// فقط admin_note (نص حر) من الأدمن. ⚠️ خبري لمى: هاد الفيتشر بالكامل
// غير مدعوم حالياً بالباك، وممكن يرجع لاحقاً لو تم تفعيل الـ Colab model.

export type IdentityVerificationStatus =
  | "manual_review"
  | "verified"
  | "approved"
  | "rejected";

export interface IdentityVerification {
  id: string; // UUID
  status: IdentityVerificationStatus;
  // ⚠️ غير مؤكد: هل GET /identity-verifications/current بيرجع admin_note
  // فعلياً للمستخدم؟ الدوك ذكرها بس كـ input بطلب الأدمن (reject)،
  // مش كحقل مؤكد بالرد. يحتاج اختبار Postman فعلي.
  admin_note?: string;
  // ⚠️ غير موثّق ضمن هذا الـ resource تحديداً — افتراض شائع بس غير مؤكد
  created_at?: string;
}