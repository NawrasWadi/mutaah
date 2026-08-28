"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import UserDropdown from "@/components/UserDropdown";
import { verificationService } from "@/services/verification.service";
import { queryKeys } from "@/api/queryKeys";
import { IdentityVerificationStatus } from "@/types/verification";

export default function VerifyIdentityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/profile";
  const queryClient = useQueryClient();

  const [idImage, setIdImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);

  // التحقق من وجود طلب توثيق سابق عند فتح الصفحة — لم يكن موجوداً بالنسخة القديمة
  const { data: currentVerification, isLoading: isCheckingCurrent } = useQuery({
    queryKey: queryKeys.verification,
    queryFn: verificationService.getCurrent,
  });

  const submitMutation = useMutation({
    mutationFn: () => verificationService.submit(idImage!, selfieImage!),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.verification, data);
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "id" | "selfie"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "id") setIdImage(file);
    else setSelfieImage(file);
  };

  const handleSubmit = () => {
    if (!idImage || !selfieImage) return;
    submitMutation.mutate();
  };

  // إعادة المحاولة بعد رفض — رفع الصورتين من جديد بالكامل
  // (لا يوجد "سبب رفض" مصنّف لتحديد صورة واحدة بعينها، خلافاً للنظام القديم)
  const handleRetry = () => {
    setIdImage(null);
    setSelfieImage(null);
    queryClient.setQueryData(queryKeys.verification, null);
  };

  const status: IdentityVerificationStatus | null =
    currentVerification?.status ?? null;

  if (isCheckingCurrent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/profile" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">توثيق الهوية</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-card p-6 md:p-8 shadow-sm border border-gray-100">

          {/* ===== لا يوجد طلب سابق أو تم رفضه → عرض الفورم ===== */}
          {(!status || status === "rejected") && (
            <div className="text-right space-y-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
                  <span className="material-symbols-rounded text-primary text-xl">shield_person</span>
                  أثبت هويتك
                </h2>
              </div>

              {status === "rejected" && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex gap-2.5">
                  <span className="material-symbols-rounded text-red-500 text-lg shrink-0">cancel</span>
                  <div>
                    <p className="text-xs font-bold text-red-600 mb-1">تم رفض طلبك السابق</p>
                    {/* ⚠️ admin_note غير مؤكد وجوده بالرد — عرض احتياطي فقط */}
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {currentVerification?.admin_note || "يرجى إعادة رفع صور واضحة والمحاولة مجدداً"}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5 flex gap-2.5">
                <span className="material-symbols-rounded text-orange-500 text-lg shrink-0">security</span>
                <div>
                  <p className="text-xs font-bold text-orange-600 mb-1">خطوة التوثيق المطلوبة</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    لضمان أمان عمليات الاستئجار، يرجى تزويدنا بصورة واضحة للهوية وصورة شخصية حديثة.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="border-2 border-dashed border-primary bg-primary-light rounded-section p-4 flex flex-col items-center gap-2 cursor-pointer">
                  {idImage ? (
                    <img src={URL.createObjectURL(idImage)} alt="صورة الهوية" className="w-full h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-rounded text-primary text-2xl">badge</span>
                    </div>
                  )}
                  <span className="text-xs font-bold text-primary text-center">التقط صورة الهوية</span>
                  <span className="text-xs text-gray-400 text-center">الوجه الأمامي</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "id")} />
                </label>

                <label className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-section p-4 flex flex-col items-center gap-2 cursor-pointer">
                  {selfieImage ? (
                    <img src={URL.createObjectURL(selfieImage)} alt="صورة شخصية" className="w-full h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-rounded text-gray-400 text-2xl">account_circle</span>
                    </div>
                  )}
                  <span className="text-xs font-bold text-gray-500 text-center">التقط صورة شخصية</span>
                  <span className="text-xs text-gray-400 text-center">صورة سيلفي واضحة</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "selfie")} />
                </label>
              </div>

              {submitMutation.isError && (
                <p className="text-xs text-red-500 font-bold">
                  حدث خطأ أثناء الإرسال، يرجى المحاولة مجدداً
                </p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!idImage || !selfieImage || submitMutation.isPending}
                className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-rounded text-lg">verified_user</span>
                {submitMutation.isPending ? "جارِ الإرسال..." : "إرسال للتوثيق"}
              </button>
            </div>
          )}

          {/* ===== قيد المراجعة اليدوية ===== */}
          {status === "manual_review" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-rounded text-orange-500 text-3xl">pending_actions</span>
              </div>
              <h2 className="text-lg font-black text-gray-800 mb-2">طلبك قيد المراجعة</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                طلبك الآن قيد المراجعة اليدوية من الإدارة وسيتم إعلامك بالنتيجة قريباً.
              </p>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="w-full py-3 rounded-btn bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-all"
              >
                العودة لحسابي
              </button>
            </div>
          )}

          {/* ===== verified — ⚠️ حالة منفصلة بانتظار توضيح الفرق عن approved من رامي ===== */}
          {status === "verified" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-rounded text-primary text-3xl">verified</span>
              </div>
              <h2 className="text-lg font-black text-gray-800 mb-2">تم التحقق من هويتك</h2>
              <p className="text-xs text-gray-500 mb-6">
                {/* ⚠️ نص مؤقت — غير مؤكد شو الفرق العملي عن "approved" بالنسبة للمستخدم */}
                هويتك قيد الاعتماد النهائي حالياً.
              </p>
              <button
                type="button"
                onClick={() => router.push(nextPath)}
                className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all"
              >
                متابعة
              </button>
            </div>
          )}

          {/* ===== approved — الحالة النهائية المفترضة ===== */}
          {status === "approved" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-rounded text-primary text-3xl">verified</span>
              </div>
              <h2 className="text-lg font-black text-gray-800 mb-2">تم توثيق هويتك بنجاح</h2>
              <p className="text-xs text-gray-500 mb-6">يمكنك الآن إضافة منتجات واستئجارها بكل أمان.</p>
              <button
                type="button"
                onClick={() => router.push(nextPath)}
                className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all"
              >
                متابعة
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}