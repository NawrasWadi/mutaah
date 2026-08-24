"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Notification } from "@/types/notifications";
import { mockNotifications } from "@/mock/notifications.mock";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notif: Omit<Notification, "id">) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const addNotification = (notif: Omit<Notification, "id">) => {
    const newId = notifications.reduce((max, n) => (n.id > max ? n.id : max), 0) + 1;
    setNotifications((prev) => [{ ...notif, id: newId }, ...prev]);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead }}>
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