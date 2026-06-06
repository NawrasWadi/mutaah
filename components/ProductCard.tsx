"use client";
import { useState } from "react";

export default function ProductCard({ name, loc, price, unit, icon, status }: any) {
  const isAvailable = status === "متاح";

  // [LOGIC] - حالة المفضلة (تبديل القلب بين الأحمر والرمادي)
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden relative">
      
      {/* 1. منطقة الصورة */}
      <div className="h-40 bg-[#f8fafb] m-1.5 rounded-[16px] flex items-center justify-center relative shrink-0">
        
        {/* أيقونة المنتج */}
        <span className="material-symbols-rounded text-6xl text-gray-200 group-hover:scale-105 transition-transform duration-500 font-light italic">
          {icon}
        </span>
        
        {/* شارة الحالة (أعلى اليمين) */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
            isAvailable ? 'bg-white/90 text-primary border-primary/10' : 'bg-orange-50 text-orange-500 border-orange-100'
          }`}>
            {status}
          </span>
        </div>

     {/* [NEW FEATURE] - زر القلب للمفضلة (أعلى اليسار) */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // يمنع الدخول لصفحة المنتج عند الضغط على القلب
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all active:scale-75"
        >
          <span 
            className="material-symbols-rounded text-[18px] transition-all duration-300"
            style={{ 
              // السطر الجاي هو اللي بيخلي القلب يمتلئ باللون (1 ممتلئ، 0 مفرغ)
              fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20`,
              color: isFavorite ? '#ef4444' : '#d1d5db' 
            }}
          >
            favorite
          </span>
        </button>

      </div>

      {/* 2. منطقة البيانات (باقي الكود كما هو) */}
      <div className="px-4 py-3 flex flex-col grow text-right">
        <h3 className="font-bold text-gray-800 text-[14px] mb-1 leading-tight line-clamp-1">
          {name}
        </h3>
        
        <div className="flex flex-col gap-0 mb-4">
          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
            <span className="material-symbols-rounded text-[13px] text-primary/60">location_on</span>
            <span>{loc}</span>
          </div>
          <div className="flex items-center gap-1 font-bold text-primary leading-none mt-0.5">
             <span className="text-[18px] tracking-tight">{price}</span>
             <span className="text-[16px]">₪</span>
             <span className="text-gray-400 text-[10px] font-medium mr-1">/ {unit}</span>
          </div>
        </div>

        <div className="mt-auto">
          <button className={`w-full py-2.5 rounded-xl font-bold text-[13px] transition-all duration-300 ${
            isAvailable 
            ? 'bg-gradient-to-r from-primary to-[#43a047] text-white' 
            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          }`}>
            {isAvailable ? 'تأجر الآن' : 'غير متاح'}
          </button>
        </div>
      </div>
    </div>
  );
}