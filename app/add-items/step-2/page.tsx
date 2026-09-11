"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { AxiosError } from "axios";
import { useAddProduct } from "@/context/AddProductContext";
import UserDropdown from "@/components/UserDropdown";
import HourPeriodSelect from "@/components/HourPeriodSelect";
import { MONTH_NAMES, DAY_LABELS } from "@/utils/calendar";
import { TimeValue, isTimeComplete, to24Hour, getAllHours } from "@/utils/time";
import { productService } from "@/services/product.service";

const ALL_HOURS = getAllHours();

export default function AddProductStep2Page() {
  const router = useRouter();
  const { formData, resetFormData } = useAddProduct();

  // ✅ استخدام تاريخ اليوم ديناميكياً بدل التثبيت على 2025
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isFullDayAvailability, setIsFullDayAvailability] = useState(false);
  const [sharedStart, setSharedStart] = useState<TimeValue>({ hour: null, period: null });
  const [sharedEnd, setSharedEnd] = useState<TimeValue>({ hour: null, period: null });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOffset = new Date(year, monthIndex, 1).getDay();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // ✅ التنقل بين الأشهر
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const calendarCells: { day: number; isoDate: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const isoDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({ day: d, isoDate });
  }

  const toggleSelectDay = (isoDate: string) => {
    if (isoDate < todayIso) return;
    setSelectedDates((prev) =>
      prev.includes(isoDate) ? prev.filter((d) => d !== isoDate) : [...prev, isoDate]
    );
  };

  const selectedStartTime = isTimeComplete(sharedStart)
    ? to24Hour(sharedStart.hour as number, sharedStart.period as "ص" | "م")
    : null;
  const selectedEndTime = isTimeComplete(sharedEnd)
    ? to24Hour(sharedEnd.hour as number, sharedEnd.period as "ص" | "م")
    : null;
  const isTimeRangeValid =
    isFullDayAvailability ||
    (!!selectedStartTime && !!selectedEndTime && selectedEndTime > selectedStartTime);
  const isAvailabilityComplete =
    selectedDates.length > 0 &&
    isTimeRangeValid;

  const handleBack = () => router.push("/add-items/step-1");

  const handlePublish = async () => {
    if (!isAvailabilityComplete) return;

    setSubmitError("");
    setIsSubmitting(true);
    try {
      // ✅ ضبط التنسيق ليطابق متطلبات API بالكامل
      const startTimeFormatted = to24Hour(sharedStart.hour as number, sharedStart.period as "ص" | "م") + ":00";
      const endTimeFormatted = to24Hour(sharedEnd.hour as number, sharedEnd.period as "ص" | "م") + ":00";

      await productService.createProduct({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        price_per_hour: formData.price_per_hour,
        deposit_amount: formData.deposit_amount,
        images: formData.product_images,
        available_dates: selectedDates,
        is_all_day: isFullDayAvailability,
        start_time: isFullDayAvailability ? undefined : startTimeFormatted,
        end_time: isFullDayAvailability ? undefined : endTimeFormatted,
      });

      resetFormData();
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "حدث خطأ أثناء نشر المنتج، حاول مرة أخرى";
      setSubmitError(message || "حدث خطأ أثناء نشر المنتج، حاول مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/add-items/step-1" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">إضافة منتج</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-card p-5 md:p-6 shadow-sm border border-gray-100">
          
          <div className="flex items-center justify-center mb-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                <span className="material-symbols-rounded text-base">check</span>
              </div>
              <span className="text-xs font-bold text-primary">المعلومات</span>
            </div>
            <div className="flex-1 h-0.5 bg-primary mx-2 mb-4"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
              <span className="text-xs font-bold text-primary">الوقت والإتاحة</span>
            </div>
          </div>

          <div className="space-y-4 text-right">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500">
                <span className="material-symbols-rounded text-primary text-sm">calendar_month</span>
                أولاً: اختر أيام التوفر من التقويم
              </label>

              <div className="border border-gray-100 rounded-xl p-3">
                {/* ✅ تم تفعيل أزرار التنقل بين الأشهر */}
                <div className="flex items-center justify-between mb-3">
                  <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                    <span className="material-symbols-rounded text-gray-600 text-base">chevron_right</span>
                  </button>
                  <span className="text-xs font-bold text-gray-800">{MONTH_NAMES[monthIndex]} {year}</span>
                  <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                    <span className="material-symbols-rounded text-gray-600 text-base">chevron_left</span>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_LABELS.map((day) => (
                    <div key={day} className="text-center text-xs text-gray-300 font-bold">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`}></div>)}
                  {calendarCells.map(({ day, isoDate }) => {
                    const isSelected = selectedDates.includes(isoDate);
                    const isPast = isoDate < todayIso;
                    return (
                      <button
                        key={isoDate}
                        type="button"
                        disabled={isPast}
                        onClick={() => toggleSelectDay(isoDate)}
                        className={`aspect-square rounded-full text-xs font-bold transition-all ${
                          isPast
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : isSelected
                              ? "bg-primary text-white"
                              : "bg-primary-light text-gray-700 hover:bg-primary/20"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {selectedDates.length > 0 && (
              <div className="space-y-3 border-t border-gray-100 pt-3">
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <input
                    type="checkbox"
                    checked={isFullDayAvailability}
                    onChange={(e) => setIsFullDayAvailability(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-xs font-bold text-gray-700">متاح خلال جميع ساعات الأيام المختارة (24 ساعة)</span>
                </label>

                {!isFullDayAvailability && (
                  <div className="border border-dashed border-primary/40 rounded-xl p-3 space-y-3">
                    <p className="text-xs text-gray-400 font-bold">من الساعة</p>
                    <HourPeriodSelect value={sharedStart} onChange={setSharedStart} allowedHours={ALL_HOURS} />

                    <p className="text-xs text-gray-400 font-bold">إلى الساعة</p>
                    <HourPeriodSelect value={sharedEnd} onChange={setSharedEnd} allowedHours={ALL_HOURS} />
                    {isTimeComplete(sharedStart) && isTimeComplete(sharedEnd) && !isTimeRangeValid && (
                      <p className="text-xs font-bold text-red-500">
                        يجب أن تكون ساعة النهاية بعد ساعة البداية
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="bg-amber-50 border-r-4 border-amber-400 rounded-xl p-3 flex items-start gap-2">
              <span className="material-symbols-rounded text-amber-500 text-base">info</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>ملاحظة هامة:</strong> سيتم نشر التواريخ المحددة للمؤجرين بشكل ديناميكي بناءً على التقويم الحالي.
              </p>
            </div>

            {submitError && (
              <p className="text-red-500 text-xs text-center font-bold">{submitError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-btn bg-gray-50 text-gray-600 font-bold text-sm border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-rounded text-base">arrow_forward</span>
                رجوع
              </button>
              <button
                type="button"
                disabled={!isAvailabilityComplete || isSubmitting}
                onClick={handlePublish}
                className="flex-[2] py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-rounded text-base">cloud_upload</span>
                {isSubmitting ? "جارِ النشر..." : "حفظ ونشر المنتج"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}