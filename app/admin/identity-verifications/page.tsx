"use client";
import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/api/queryKeys";
import UserDropdown from "@/components/UserDropdown";

export default function AdminVerificationsPage() {
  const queryClient = useQueryClient();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const { data: verifications, isLoading } = useQuery({
    queryKey: queryKeys.adminVerifications("manual_review"),
    queryFn: () => adminService.getVerifications("manual_review"),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approveVerification(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.adminVerifications("manual_review") }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => adminService.rejectVerification(id, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminVerifications("manual_review") });
      setRejectingId(null);
      setAdminNote("");
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 flex items-center justify-between px-6 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-all">
            <span className="material-symbols-rounded text-lg">arrow_forward</span>
          </Link>
          <div className="text-lg font-black text-gray-800">مراجعة توثيق الهوية</div>
        </div>
        <UserDropdown align="left" />
      </header>

      <main className="grow max-w-4xl mx-auto w-full p-4 md:p-8">
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : !verifications || verifications.length === 0 ? (
          <div className="py-20 text-center text-gray-300 font-bold">لا توجد طلبات توثيق بانتظار المراجعة</div>
        ) : (
          <div className="flex flex-col gap-3">
            {verifications.map((v) => (
              <div key={v.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2 shrink-0">
                    <img src={`https://mutaah-api.apps.taqat.academy/storage/${v.id_image_url}`} alt="صورة الهوية" className="w-16 h-16 rounded-lg object-cover border border-gray-100" />
<img src={`https://mutaah-api.apps.taqat.academy/storage/${v.selfie_image_url}`} alt="صورة شخصية" className="w-16 h-16 rounded-lg object-cover border border-gray-100" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs text-gray-500">مستخدم: <span className="font-bold text-gray-800">{v.user_id}</span></p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => approveMutation.mutate(v.id)}
                      disabled={approveMutation.isPending}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-black hover:brightness-105 transition-all disabled:opacity-50"
                    >
                      قبول
                    </button>
                    <button
                      onClick={() => setRejectingId(rejectingId === v.id ? null : v.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-100 text-red-500 text-xs font-black hover:bg-red-50 transition-all"
                    >
                      رفض
                    </button>
                  </div>
                </div>

                {rejectingId === v.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                    <input
                      type="text"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="سبب الرفض..."
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => rejectMutation.mutate({ id: v.id, note: adminNote })}
                      disabled={!adminNote.trim() || rejectMutation.isPending}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-black disabled:opacity-40"
                    >
                      تأكيد الرفض
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}