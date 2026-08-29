"use client";
import React from "react";
import { RentalRequest } from "@/types/rental";

interface Props {
  request: RentalRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export default function RentalRequestCard({ request, onAccept, onReject }: Props) {
  const reqData = request as unknown as Record<string, unknown>;

  const requestId = String(reqData.id || reqData.product_id || "");
  const productTitle = String((reqData.product as { title?: string })?.title || reqData.product_title || "طلب إيجار");
  const renterName = String((reqData.renter as { full_name?: string })?.full_name || reqData.renter_name || "مستخدم");
  const totalPrice = Number(reqData.total_price ?? reqData.total_amount ?? 0);
  const startTime = String(reqData.start_time || reqData.start_date || "--:--");
  const endTime = String(reqData.end_time || reqData.end_date || "--:--");

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition-all">
      {/* أيقونة مصغرة */}
      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        <span className="material-symbols-rounded text-xl text-gray-300 italic">
          inventory_2
        </span>
      </div>

      {/* تفاصيل الطلب */}
      <div className="flex-1 min-w-0 text-right">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-bold text-gray-800 text-xs md:text-sm truncate">
            {productTitle}
          </h3>
          <span className="text-[10px] text-primary bg-primary/5 px-1.5 rounded font-bold">جديد</span>
        </div>
        
        <p className="text-[10px] text-gray-500 font-medium">
          المستأجر: <span className="text-gray-800 font-bold">{renterName}</span>
        </p>
        
        <div className="flex items-center gap-2 mt-1 text-[9px] text-gray-400 font-bold italic">
          <span className="flex items-center gap-0.5">
            <span className="material-symbols-rounded text-[12px]">schedule</span> 
            {startTime} - {endTime}
          </span>
          <span className="text-primary font-black">₪{totalPrice}</span>
        </div>
      </div>

      {/* أزرار القبول والرفض */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button 
          onClick={() => onAccept(requestId)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-black hover:brightness-105 transition-all shadow-sm shadow-primary/20"
        >
          <span className="material-symbols-rounded text-sm">check</span>
          <span className="hidden sm:inline">قبول</span>
        </button>
        <button 
          onClick={() => onReject(requestId)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-100 text-red-500 text-[10px] font-black hover:bg-red-50 transition-all"
        >
          <span className="material-symbols-rounded text-sm">close</span>
          <span className="hidden sm:inline">رفض</span>
        </button>
      </div>
    </div>
  );
}