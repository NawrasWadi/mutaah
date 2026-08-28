"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/api/queryKeys";
import UserDropdown from "@/components/UserDropdown";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: adminService.getDashboard,
  });

  const cards = [
    { label: "إجمالي المستخدمين", value: data?.total_users, icon: "group", color: "text-primary" },
    { label: "منتجات نشطة", value: data?.active_products, icon: "inventory_2", color: "text-primary" },
    { label: "طلبات استئجار معلّقة", value: data?.pending_rental_requests, icon: "pending_actions", color: "text-orange-500" },
    { label: "دفعات بانتظار المراجعة", value: data?.pending_payments, icon: "payments", color: "text-orange-500" },
    { label: "اشتراكات بانتظار المراجعة", value: data?.pending_subscriptions, icon: "workspace_premium", color: "text-orange-500" },
    { label: "اشتراكات نشطة", value: data?.active_subscriptions, icon: "verified", color: "text-primary" },
    { label: "طلبات توثيق يدوية", value: data?.manual_identity_reviews, icon: "shield_person", color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="text-lg font-black text-gray-800">لوحة تحكم الأدمن</div>
        <div className="text-xl font-black text-primary italic select-none">مُتاح</div>
        <UserDropdown align="left" />
      </header>

      <main className="grow max-w-6xl mx-auto w-full p-4 md:p-8">

        <div className="flex gap-3 mb-6 flex-wrap">
          <Link href="/admin/payments" className="px-4 py-2 rounded-lg bg-white border border-gray-100 text-sm font-bold text-gray-700 hover:border-primary hover:text-primary transition-all">
            مراجعة الدفعات
          </Link>
          <Link href="/admin/subscriptions" className="px-4 py-2 rounded-lg bg-white border border-gray-100 text-sm font-bold text-gray-700 hover:border-primary hover:text-primary transition-all">
            مراجعة الاشتراكات
          </Link>
          <Link href="/admin/identity-verifications" className="px-4 py-2 rounded-lg bg-white border border-gray-100 text-sm font-bold text-gray-700 hover:border-primary hover:text-primary transition-all">
            مراجعة توثيق الهوية
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 text-right shadow-sm">
                <span className={`material-symbols-rounded text-2xl ${c.color}`}>{c.icon}</span>
                <div className="text-2xl font-black text-gray-800 mt-2">{c.value ?? 0}</div>
                <div className="text-xs text-gray-400 font-bold mt-1">{c.label}</div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}