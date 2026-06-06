"use client";
import Link from "next/link";
import Footer from "../../components/footer";
import { mockNotifications } from "@/mock/notifications.mock";

export default function NotificationsPage() {

  const getIconColor = (color?: "primary" | "orange" | "green") => {
    const colors = {
      orange: "text-orange-500",
      green: "text-green-500",
      primary: "text-primary",
    };
    return colors[color ?? "primary"];
  };
  return (
    <div className="min-h-screen flex flex-col bg-bg-page">
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="text-lg font-black text-gray-800">
          الإشعارات
        </div>
        <div className="flex-1 flex justify-center">
          <div className="text-2xl font-black text-primary italic select-none">مُتاح</div>
        </div>
        <div className="flex items-center">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all border border-gray-200 hover:border-red-100">
            <span className="material-symbols-rounded text-xl">close</span>
          </Link>
        </div>
      </header>
      <main className="grow max-w-4xl mx-auto w-full p-6 py-10">
        <div className="bg-white rounded-container border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-50">
            <h1 className="text-base font-black text-gray-800">كل الإشعارات</h1>
            <button className="text-xs font-bold text-primary hover:underline transition-all">
              تحديد الكل كمقروء
            </button>
          </div>
          <div className="flex flex-col">
            {mockNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex gap-4 p-6 transition-all border-b border-gray-200 last:border-0 hover:bg-gray-50/30 ${!notif.is_read ? "bg-primary/2" : ""}`}
              >
                <div className="shrink-0 pt-1.5">
                  <div className={`w-2 h-2 rounded-full ${notif.is_read ? "bg-gray-200" : "bg-primary shadow-[0_0_8px_rgba(0,167,157,0.4)]"}`}></div>
                </div>

                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-800 mb-1">
                    <span className={`material-symbols-rounded text-lg ${getIconColor(notif.color)}`}>
                      {notif.icon}
                    </span>
                    {notif.title}
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {notif.message}
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
                <div className="text-xs text-gray-300 font-bold whitespace-nowrap pt-1 uppercase">
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