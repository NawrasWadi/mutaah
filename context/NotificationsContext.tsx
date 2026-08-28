"use client";
import { createContext, useContext, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/types/notifications";
import { notificationsService } from "@/services/notifications.service";
import { tokenStorage } from "@/utils/tokenStorage";
import { queryKeys } from "@/api/queryKeys";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const hasToken = !!tokenStorage.getAccessToken();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => notificationsService.getNotifications(),
    enabled: hasToken,
    retry: false,
  });

  const { data: unreadData } = useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: notificationsService.getUnreadCount,
    enabled: hasToken,
    retry: false,
  });

  const notifications = data?.data.data ?? [];
  const unreadCount = unreadData?.unread_count ?? 0;

  const markAsRead = async (id: string) => {
    // تحديث تفاؤلي فوري بالواجهة، قبل رد الباك — لتجربة استخدام أسرع
    queryClient.setQueryData<typeof data>(queryKeys.notifications, (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          data: prev.data.data.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        },
      };
    });
    try {
      await notificationsService.markAsRead(id);
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    } catch {
      // لو فشل الطلب، نرجع نجيب الحالة الحقيقية من الباك بدل ما نبقي حالة خاطئة بالواجهة
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    }
  };

  const markAllRead = async () => {
    queryClient.setQueryData<typeof data>(queryKeys.notifications, (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        data: { ...prev.data, data: prev.data.data.map((n) => ({ ...n, is_read: true })) },
      };
    });
    try {
      await notificationsService.markAllAsRead();
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    } catch {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, isLoading, markAsRead, markAllRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}