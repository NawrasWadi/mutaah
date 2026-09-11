"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { productService } from "@/services/product.service";
import { rentalService } from "@/services/rental.service";
import { ProductDetails } from "@/types/product";
import { useFavorites } from "@/context/FavoritesContext";
import { useUserProfile } from "@/context/UserProfileContext";
import UserDropdown from "@/components/UserDropdown";
import HourPeriodSelect from "@/components/HourPeriodSelect";
import { MONTH_NAMES, DAY_LABELS } from "@/utils/calendar";
import { TimeValue, isTimeComplete, to24Hour, from24Hour } from "@/utils/time";
import { getCategoryLabel } from "@/utils/productCategory";
import RentalRequestModal from "@/components/RentalRequestModal";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const router = useRouter();

  const { toggleFavorite, isFavorite } = useFavorites();
  const { profile } = useUserProfile();
  const isVerified = !!profile?.is_verified;

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  // ✅ التحكم بالشهر المعروض ديناميكياً
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<TimeValue>({ hour: null, period: null });
  const [endTime, setEndTime] = useState<TimeValue>({ hour: null, period: null });

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getProduct(productId);
        setProduct(data);

        // إذا كانت هناك تواريخ متاحة، يتم التوجيه تلقائياً لشهر أول تاريخ متاح
        if (data?.available_dates && data.available_dates.length > 0) {
          const firstDate = new Date(data.available_dates[0]);
          if (!isNaN(firstDate.getTime())) {
            setCurrentDate(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
          }
        }
      } catch {
        setLoadError("تعذّر تحميل بيانات المنتج");
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

  const availableDatesSet = new Set(product?.available_dates ?? []);
  const isAllDay = !!product?.is_all_day;

  // ✅ حساب نطاق الساعات المسموحة مع معالجة حماية القيم الفارغة
  const allowedHours = (() => {
    if (!product || isAllDay) return [];
    if (!product.start_time || !product.end_time) return [];

    const result: { hour: number; period: "ص" | "م" }[] = [];
    const cleanStart = product.start_time.slice(0, 5);
    const cleanEnd = product.end_time.slice(0, 5);

    for (let h = 0; h < 24; h++) {
      const time24 = `${String(h).padStart(2, "0")}:00`;
      if (time24 >= cleanStart && time24 <= cleanEnd) {
        result.push(from24Hour(time24));
      }
    }
    return result;
  })();
  const hasConfiguredHours = isAllDay || allowedHours.length > 0;

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayOffset = new Date(year, monthIndex, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(year, monthIndex - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, monthIndex + 1, 1));

  const calendarCells: { day: number; isoDate: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const isoDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({ day: d, isoDate });
  }

  const selectDay = (isoDate: string) => {
    if (!availableDatesSet.has(isoDate)) return;
    setSelectedDate((prev) => (prev === isoDate ? null : isoDate));
    setStartTime({ hour: null, period: null });
    setEndTime({ hour: null, period: null });
  };

  const selectedStart = isTimeComplete(startTime)
    ? to24Hour(startTime.hour as number, startTime.period as "ص" | "م")
    : null;
  const selectedEnd = isTimeComplete(endTime)
    ? to24Hour(endTime.hour as number, endTime.period as "ص" | "م")
    : null;
  const isTimeRangeValid =
    isAllDay ||
    (!!selectedStart &&
      !!selectedEnd &&
      !!product?.start_time &&
      !!product?.end_time &&
      selectedStart >= product.start_time.slice(0, 5) &&
      selectedEnd <= product.end_time.slice(0, 5) &&
      selectedEnd > selectedStart);
  const isBookingComplete =
    !!selectedDate &&
    hasConfiguredHours &&
    isTimeRangeValid;

  const handlePrevImage = () =>
    setActiveImage((prev) => (product ? (prev === 0 ? product.product_images.length - 1 : prev - 1) : 0));
  const handleNextImage = () =>
    setActiveImage((prev) => (product ? (prev === product.product_images.length - 1 ? 0 : prev + 1) : 0));

  const handleRequestRental = async () => {
    if (!product || !selectedDate) return;

    if (!isVerified) {
      router.push(`/verify-identity?next=/products/${product.id}`);
      return;
    }

    const fullDay = isAllDay;
    const start = fullDay ? "00:00:00" : to24Hour(startTime.hour as number, startTime.period as "ص" | "م") + ":00";
    const end = fullDay ? "23:59:59" : to24Hour(endTime.hour as number, endTime.period as "ص" | "م") + ":00";

    setSubmitError("");
    setIsSubmitting(true);
    try {
      await rentalService.createRequest({
        product_id: product.id,
        start_time: `${selectedDate} ${start}`,
        end_time: `${selectedDate} ${end}`,
      });
      setIsRequestModalOpen(true);
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "حدث خطأ أثناء إرسال طلب الاستئجار";
      setSubmitError(message || "حدث خطأ أثناء إرسال طلب الاستئجار");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">{loadError || "المنتج غير موجود"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-xs text-gray-400 hidden md:block">
            <span className="text-primary cursor-pointer">الرئيسية</span> / {getCategoryLabel(product.category)} / {product.title}
          </div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow max-w-5xl mx-auto w-full p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          <div>
            <div className="relative bg-white rounded-card border border-gray-100 h-72 flex items-center justify-center overflow-hidden mb-3">
              <Image
                src={product.product_images[activeImage]}
                alt={product.title}
                width={640}
                height={288}
                unoptimized
                className="w-full h-full object-contain p-2"
              />

              <button type="button" onClick={() => toggleFavorite(product.id)} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                <span
                  className="material-symbols-rounded text-lg"
                  style={{ fontVariationSettings: `'FILL' ${isFavorite(product.id) ? 1 : 0}`, color: isFavorite(product.id) ? "#ef4444" : "#d1d5db" }}
                >
                  favorite
                </span>
              </button>

              <span className="absolute top-3 right-3 text-xs font-bold text-primary bg-white px-3 py-1 rounded-full shadow-sm">متاح</span>

              {product.product_images.length > 1 && (
                <>
                  <button type="button" onClick={handlePrevImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-rounded text-lg">chevron_right</span>
                  </button>
                  <button type="button" onClick={handleNextImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-rounded text-lg">chevron_left</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5">
              {product.product_images.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all ${activeImage === i ? "w-6 bg-primary" : "w-1.5 bg-gray-200"}`}></span>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-right">
            <div className="bg-white rounded-card border border-gray-100 p-5 space-y-3">
              <h1 className="text-lg font-black text-gray-800">{product.title}</h1>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
                <span className="material-symbols-rounded text-xs">sell</span>
                {getCategoryLabel(product.category)}
              </span>

              <div className="flex items-center gap-2 pt-1">
                <div className="w-9 h-9 rounded-full bg-primary-light border-2 border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-rounded text-primary text-base">person</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{product.owner.full_name}</p>
                  {product.owner.is_verified && (
                    <p className="text-xs text-primary flex items-center gap-0.5">
                      <span className="material-symbols-rounded text-xs">verified</span> موثق
                    </p>
                  )}
                </div>
              </div>

              <div className="h-px bg-gray-100"></div>

              <div>
                <span className="text-2xl font-black text-primary">₪ {product.price_per_hour}</span>
                <span className="text-xs text-gray-400"> / ساعة</span>
              </div>

              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="material-symbols-rounded text-orange-500 text-sm">lock</span>
                رهن التأمين: <strong className="text-orange-500">₪ {product.deposit_amount}</strong> — محتجز حتى الاسترداد
              </p>

              <p className="text-xs text-gray-500 leading-relaxed">{product.description}</p>
            </div>

            {!isVerified && (
              <div className="bg-orange-50 border border-orange-100 rounded-card p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-rounded text-orange-500 text-xl">security</span>
                  <p className="text-xs font-bold text-orange-600">يجب توثيق هويتك أولاً قبل الاستئجار</p>
                </div>
                <Link
                  href={`/verify-identity?next=/products/${product.id}`}
                  className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap hover:brightness-105 transition-all"
                >
                  وثّق الآن
                </Link>
              </div>
            )}

            {/* ✅ تقويم مع أسهم التنقل بين الأشهر */}
            <div className="bg-white rounded-card border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-gray-800 flex items-center gap-1">
                  <span className="material-symbols-rounded text-primary text-sm">calendar_today</span>
                  اختر يوم الاستئجار
                </h3>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-all">
                    <span className="material-symbols-rounded text-gray-600 text-base">chevron_right</span>
                  </button>
                  <span className="text-xs font-bold text-gray-800">{MONTH_NAMES[monthIndex]} {year}</span>
                  <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-all">
                    <span className="material-symbols-rounded text-gray-600 text-base">chevron_left</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_LABELS.map((day) => (
                  <div key={day} className="text-center text-xs text-gray-300 font-bold">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {calendarCells.map(({ day, isoDate }) => {
                  const isAvailable = availableDatesSet.has(isoDate);
                  const isSelected = selectedDate === isoDate;

                  let cellClass = "text-gray-300 cursor-not-allowed";
                  if (isSelected) cellClass = "bg-primary text-white font-bold shadow-md scale-105";
                  else if (isAvailable) cellClass = "bg-primary-light text-gray-700 font-bold hover:bg-primary/20 cursor-pointer";

                  return (
                    <button
                      key={isoDate}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => selectDay(isoDate)}
                      className={`aspect-square rounded-full text-xs transition-all ${cellClass}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 mt-3 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary-light border border-primary"></span> متاح</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-primary"></span> مختار</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-white border border-gray-200"></span> غير متاح</span>
              </div>
            </div>

            {/* ✅ خيارات الحجز والأوقات */}
            {selectedDate && (
              <div className="bg-white rounded-card border border-gray-100 p-4 space-y-3">
                {isAllDay ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
                    <p className="text-xs font-bold text-primary">هذا المنتج متاح طوال اليوم (24 ساعة) لليوم المختار</p>
                  </div>
                ) : !hasConfiguredHours ? (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                    <p className="text-xs font-bold text-red-600">لا توجد ساعات إتاحة محددة لهذا المنتج حالياً</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-primary bg-primary/5 border border-primary/20 rounded-xl p-3 font-bold">
                      متاح من {product.start_time?.slice(0, 5)} إلى {product.end_time?.slice(0, 5)} فقط
                    </p>
                    <div className="space-y-3 pt-1">
                      <div>
                        <p className="text-xs text-gray-500 font-bold mb-1">ساعة البداية</p>
                        <HourPeriodSelect value={startTime} onChange={setStartTime} allowedHours={allowedHours} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold mb-1">ساعة النهاية</p>
                        <HourPeriodSelect value={endTime} onChange={setEndTime} allowedHours={allowedHours} />
                      </div>
                    </div>
                    {isTimeComplete(startTime) && isTimeComplete(endTime) && !isTimeRangeValid && (
                      <p className="text-xs font-bold text-red-500">
                        يجب أن يكون وقت النهاية بعد البداية وضمن ساعات إتاحة المالك
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            {submitError && (
              <p className="text-red-500 text-xs text-center font-bold">{submitError}</p>
            )}

            <button
              type="button"
              disabled={!isBookingComplete || isSubmitting}
              onClick={handleRequestRental}
              className="w-full py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-rounded text-lg">handshake</span>
              {isSubmitting ? "جارِ الإرسال..." : "طلب استئجار"}
            </button>
          </div>
        </div>
      </main>

      <RentalRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
    </div>
  );
}