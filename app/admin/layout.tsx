"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/context/UserProfileContext";
import { useUserRole } from "@/hooks/useUserRole";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, isLoading } = useUserProfile();
  const role = useUserRole(); // ✅ من tokenStorage (له من /login)، وليس من /profile
                                 // لأن GET /profile لا يرجع role إطلاقاً (مؤكد من Postman)

  useEffect(() => {
    if (!isLoading && profile && role !== "admin") {
      router.push("/dashboard");
    }
    if (!isLoading && !profile) {
      router.push("/login");
    }
  }, [isLoading, profile, role, router]);

  if (isLoading || !profile || role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <div className="min-h-screen bg-bg-page">{children}</div>;
}