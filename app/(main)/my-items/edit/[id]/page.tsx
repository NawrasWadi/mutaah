"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { productService } from "@/services/product.service";
import { ProductDetails } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/utils/productCategory";
import { getCategoryLabel } from "@/utils/productCategory";
import UserDropdown from "@/components/UserDropdown";
import HourPeriodSelect from "@/components/HourPeriodSelect";
import { MONTH_NAMES, DAY_LABELS } from "@/utils/calendar";
import { TimeValue, isTimeComplete, to24Hour, from24Hour, getAllHours } from "@/utils/time";

type ImageSlot = string | File;
const ALL_HOURS = getAllHours();

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [images, setImages] = useState<ImageSlot[]>([]);

  // ⭐ التحكم بالشهر المعروض ديناميكياً (نفس نمط صفحة تفاصيل المنتج)
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isFullDayAvailability, setIsFullDayAvailability] = useState(false);
  const [sharedStart, setSharedStart] = useState<TimeValue>({ hour: null, period: null });
  const [sharedEnd, setSharedEnd] = useState<TimeValue>({ hour: null, period: null });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getProduct(productId);
        setProduct(data);
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setPricePerHour(String(data.price_per_hour));
        setDepositAmount(String(data.deposit_amount));
        setImages(data.product_images);

        // ⭐ تعبئة الحالة الحالية للمنتج بدل ما تفضل فاضية
        setSelectedDates(data.available_dates ?? []);
        setIsFullDayAvailability(!!data.is_all_day);
        if (!data.is_all_day && data.start_time && data.end_time) {
          setSharedStart(from24Hour(data.start_time.slice(0, 5)));
          setSharedEnd(from24Hour(data.end_time.slice(0, 5)));
        }

        // ⭐ توجيه التقويم تلقائياً لشهر أول تاريخ متاح موجود فعلاً
        if (data.available_dates && data.available_dates.length > 0) {
          const firstDate = new Date(data.available_dates[0]);
          if (!isNaN(firstDate.getTime())) {
            setCurrentDate(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
          }
        }
      } catch (error) {
        setLoadError("تعذّر تحميل بيانات المنتج");
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [productId]);

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

  const toggleSelectDay = (isoDate: string) => {
    setSelectedDates((prev) =>
      prev.includes(isoDate) ? prev.filter((d) => d !== isoDate) : [...prev, isoDate]
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || images.length >= 4) return;
    setImages((prev) => [...prev, file]);
  };

  const handleFreeze = async () => {
    try {
      await productService.toggleProductStatus(productId);
      setProduct((prev) => (prev ? { ...prev, status: prev.status === "frozen" ? "active" : "frozen" } : prev));
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.");
    if (!confirmed) return;
    try {
      await productService.deleteProduct(productId);
      router.push("/my-items");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "تعذّر حذف المنتج";
      alert(message || "تعذّر حذف المنتج، قد يكون عليه حجز نشط");
    }
  };

  const handleSave = async () => {
    setSaveError("");
    setIsSaving(true);
    try {
      const newImages = images.filter((img): img is File => img instanceof File);
      await productService.updateProduct(productId, {
        title,
        category,
        description,
        price_per_hour: pricePerHour,
        deposit_amount: depositAmount,
        images: newImages,
        available_dates: selectedDates,
        is_all_day: isFullDayAvailability,
        ...(isFullDayAvailability
  ? {}
  : {
      start_time: to24Hour(sharedStart.hour as number, sharedStart.period as "ص" | "م") + ":00",
      end_time: to24Hour(sharedEnd.hour as number, sharedEnd.period as "ص" | "م") + ":00",
    }),
    
      });
      router.push("/my-items");
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "حدث خطأ أثناء حفظ التعديلات";
      setSaveError(message || "حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setIsSaving(false);
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
          <Link href="/my-items" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">تعديل المنتج</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-card p-5 md:p-6 shadow-sm border border-gray-100">

          <div className="flex items-center justify-end gap-2 mb-5 pb-4 border-b border-gray-100">
            <button
              type="button"
              onClick={handleFreeze}
              className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 transition-all"
            >
              <span className="material-symbols-rounded text-sm">
                {product.status === "frozen" ? "play_arrow" : "pause_circle"}
              </span>
              {product.status === "frozen" ? "إعادة تفعيل" : "تجميد"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-all"
            >
              <span className="material-symbols-rounded text-sm">delete</span>
              حذف
            </button>
          </div>

          <div className="space-y-4 text-right">

            {/* الصور */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500">صور المنتج — اضغط لحذف أو إضافة</label>
              <div className="grid grid-cols-4 gap-2">
                {images.map((imgSlot, i) => (
                  <div key={i} className="relative aspect-square rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                    <img
                      src={typeof imgSlot === "string" ? imgSlot : URL.createObjectURL(imgSlot)}
                      alt="معاينة المنتج"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 left-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <span className="material-symbols-rounded text-xs">close</span>
                    </button>
                  </div>
                ))}

                {images.length < 4 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-primary bg-primary-light flex flex-col items-center justify-center gap-0.5 cursor-pointer">
                    <span className="material-symbols-rounded text-xl text-primary">add_photo_alternate</span>
                    <span className="text-xs text-gray-400">إضافة</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAddImage} />
                  </label>
                )}
              </div>
            </div>

            {/* اسم المنتج */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">اسم المنتج</label>
              <div className="relative">
                <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">inventory_2</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* التصنيف */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">تصنيف المنتج</label>
              <div className="relative">
                <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pr-11 pl-10 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none appearance-none cursor-pointer focus:bg-white focus:border-primary transition-all"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                  ))}
                </select>
                <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* الوصف */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500">وصف المنتج</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all resize-none"
              />
            </div>

            {/* السعر والتأمين */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">سعر الإيجار / ساعة (₪)</label>
                <div className="relative">
                  <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">payments</span>
                  <input
                    type="text"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500">مبلغ التأمين (₪)</label>
                <div className="relative">
                  <span className="material-symbols-rounded absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">security</span>
                  <input
                    type="text"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100"></div>

            {/* الكاليندر — الأيام المتاحة الحالية معروضة ديناميكياً */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1 text-xs font-bold text-gray-500">
                <span className="material-symbols-rounded text-primary text-sm">calendar_today</span>
                الأيام المتاحة (الأيام المختارة حالياً محددة باللون)
              </label>

              <div className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-all">
                    <span className="material-symbols-rounded text-gray-600 text-base">chevron_right</span>
                  </button>
                  <span className="text-xs font-bold text-gray-800">{MONTH_NAMES[monthIndex]} {year}</span>
                  <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-all">
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
                    return (
                      <button
                        key={isoDate}
                        type="button"
                        onClick={() => toggleSelectDay(isoDate)}
                        className={`aspect-square rounded-full text-xs font-bold transition-all ${
                          isSelected ? "bg-primary text-white shadow-sm" : "bg-primary-light text-gray-700 hover:bg-primary/20"
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
                  </div>
                )}
              </div>
            )}

            {saveError && <p className="text-red-500 text-xs text-center font-bold">{saveError}</p>}

            <div className="flex gap-3 pt-2">
              <Link
                href="/my-items"
                className="flex-1 py-3 rounded-btn bg-gray-50 text-gray-600 font-bold text-sm border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-rounded text-base">arrow_forward</span>
                رجوع
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-[2] py-3 rounded-btn bg-linear-to-r from-primary to-green-harvest text-white font-bold text-sm shadow-lg shadow-primary/10 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-rounded text-base">save</span>
                {isSaving ? "جارِ الحفظ..." : "حفظ التعديلات"}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}