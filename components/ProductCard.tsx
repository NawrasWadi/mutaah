"use client";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  loc: string;
  price: string;
  unit: string;
  icon: string;
  status: string;
}

export default function ProductCard({ name, loc, price, unit, icon, status }: ProductCardProps) {
  const isAvailable = status === "متاح";
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="group bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col w-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
      
      <div className="h-52 bg-primary-light flex items-center justify-center relative m-2 rounded-[32px] overflow-hidden">
        <span className="material-symbols-rounded text-[80px] text-gray-300 font-light transition-transform duration-500 group-hover:scale-110">
          {icon}
        </span>
        
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            isAvailable ? 'bg-white/90 text-primary border-primary/20' : 'bg-orange-50 text-orange-500 border-orange-100'
          }`}>
            {status}
          </span>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all active:scale-75"
        >
          <span 
            className="material-symbols-rounded text-[20px] transition-all duration-300"
            style={{ 
              fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20`,
              color: isFavorite ? '#ef4444' : '#d1d5db' 
            }}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="p-6 pt-2 flex flex-col items-start text-right">
        
        <h3 className="font-bold text-gray-800 text-xl mb-1">
          {name}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
          <span className="material-symbols-rounded text-sm text-primary">location_on</span>
          <span>{loc}</span>
        </div>

        <div className="flex items-center gap-1 mb-6 font-bold text-primary">
           <span className="text-2xl">₪</span>
           <span className="text-2xl">{price}</span>
           <span className="text-gray-400 text-sm font-medium mr-1">/ {unit}</span>
        </div>

        <button className={`w-full py-4 rounded-[32px] font-bold text-lg transition-all shadow-lg active:scale-95 ${
          isAvailable 
            ? 'bg-gradient-to-r from-gradient-start to-gradient-end text-white shadow-primary/20 hover:brightness-105' 
            : 'bg-gray-50 text-gray-300 cursor-not-allowed shadow-none'
        }`}>
          {isAvailable ? 'تأجر الآن' : 'غير متاح'}
        </button>
      </div>
    </div>
  );
}
