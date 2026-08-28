"use client";
import ProductCard from "@/components/ProductCard";
import UserDropdown from "@/components/UserDropdown";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PRODUCT_CATEGORIES } from "@/types/addProduct";
import { getCategoryLabel } from "@/utils/productCategory";
import { useNotifications } from "@/context/NotificationsContext";
import { productService } from "@/services/product.service";
import { queryKeys } from "@/api/queryKeys";

export default function Dashboard() {
  const { unreadCount } = useNotifications();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const categories = ["all", ...PRODUCT_CATEGORIES];

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.products({ category: activeCategory, search: searchTerm, page }),
    queryFn: () =>
      productService.getProducts({
        category: activeCategory === "all" ? undefined : activeCategory,
        page,
      }),
  });

  const products = data?.data ?? [];
  const currentPage = data?.meta?.current_page ?? 1;
  const lastPage = data?.meta?.last_page ?? 1;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1); // نرجع لأول صفحة كل ما نغيّر التصنيف
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex flex-col border-b border-gray-100 bg-white sticky top-0 z-50">

        <div className="flex items-center justify-between px-4 md:px-6 py-3">
          <Link href="/" className="text-2xl font-black text-primary italic cursor-pointer">مُتاح</Link>
          <div className="relative flex-1 max-w-md mx-10 hidden md:block">
            <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-right outline-none focus:border-primary focus:bg-white transition-all"
              placeholder="ابحث عن أدوات، كاميرات، مولدات..."
            />
          </div>

          <div className="flex items-center gap-5">
            <Link href="/notifications" className="relative cursor-pointer group">
              <span className="material-symbols-rounded text-gray-500 text-2xl group-hover:text-primary transition-colors">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </Link>
            <UserDropdown align="left" />
          </div>
        </div>

        <div className="px-4 pb-3 md:hidden">
          <div className="relative">
            <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-right outline-none focus:border-primary focus:bg-white transition-all"
              placeholder="ابحث عن أدوات، كاميرات، مولدات..."
            />
          </div>
        </div>

      </header>

      <main className="grow">

        <div className="w-full border-b border-gray-100 py-3 mb-6 bg-white">
          <div className="px-6 flex items-center justify-start gap-3 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-7 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-500 border border-gray-100 hover:border-primary hover:text-primary"
                }`}
              >
                {cat === "all" ? "الكل" : getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-12">
          {isLoading ? (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">جاري جلب المنتجات</p>
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-red-400 font-bold text-sm">
              حدث خطأ أثناء جلب المنتجات، حاول مرة أخرى
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-gray-300 font-bold">
              لا توجد منتجات بهذا التصنيف حالياً
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>

              {lastPage > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-rounded text-lg">chevron_right</span>
                  </button>

                  {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                        currentPage === p
                          ? "bg-primary text-white shadow-sm"
                          : "border border-gray-200 text-gray-500 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                    disabled={currentPage === lastPage}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-rounded text-lg">chevron_left</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </main>

    </div>
  );
}