"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAccess } from "@/context/AdminAccessContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAdmin, isChecking } = useAdminAccess();

  useEffect(() => {
    if (!isChecking && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isChecking, isAdmin, router]);

  if (isChecking || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <div className="min-h-screen bg-bg-page">{children}</div>;
}