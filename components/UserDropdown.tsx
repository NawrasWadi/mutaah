"use client";
import { useState } from "react";
import Link from "next/link";

// أضفنا تعريف الـ Props هنا
interface UserDropdownProps {
  align?: "left" | "right"; // علامة الاستفهام تعني أنه اختياري
}

export default function UserDropdown({ align = "right" }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // تحديد الكلاسات بناءً على الـ align
  // إذا كان اليسار (في صفحة البروفايل)، نستخدم left-0
  // إذا كان اليمين (في الداشبورد)، نستخدم right-0
  const alignmentClass = align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

  return (
    <div className="relative z-[200]">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#e0f7fa] border-2 border-[#b2ebf2] flex items-center justify-center text-primary cursor-pointer hover:shadow-md transition-all active:scale-90"
      >
        <span className="material-symbols-rounded text-[22px]">person</span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)}></div>
          
          {/* استخدمنا المتغير alignmentClass هنا 👇 */}
          <div className={`absolute top-12 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-[200] animate-in fade-in zoom-in duration-200 text-right ${alignmentClass}`}>
            
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <div className="text-[14px] font-bold text-gray-800">أحمد سالم</div>
              <div className="text-[11px] text-gray-400 font-medium">@ahmed_salem</div>
            </div>

            <div className="p-1">
              {[
                { label: "حسابي", icon: "account_circle", href: "/profile" },
                { label: "إدارة عناصري", icon: "inventory_2", href: "/my-items" },
                { label: "إضافة عنصر", icon: "add_box", href: "/add-item" },
                { label: "الاشتراكات", icon: "workspace_premium", href: "/subscriptions" },
              ].map((item, index) => (
                <Link 
                  href={item.href}
                  key={index}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-gray-600 cursor-pointer hover:bg-primary-light hover:text-primary transition-colors rounded-lg group"
                >
                   <span className="material-symbols-rounded text-[18px] text-gray-400 group-hover:text-primary transition-colors">{item.icon}</span>
                   <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              <div className="h-[1px] bg-gray-50 my-1 mx-2"></div>

              <Link href="/logout" className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-500 cursor-pointer hover:bg-red-50 transition-colors rounded-lg group">
                <span className="material-symbols-rounded text-[18px]">logout</span>
                <span className="font-medium">تسجيل خروج</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}