"use client";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import UserDropdown from "@/components/UserDropdown";
import Link from "next/link";
import { products } from "@/lib/products";

export default function Dashboard() {
  const categories = ['الكل', 'أدوات', 'إلكترونيات', 'مركبات', 'طاقة', 'طبي'] as const;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
        
        <div className="flex items-center">
          <UserDropdown />
        </div>

        <div className="relative flex-1 max-w-md mx-10">
          <span className="material-symbols-rounded absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">search</span>
          <input 
            type="text"
            className="w-full pr-11 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-right outline-none focus:border-primary focus:bg-white transition-all" 
            placeholder="ابحث عن أدوات، كاميرات، مولدات..." 
          />
        </div>

        <div className="flex items-center gap-5">
          <Link href="/notifications" className="relative cursor-pointer group">
            <span className="material-symbols-rounded text-gray-500 text-[26px] group-hover:text-primary transition-colors">notifications</span>
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </Link>
          <Link href="/" className="text-2xl font-black text-primary italic cursor-pointer">مُتاح</Link>
        </div>

      </header>

      <main className="grow">
        
        <div className="w-full border-b border-gray-100 py-3 mt-0 mb-8 bg-white">
          <div className="px-6 flex items-center justify-start gap-3 overflow-x-auto no-scrollbar">
            {categories.map((cat, i) => (
              <button 
                key={cat} 
                className={`px-7 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  i === 0 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-gray-500 border border-gray-100 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
        
      </main>
      <Footer />
    </div>
  );
}
