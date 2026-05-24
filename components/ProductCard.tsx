export default function ProductCard({ name, loc, price, unit, icon, status }: any) {
  return (
    /* الكارد مع تأثير الـ Hover */
    <div className="group bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col w-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
      
      {/* الجزء العلوي: الأيقونة والحالة */}
      <div className="h-52 bg-[#f1f7f7] flex items-center justify-center relative m-2 rounded-[28px] overflow-hidden">
        <span className="material-symbols-rounded text-[80px] text-gray-300 font-light transition-transform duration-500 group-hover:scale-110">
          {icon}
        </span>
        
        <div className="absolute top-4 right-4">
          <span className="bg-[#e7f6f2] text-[#00a79d] px-4 py-1.5 rounded-full text-[12px] font-bold border border-[#d1ede6]">
            {status}
          </span>
        </div>
      </div>

      {/* الجزء السفلي: البيانات - محاذاة يمين تامة */}
      <div className="p-6 pt-2 flex flex-col items-start text-right">
        
        {/* اسم المنتج */}
        <h3 className="font-bold text-gray-800 text-[20px] mb-1">
          {name}
        </h3>
        
        {/* الموقع - أيقونة ثم نص (تبدأ من اليمين) */}
        <div className="flex items-center gap-1 text-gray-400 text-[13px] mb-4">
          <span className="material-symbols-rounded text-[18px] text-[#00a79d]">location_on</span>
          <span>{loc}</span>
        </div>

        {/* السعر - عملة ثم رقم ثم وحدة (تبدأ من اليمين) */}
        <div className="flex items-center gap-1 mb-6 font-bold text-[#00a79d]">
           <span className="text-[24px]">₪</span>
           <span className="text-[24px]">{price}</span>
           <span className="text-gray-400 text-[14px] font-medium mr-1">/ {unit}</span>
        </div>

        {/* الزر */}
        <button className="w-full py-4 rounded-[22px] bg-gradient-to-r from-[#00a79d] to-[#43a047] text-white font-bold text-[18px] shadow-lg shadow-[#00a79d]/20 active:scale-95 transition-all">
          تأجر الآن
        </button>
      </div>
    </div>
  );
}