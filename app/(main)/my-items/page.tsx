"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { MyProduct } from "@/types/product";
import { useFavorites } from "@/context/FavoritesContext";
import MyItemCard from "@/components/MyItemCard";
import ProductCard from "@/components/ProductCard";
import UserDropdown from "@/components/UserDropdown";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { rentalService } from "@/services/rental.service";
import { queryKeys } from "@/api/queryKeys";
import { AxiosError } from "axios";

export default function ManageItemsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [myItems, setMyItems] = useState<MyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  const { data: rentalRequests } = useQuery({
    queryKey: queryKeys.rentalRequests,
    queryFn: rentalService.getMyRequests,
  });
  const pendingRequestsCount = rentalRequests?.filter((r) => r.owner_status === "pending").length ?? 0;

  const { favoriteProducts, clearFavorites } = useFavorites();

  // ⚠️ مؤقتاً: بدون دمج مع ProductsContext (الـ Context لسا شغال على mock
  // ومعرّفاته ما بتطابق معرّفات المنتجات الحقيقية من الـ API، فالدمج كان
  // بدون أي فائدة فعلية). myItems الآن هو مصدر الحقيقة الوحيد.
  const rentedItems = myItems.filter((item) => item.is_currently_rented);
  const activeItemsCount = myItems.filter((item) => item.status === "active").length;

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        setMyItems(await productService.getMyProducts());
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/my-items/edit/${id}`);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setActionError("");
    setPendingActionId(id);
    try {
      await productService.toggleProductStatus(id);
      const newStatus = currentStatus === "frozen" ? "active" : "frozen";
      setMyItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "تعذّر تغيير حالة المنتج";
      setActionError(message || "تعذّر تغيير حالة المنتج");
    } finally {
      setPendingActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");
    if (!confirmed) return;

    setActionError("");
    setPendingActionId(id);
    try {
      await productService.deleteProduct(id);
      setMyItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      // ⚠️ الباك بيرجع 409 لو في إيجار مقبول حالي/مستقبلي على نفس المنتج
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "تعذّر حذف المنتج";
      setActionError(message || "تعذّر حذف المنتج");
    } finally {
      setPendingActionId(null);
    }
  };

  const stats = [
    { label: "منتجات نشطة", val: activeItemsCount, style: "bg-primary/5 border-primary/10 text-primary" },
    { label: "مؤجرة حالياً", val: rentedItems.length, style: "bg-orange-50 border-orange-100 text-orange-500" },
    { label: "في المفضلة", val: favoriteProducts.length, style: "bg-red-50 border-red-100 text-red-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-xs">

      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">ادارة عناصري</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <div className="flex items-center gap-2">
          <Link href="/add-items/step-1" className="bg-primary text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1 hover:brightness-105 text-xs">
            <span className="material-symbols-rounded text-sm">add</span> إضافة
          </Link>
          <UserDropdown align="left" />
        </div>
      </header>

      <main className="grow max-w-4xl mx-auto w-full p-3 md:p-4">

        {/* إحصائيات */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`${s.style} border p-3 rounded-2xl text-center transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-default`}
            >
              <div className="text-xl font-black leading-none">{s.val}</div>
              <div className="text-xs font-bold mt-1 opacity-80 whitespace-nowrap tracking-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* التبويبات */}
        <div className="bg-gray-50 border border-gray-100 p-1 rounded-xl flex mb-6 shadow-inner">
          {["عناصر معروضة", "مؤجرة حالياً", "المفضلة"].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all outline-none ${
                activeTab === i
                  ? "bg-white text-primary shadow-sm ring-1 ring-primary/5"
                  : "text-gray-400 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* تنبيه الطلبات */}
        {pendingRequestsCount > 0 && (
          <div className="bg-primary/5 border border-primary/10 p-2.5 rounded-xl mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-right">
              <span className="material-symbols-rounded text-primary text-lg leading-none">pending_actions</span>
              <span className="text-xs font-black text-primary">{pendingRequestsCount} طلبات بانتظار قرارك</span>
            </div>
            <Link href="/manage-requests" className="text-xs font-bold text-primary hover:underline">
              عرض الطلبات
            </Link>
          </div>
        )}

        {/* رسالة خطأ عامة لأي فعل (حذف/تجميد) فشل */}
        {actionError && (
          <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold p-2.5 rounded-xl mb-4 text-center">
            {actionError}
          </div>
        )}

        {/* عرض المحتوى */}
        <div className="flex flex-col gap-2.5 pb-12">
          {activeTab === 2 && favoriteProducts.length > 0 && (
            <div className="flex justify-end mb-1">
              <button
                onClick={clearFavorites}
                className="flex items-center gap-1.5 text-red-500 font-bold text-xs hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <span className="material-symbols-rounded text-sm">delete_sweep</span> مسح الكل
              </button>
            </div>
          )}
          {activeTab === 2 ? (
            favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {favoriteProducts.map((item) => (
                  <ProductCard key={item.id} {...item} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-300 font-bold">
                لا توجد عناصر في المفضلة حالياً
              </div>
            )
          ) : isLoading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">جاري جلب البيانات</p>
            </div>
          ) : activeTab === 0 && myItems.length > 0 ? (
            myItems.map((item) => (
              <MyItemCard
                key={item.id}
                product={item}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))
          ) : activeTab === 1 && rentedItems.length > 0 ? (
            rentedItems.map((item) => (
              <MyItemCard
                key={item.id}
                product={item}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="py-20 text-center text-gray-300 font-bold">
              لا توجد عناصر في هذا القسم حالياً
            </div>
          )}
        </div>

      </main>

    </div>
  );
}