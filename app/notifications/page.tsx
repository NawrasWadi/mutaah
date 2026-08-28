"use client";
import { useNotifications } from "@/context/NotificationsContext";
import Link from "next/link";
import Footer from "@/components/Footer";
import UserDropdown from "@/components/UserDropdown";
import { NotificationType } from "@/types/notifications";

export default function NotificationsPage() {
const { notifications, markAllRead, markAsRead } = useNotifications();
  // حساب الأيقونة واللون محلياً حسب type — الباك لا يرسل هذه القيم
const getNotificationIcon = (type: NotificationType) => {
  const map: Record<NotificationType, { icon: string; color: string }> = {
    identity_verification: { icon: "verified_user", color: "text-primary" },
    rental_status: { icon: "event_available", color: "text-orange-500" },
    payment_update: { icon: "payments", color: "text-green-500" },
    subscription_update: { icon: "workspace_premium", color: "text-primary" },
    plan_expired: { icon: "schedule", color: "text-orange-500" },
  };
  return map[type] ?? { icon: "notifications", color: "text-gray-400" };
};

// تنسيق بسيط لعرض created_at كنص تاريخ مقروء
const formatNotificationDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
};

  return (
  
    <div className="min-h-screen flex flex-col bg-bg-page">
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all border border-gray-100">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800 tracking-tight">الإشعارات</div>
        </div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow max-w-4xl mx-auto w-full p-6 py-10">
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <h1 className="text-base font-black text-gray-800">كل الإشعارات</h1>
            <button onClick={markAllRead} className="text-sm font-bold text-primary hover:underline transition-all">
  تحديد الكل كمقروء
</button>
          </div>
          <div className="flex flex-col">
            {notifications.map((notif) => (
              <div
  key={notif.id}
  onClick={() => !notif.is_read && markAsRead(notif.id)}
  className={`flex gap-4 p-6 transition-all border-b border-gray-200 last:border-0 hover:bg-gray-50/30 cursor-pointer ${!notif.is_read ? "bg-primary/[0.02]" : ""}`}
>
                <div className="shrink-0 pt-1.5">
                  <div className={`w-2 h-2 rounded-full ${notif.is_read ? "bg-gray-200" : "bg-primary shadow-[0_0_8px_rgba(0,167,157,0.4)]"}`}></div>
                </div>

                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-800 mb-1">
                    <span className={`material-symbols-rounded text-sm ${getNotificationIcon(notif.type).color}`}>
  {getNotificationIcon(notif.type).icon}
</span>
                    {notif.title}
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {notif.message}
                  </p>
{/*
                  {notif.hasActions && (
                    <div className="flex gap-2 mt-4">
                      <button className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold hover:brightness-105 transition-all">
                        قبول الطلب
                      </button>
                      <button className="border border-gray-100 text-gray-400 px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
                        رفض
                      </button>
                    </div>
                  )} */}
{/*
                  {notif.actionLabel && (
  <Link
    href={`/checkout/${notif.ref_id}`}
    className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:brightness-105 transition-all flex items-center gap-2 mt-4 shadow-lg shadow-primary/10 w-fit"
  >
    <span className="material-symbols-rounded text-sm font-bold">arrow_back</span>
    {notif.actionLabel}
  </Link>
)} */}
                </div>

               <div className="text-xs text-gray-300 font-bold whitespace-nowrap pt-1 uppercase">
  {formatNotificationDate(notif.created_at)}
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
