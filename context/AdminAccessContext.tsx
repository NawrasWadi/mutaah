// context/AdminAccessContext.tsx
"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "@/context/UserProfileContext";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/api/queryKeys";

const AdminAccessContext = createContext<{ isAdmin: boolean; isChecking: boolean }>({
  isAdmin: false,
  isChecking: true,
});

export function AdminAccessProvider({ children }: { children: ReactNode }) {
  const { profile, isLoading: isProfileLoading } = useUserProfile();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: adminService.getDashboard,
    enabled: !isProfileLoading && !!profile,
    retry: false,
  });

  const isChecking = isProfileLoading || isLoading;
  const isAdmin = !isChecking && !isError && !!data;

  return (
    <AdminAccessContext.Provider value={{ isAdmin, isChecking }}>
      {children}
    </AdminAccessContext.Provider>
  );
}

export const useAdminAccess = () => useContext(AdminAccessContext);