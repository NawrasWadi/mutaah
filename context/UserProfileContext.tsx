"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfile } from "@/types/auth";
import { authService } from "@/services/auth.service";
import { useHasToken } from "@/hooks/useHasToken";
import { queryKeys } from "@/api/queryKeys";

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const hasToken = useHasToken();

  // ✅ مصححة: getMe() ترجع UserProfile جاهزة مباشرة (بدون .user إضافية)
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => authService.getMe(),
    enabled: hasToken,
    retry: false,
  });

  const profile = data ?? null;

  const updateProfile = (updates: Partial<UserProfile>) => {
    queryClient.setQueryData<UserProfile>(queryKeys.profile, (prev) =>
      prev ? { ...prev, ...updates } : prev
    );
  };

  // ⚠️ حُذفت updateIdentityStatus بالكامل: كانت تعتمد على حقل
  // identity_status غير الموجود إطلاقاً بـ /profile الحقيقي (هذا الحقل
  // كان بقايا من نظام mock قديم). حالة التوثيق الحقيقية هي is_verified
  // (boolean بسيط)، وصفحة verify-identity الحالية تدير حالتها بنفسها
  // عبر React Query الخاص بموديول identity-verifications المنفصل،
  // فلا حاجة فعلية لهذه الدالة حالياً.

  return (
    <UserProfileContext.Provider value={{ profile, isLoading, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
}