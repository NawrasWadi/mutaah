"use client";
import Link from "next/link";
import RentalRequestCard from "@/components/RentalRequestCard";
import { rentalService } from "@/services/rental.service";
import UserDropdown from "@/components/UserDropdown";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { RentalRequest } from "@/types/rental";

export default function ManageRequestsPage() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      try {
        const data = await rentalService.getMyRequests();
        setRequests(data.filter((r) => r.owner_status === "pending"));
      } catch (error) {
        console.error("Failed to fetch rental requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadRequests();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await rentalService.respondToRequest(id, "accepted");
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to accept request:", error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rentalService.respondToRequest(id, "rejected");
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfcfc] text-xs">
      
      {/* هيدر نحيف جداً مطابق لـ "إدارة عناصري" */}
      <header className="h-12 flex items-center justify-between px-4 border-b border-gray-100 bg-white sticky top-0 z-[100] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/my-items" className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
            <span className="material-symbols-rounded text-base">arrow_forward</span>
          </Link>
          <h1 className="text-xs font-black text-gray-800 tracking-tight">طلبات الاستئجار</h1>
        </div>
        <div className="text-lg font-black text-primary italic">مُتاح</div>
        <UserDropdown />
      </header>

      <main className="grow max-w-4xl mx-auto w-full p-4">
        
        {/* ترويسة الصفحة */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-right">
            <h2 className="text-sm font-black text-gray-800">الطلبات الواردة</h2>
            <p className="text-[10px] text-gray-400 font-bold">لديك {requests.length} طلبات بانتظار قرارك</p>
          </div>
          <span className="material-symbols-rounded text-primary/20 text-4xl">pending_actions</span>
        </div>

        {/* قائمة الطلبات */}
        {isLoading ? (
  <div className="py-20 text-center flex flex-col items-center gap-3">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="text-xs text-gray-400 font-bold">جاري جلب الطلبات</p>
  </div>
) : requests.length > 0 ? (
          <div className="flex flex-col gap-2.5 pb-20">
            {requests.map(req => (
              <RentalRequestCard 
                key={req.id} 
                request={req} 
                onAccept={handleAccept} 
                onReject={handleReject} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-3">
             <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                <span className="material-symbols-rounded text-3xl">inbox</span>
             </div>
             <p className="text-gray-400 font-bold">لا توجد طلبات معلقة حالياً</p>
             <Link href="/dashboard" className="text-primary font-black hover:underline">العودة للداشبورد</Link>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}