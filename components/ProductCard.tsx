interface ProductCardProps {
  name: string;
  loc: string;
  price: string;
  unit: string;
  icon: string;
  status: string;
}

export default function ProductCard({ name, loc, price, unit, icon, status }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col w-full transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer">
      
      <div className="h-52 bg-primary-light flex items-center justify-center relative m-2 rounded-[28px] overflow-hidden">
        <span className="material-symbols-rounded text-[80px] text-gray-300 font-light transition-transform duration-500 group-hover:scale-110">
          {icon}
        </span>
        
        <div className="absolute top-4 right-4">
          <span className="bg-primary-light text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-primary/20">
            {status}
          </span>
        </div>
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

        <button className="w-full py-4 rounded-[22px] bg-gradient-to-r from-gradient-start to-gradient-end text-white font-bold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-all">
          تأجر الآن
        </button>
      </div>
    </div>
  );
}