"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/api/queryKeys";
import UserDropdown from "@/components/UserDropdown";

export default function AdminPaymentsPage() {
  const queryClient = useQueryClient();

  const { data: payments, isLoading } = useQuery({
    queryKey: queryKeys.adminPayments,
    queryFn: adminService.getPayments,
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => adminService.verifyPayment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminPayments }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => adminService.rejectPayment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminPayments }),
  });

  const pending = (payments ?? []).filter((p) => p.payment_status === "pending");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800">مراجعة الدفعات</div>
        </div>
        <UserDropdown align="left" />
      </header>

      <main className="grow max-w-4xl mx-auto w-full p-4 md:p-8">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : pending.length === 0 ? (
          <div className="py-20 text-center text-gray-300 font-bold">لا توجد دفعات بانتظار المراجعة</div>
        ) : (
          <div className="flex flex-col gap-3">
            {pending.map((payment) => (
              <div key={payment.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                <Image
                  src={payment.receipt_image}
                  alt="إيصال الدفع"
                  width={80}
                  height={80}
                  unoptimized
                  className="w-20 h-20 rounded-lg object-cover border border-gray-100 shrink-0"
                />
                <div className="flex-1 text-right">
                  <p className="text-xs text-gray-500">طلب استئجار: <span className="font-bold text-gray-800">{payment.rental_id}</span></p>
                  <p className="text-sm font-black text-primary mt-1">₪{payment.grand_total}</p>
                  <p className="text-xs text-gray-400">إيجار: ₪{payment.rental_price_total} + رهن: ₪{payment.deposit_amount}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => verifyMutation.mutate(payment.id)}
                    disabled={verifyMutation.isPending}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-black hover:brightness-105 transition-all disabled:opacity-50"
                  >
                    توثيق
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(payment.id)}
                    disabled={rejectMutation.isPending}
                    className="px-3 py-1.5 rounded-lg border border-red-100 text-red-500 text-xs font-black hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    رفض
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}