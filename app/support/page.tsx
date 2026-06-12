import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "الدعم الفني — مُتاح",
  description: "احصل على المساعدة والدعم الفني لمنصة مُتاح.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="text-lg font-black text-gray-800">الدعم الفني</div>
        <div className="flex-1 flex justify-center">
           <div className="text-2xl font-black text-primary italic select-none">مُتاح</div>
        </div>
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-100 hover:border-red-100"
          >
            <span className="material-symbols-rounded text-[22px]">close</span>
          </Link>
        </div>
      </header>

      <main className="grow flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center text-primary mb-6 shadow-sm">
          <span className="material-symbols-rounded text-4xl">support_agent</span>
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-4">الدعم الفني</h1>
        <p className="text-gray-400 text-sm font-medium max-w-md">
          قريباً سنوفر لك جميع وسائل الدعم والمساعدة. يمكنك التواصل معنا عبر صفحة الاتصال في الوقت الحالي.
        </p>
        <Link 
          href="/contact" 
          className="mt-8 px-8 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:brightness-110 transition-all"
        >
          تواصل معنا
        </Link>
      </main>

      <Footer />
    </div>
  );
}
