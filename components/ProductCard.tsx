// [DESIGN/STRUCTURE] - كارد مضغوط (Compact مستوى -2)
export default function ProductCard({ name, loc, price, unit, icon, status }: any) {
  const isAvailable = status === "متاح";

  return (
    <div className="group bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden">
      
      {/* 1. منطقة الصورة - ارتفاع h-40 بدلاً من h-48 */}
      <div className="h-40 bg-[#f8fafb] m-1.5 rounded-[16px] flex items-center justify-center relative shrink-0">
        <span className="material-symbols-rounded text-6xl text-gray-200 group-hover:scale-105 transition-transform duration-500 font-light italic">
          {icon}
        </span>
        
        {/* شارة الحالة - أصغر */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
            isAvailable ? 'bg-white/90 text-primary border-primary/10' : 'bg-orange-50 text-orange-500 border-orange-100'
          }`}>
            {status}
          </span>
        </div>
      </div>

      {/* 2. منطقة البيانات - تقليل الـ Padding والخطوط */}
      <div className="px-4 py-3 flex flex-col grow text-right">
        
        {/* الاسم - نص أصغر text-[14px] */}
        <h3 className="font-bold text-gray-800 text-[14px] mb-1 leading-tight line-clamp-1">
          {name}
        </h3>
        
        <div className="flex flex-col gap-0 mb-4">
          {/* الموقع */}
          <div className="flex items-center gap-1 text-gray-400 text-[10px]">
            <span className="material-symbols-rounded text-[13px] text-primary/60">location_on</span>
            <span>{loc}</span>
          </div>

          {/* السعر - حجم text-[18px] */}
          <div className="flex items-center gap-1 font-bold text-primary leading-none mt-0.5">
             <span className="text-[18px] tracking-tight">{price}</span>
             <span className="text-[16px]">₪</span>
             <span className="text-gray-400 text-[10px] font-medium mr-1">/ {unit}</span>
          </div>
        </div>

        {/* 3. الزر - ارتفاع py-2.5 بدلاً من py-3.5 */}
        <div className="mt-auto">
          <button className={`w-full py-2.5 rounded-xl font-bold text-[13px] transition-all duration-300 ${
            isAvailable 
            ? 'bg-gradient-to-r from-primary to-[#43a047] text-white shadow-sm' 
            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          }`}>
            {isAvailable ? 'تأجر الآن' : 'غير متاح'}
          </button>
        </div>

      </div>
    </div>
  );
}