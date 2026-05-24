"use client";
import Link from "next/link";
import UserDropdown from "../../components/UserDropdown";
import Footer from "../../components/footer";

export default function NotificationsPage() {

  // ---------------------------------------------------------
  // [CONTENT/DATA] - (هذه البيانات سيتم جلبها من السيرفر لاحقاً)
  // ---------------------------------------------------------
  const notifications = [
    { id: 1, title: "طلب استئجار جديد", desc: 'أحمد محمد يريد استئجار "كاميرا سوني A7 III"', time: "منذ 5 د", isRead: false, icon: "inventory_2", color: "primary", hasActions: true },
    { id: 2, title: "تم استلام مبلغ الرهن", desc: "تم احتجاز ₪ 300 داخل المنصة بنجاح", time: "منذ 1 س", isRead: false, icon: "lock", color: "orange" },
    { id: 3, title: "تم إعادة المنتج بسلامة", desc: 'أعادت سمر خالد "مثقاب بوش"', time: "أمس", isRead: true, icon: "move_to_inbox", color: "green" },
    { id: 4, title: "تم قبول طلبك!", desc: 'وافق أحمد على طلب استئجار "كاميرا سوني A7 III"', time: "3 أيام", isRead: true, icon: "check_circle", color: "primary", actionLabel: "اضغط هنا لاستكمال عملية الإيجار" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      
      {/* // [DESIGN/STRUCTURE] - الهيدر المعدل (عكس الاتجاهات + زر الرجوع) */}
      {/* // [DESIGN/STRUCTURE] - الهيدر (X أقصى اليمين، لوجو في الوسط، كلمة الإشعارات يسار) */}
      {/* // [DESIGN/STRUCTURE] - الهيدر (الإشعارات يمين، لوجو نص، X شمال) */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        
        {/* 1. أقصى اليمين: عنوان الصفحة */}
        <div className="text-lg font-black text-gray-800">
          الإشعارات
        </div>

        {/* 2. المنتصف: اللوجو */}
        <div className="flex-1 flex justify-center">
           <div className="text-2xl font-black text-primary italic select-none">مُتاح</div>
        </div>

        {/* 3. أقصى اليسار: زر الإغلاق (X) */}
        <div className="flex items-center">
          <Link 
            href="/dashboard" 
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-200 hover:border-red-100"
          >
            <span className="material-symbols-rounded text-[22px]">close</span>
          </Link>
        </div>

      </header>

      {/* // [DESIGN/STRUCTURE] - المحتوى الرئيسي */}
      <main className="grow max-w-4xl mx-auto w-full p-6 py-10">
        
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <h1 className="text-base font-black text-gray-800">كل الإشعارات</h1>
            <button className="text-[13px] font-bold text-primary hover:underline transition-all">
              تحديد الكل كمقروء
            </button>
          </div>

          <div className="flex flex-col">
            {/* // [CONTENT/DATA] - عرض الإشعارات مع الخط الفاصل الرفيع */}
            {notifications.map((notif, index) => (
              <div 
                key={notif.id} 
                 /* الخط الفاصل صار أغمق (border-gray-200) ليكون واضحاً */
                className={`flex gap-4 p-6 transition-all border-b border-gray-200 last:border-0 hover:bg-gray-50/30 ${!notif.isRead ? 'bg-primary/[0.02]' : ''}`}
>
                <div className="shrink-0 pt-1.5">
                  <div className={`w-2 h-2 rounded-full ${notif.isRead ? 'bg-gray-200' : 'bg-primary shadow-[0_0_8px_rgba(0,167,157,0.4)]'}`}></div>
                </div>

                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 font-bold text-[14px] text-gray-800 mb-1">
                    <span className={`material-symbols-rounded text-[18px] ${
                      notif.color === 'orange' ? 'text-orange-500' : 
                      notif.color === 'green' ? 'text-green-500' : 'text-primary'
                    }`}>
                      {notif.icon}
                    </span>
                    {notif.title}
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {notif.desc}
                  </p>

                  {notif.hasActions && (
                    <div className="flex gap-2 mt-4">
                      <button className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold hover:brightness-105 transition-all">
                        قبول الطلب
                      </button>
                      <button className="border border-gray-100 text-gray-400 px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
                        رفض
                      </button>
                    </div>
                  )}

                  {notif.actionLabel && (
                    <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:brightness-105 transition-all flex items-center gap-2 mt-4 shadow-lg shadow-primary/10">
                      <span className="material-symbols-rounded text-sm font-bold">arrow_back</span>
                      {notif.actionLabel}
                    </button>
                  )}
                </div>

                <div className="text-[10px] text-gray-300 font-bold whitespace-nowrap pt-1 uppercase">
                  {notif.time}
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}