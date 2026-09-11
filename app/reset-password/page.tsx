"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import { authService } from "@/services/auth.service";
import { ResetPasswordErrors } from "@/types/auth";

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ⚠️ لو الرابط ناقص token أو email — الفورم عادي بيوصل الخطأ من السيرفر
  // (422) لما يحاول يرسل، بس نفضل نعرض تحذير مبكر بدل ما ننتظر submit
  const isLinkInvalid = !token || !email;

  const validate = (): boolean => {
    const newErrors: ResetPasswordErrors = {};
    if (!password || password.length < 8) {
      newErrors.password = "كلمة السر يجب أن تكون 8 أحرف على الأقل";
    }

    if (passwordConfirmation !== password) {
      newErrors.password_confirmation = "كلمتا السر غير متطابقتين";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      await authService.resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      setIsSuccess(true);
    } catch (err) {
      let message = "حدث خطأ، حاول مرة أخرى";
      if (err instanceof AxiosError) {
        // ⚠️ رسالة الباك المحتملة: توكن منتهي (60 دقيقة) أو غير صالح
        message = err.response?.data?.message || message;
      }
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
        <div className="bg-white w-full max-w-[340px] rounded-[32px] p-8 shadow-sm border border-gray-100 text-center">
          <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary-mid flex items-center justify-center text-primary shadow-sm mb-4 mx-auto">
            <span className="material-symbols-rounded text-[32px]">check_circle</span>
          </div>
          <h2 className="text-[18px] font-black text-gray-800 mb-2">تم تحديث كلمة السر بنجاح</h2>
          <p className="text-gray-400 text-[11px] leading-relaxed mb-6">
            يمكنك الآن تسجيل الدخول بكلمة السر الجديدة
          </p>
          <Link
            href="/login"
            className="w-full inline-block py-3.5 rounded-[32px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-[15px] shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
      <div className="bg-white w-full max-w-[340px] rounded-[32px] p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary-mid flex items-center justify-center text-primary shadow-sm mb-4">
            <span className="material-symbols-rounded text-[32px]">lock_reset</span>
          </div>
          <h2 className="text-[18px] font-black text-gray-800 mb-2">تعيين كلمة سر جديدة</h2>
          <p className="text-gray-400 text-[11px] leading-relaxed">
            أدخل كلمة السر الجديدة وتأكيدها
          </p>
        </div>

        {isLinkInvalid && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4">
            <p className="text-red-500 text-xs text-center">
              رابط إعادة التعيين غير صالح أو ناقص. تأكد من فتح الرابط كاملاً من بريدك الإلكتروني.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative group">
            <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              lock
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة السر الجديدة"
              className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
            />
          </div>
          {errors.password && <p className="text-red-500 text-xs text-right">{errors.password}</p>}

          <div className="relative group">
            <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
              lock
            </span>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="تأكيد كلمة السر"
              className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
            />
          </div>
          {errors.password_confirmation && (
            <p className="text-red-500 text-xs text-right">{errors.password_confirmation}</p>
          )}
        </div>

        {errors.general && (
          <p className="text-red-500 text-xs text-center mt-3">{errors.general}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || isLinkInvalid}
          className="w-full py-3.5 mt-5 rounded-[32px] bg-gradient-to-r from-primary to-[#43a047] text-white font-bold text-[15px] shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "جارِ الحفظ..." : "حفظ كلمة السر الجديدة"}
        </button>

        <Link
          href="/login"
          className="w-full mt-4 flex items-center justify-center gap-2 text-gray-400 text-[12px] font-bold hover:text-primary transition-colors"
        >
          <span className="material-symbols-rounded text-[18px]">arrow_forward</span>
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-bg-page">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}