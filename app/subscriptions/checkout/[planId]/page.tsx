"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import UserDropdown from "@/components/UserDropdown";
import { subscriptionsService } from "@/services/subscriptions.service";
import { queryKeys } from "@/api/queryKeys";
import { Plan } from "@/types/subscriptions";

const planTypeLabels: Record<Plan["plan_type"], string> = {
  standard: "الأساسية",
  plus: "بلس",
  pro: "المميزة",
};

export default function SubscriptionCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.planId as string;

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // نجيب كل الخطط ونفلتر عن الخطة المطلوبة بالـ URL —
  // لا يوجد endpoint لجلب خطة واحدة بمفردها حسب التوثيق الحالي
  const { data: plans, isLoading } = useQuery({
    queryKey: queryKeys.plans,
    queryFn: subscriptionsService.getPlans,
  });

  const plan = plans?.find((p) => p.id === planId);

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
  };

  const handleRemoveReceipt = () => setReceiptFile(null);

  const handleSubmit = async () => {
    if (!receiptFile) return;
    setSubmitError("");
    setIsSubmitting(true);
    try {
      await subscriptionsService.submitSubscriptionReceipt(planId, receiptFile);
      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى";
      setSubmitError(message || "حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-page">
        <div className="text-gray-400 text-sm font-bold">جارِ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">

      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/subscriptions" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">إتمام الاشتراك</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-card p-6 md:p-8 shadow-sm border border-gray-100">

          <h1 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-5">
            <span className="material-symbols-rounded text-primary text-xl">workspace_premium</span>
            إتمام الاشتراك
          </h1>

          {/* ملخص الخطة */}
          <div className="border border-gray-100 rounded-card p-4 mb-4">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-gray-500">الخطة المختارة</span>
<span className="font-bold text-gray-800">{planTypeLabels[plan.plan_type]}</span>            </div>
            <div className="h-px bg-primary/20 my-2.5"></div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800">المبلغ المطلوب</span>
              <span className="text-2xl font-black text-primary">
                {plan.price !== "مجاناً" && "₪"}{plan.price}
              </span>
            </div>
          </div>

          {/* رفع الإيصال */}
          <div className="space-y-1.5 mb-4">
            <label className="block text-xs font-bold text-gray-500">رفع إيصال الدفع</label>

            {!receiptFile ? (
              <label className="border-2 border-dashed border-primary rounded-card p-6 flex flex-col items-center gap-2.5 cursor-pointer bg-primary-light hover:brightness-[0.98] transition-all">
                <div className="w-13 h-13 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-rounded text-primary text-2xl">upload_file</span>
                </div>
                <p className="text-sm font-bold text-primary-dark">ارفع صورة الإيصال</p>
                <p className="text-xs text-gray-400">JPG, PNG — بعد إتمام التحويل للبنك</p>
                <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleReceiptChange} />
              </label>
            ) : (
              <div className="border border-gray-100 rounded-card p-3 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <Image src={URL.createObjectURL(receiptFile)} alt="معاينة الإيصال" width={56} height={56} unoptimized className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate">{receiptFile.name}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-rounded text-sm">check_circle</span>
                    تم رفع الإيصال بنجاح
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveReceipt}
                  className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 hover:bg-red-100 transition-all"
                >
                  <span className="material-symbols-rounded text-base">close</span>
                </button>
              </div>
            )}
          </div>

          {/* تنبيه المراجعة — مهم: نوضح إنها ليست عملية فورية */}
          <div className="bg-gray-50 rounded-card p-3 mb-4 flex items-start gap-2">
            <span className="material-symbols-rounded text-primary text-sm shrink-0 mt-0.5">info</span>
            <p className="text-xs text-gray-500">
              بعد رفع الإيصال، سيتم مراجعة طلبك من قبل إدارة المنصة، وسيتم تفعيل الخطة الجديدة بعد الموافقة عليه.
            </p>
          </div>

          {submitError && (
            <p className="text-red-500 text-xs text-center font-bold mb-3">{submitError}</p>
          )}

          {/* زر التأكيد */}
          <button
            type="button"
            disabled={!receiptFile || isSubmitting}
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-rounded text-lg">send</span>
            {isSubmitting ? "جارِ الإرسال..." : "إرسال طلب الاشتراك"}
          </button>

          <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1 mt-3">
            <span className="material-symbols-rounded text-primary text-sm">lock</span>
            الدفع مؤمّن — مراجعة يدوية من إدارة المنصة
          </p>

          {submitted && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-primary/10 backdrop-blur-sm">
              <div className="relative bg-white w-full max-w-[360px] rounded-[32px] p-8 shadow-2xl shadow-primary/20 border border-white text-center">

                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-rounded text-green-600 text-3xl">check_circle</span>
                </div>

                <h2 className="text-lg font-black text-gray-800 mb-2">تم إرسال طلبك بنجاح!</h2>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
سيتم مراجعة الإيصال من قبل إدارة المنصة، وسيتم تفعيل خطة {planTypeLabels[plan.plan_type]} فور الموافقة على طلبك.                </p>

                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all"
                >
                  العودة لحسابي
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}