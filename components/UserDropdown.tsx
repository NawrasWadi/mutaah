"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserProfile } from "@/context/UserProfileContext";
import { authService } from "@/services/auth.service";
import { tokenStorage } from "@/utils/tokenStorage";

const menuItems = [
  { label: "حسابي", icon: "account_circle", href: "/profile" },
  { label: "الإشعارات", icon: "notifications", href: "/notifications" },
  { label: "إدارة عناصري", icon: "inventory_2", href: "/my-items" },
  { label: "إضافة عنصر", icon: "add_box", href: "/add-items/step-1" },
  { label: "الاشتراكات", icon: "workspace_premium", href: "/subscriptions" },
] as const;

// ⭐ قائمة منفصلة كلياً للأدمن — بدون أي روابط خاصة باليوزر العادي
const adminMenuItems = [
  { label: "لوحة التحكم", icon: "admin_panel_settings", href: "/admin/dashboard" },
] as const;

interface UserDropdownProps {
  align?: "left" | "right";
}

export default function UserDropdown({ align = "right" }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useUserProfile();
const isAdmin = tokenStorage.getRole() === "admin";
const router = useRouter();
const queryClient = useQueryClient();

const handleLogout = async () => {
  setIsOpen(false);
  try {
    await authService.logout(); // POST /logout — يبطل التوكن من طرف الباك
  } catch {
    // ⚠️ نتجاهل فشل الطلب عمداً (مثلاً توكن منتهي أصلاً) — الهدف
    // الأساسي هو تسجيل الخروج محلياً بغض النظر عن رد السيرفر
  } finally {
    tokenStorage.clear(); // حذف التوكن + الدور محلياً
    queryClient.clear(); // ✅ تفريغ كل الـ cache (profile, favorites, notifications...)
                          // حتى لا يظهر بيانات المستخدم القديم لمستخدم جديد يسجل دخول بعده
    router.push("/login");
  }
};

  const alignmentClass = align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right";

  return (
    <div className="relative z-[200]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-primary-light border-2 border-primary/30 flex items-center justify-center text-primary cursor-pointer hover:shadow-md transition-all active:scale-90"
      >
        <span className="material-symbols-rounded text-xl">person</span>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)}></div>

          <div className={`absolute top-12 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-[200] animate-in fade-in zoom-in duration-200 text-right ${alignmentClass}`}>

            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              {profile ? (
                <>
                  <div className="text-sm font-bold text-gray-800">{profile.full_name}</div>
                  <div className="text-xs text-gray-400 font-medium">@{profile.username}</div>
                </>
              ) : (
                <div className="text-sm font-bold text-gray-800">ضيف</div>
              )}
            </div>

            <div className="p-1">
              {profile ? (
  <>
    {(isAdmin ? adminMenuItems : menuItems).map((item) => (
      <Link
        href={item.href}
        key={item.href}
        onClick={() => setIsOpen(false)}
        className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-600 cursor-pointer hover:bg-primary-light hover:text-primary transition-colors rounded-lg group"
      >
        <span className="material-symbols-rounded text-sm text-gray-400 group-hover:text-primary transition-colors">{item.icon}</span>
        <span className="font-medium">{item.label}</span>
      </Link>
    ))}

    <div className="h-px bg-gray-50 my-1 mx-2"></div>

    <button
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-500 cursor-pointer hover:bg-red-50 transition-colors rounded-lg group"
    >
      <span className="material-symbols-rounded text-sm">logout</span>
      <span className="font-medium">تسجيل خروج</span>
    </button>
  </>
) : (
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs text-primary cursor-pointer hover:bg-primary-light transition-colors rounded-lg group font-bold"
                >
                  <span className="material-symbols-rounded text-sm">person_add</span>
                  <span>إنشاء حساب</span>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}