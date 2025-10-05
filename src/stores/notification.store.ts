import notificationApi from "@/api/handler/notification";
import type { Notification } from "@/typings/notification.type";
import { create } from "zustand";

type NotificationState = {
  notifications: Notification[];
  setNotifications: (list: Notification[]) => void;
  addNotification: (n: Notification) => void;
  readNotifications: () => Promise<void>;
  readNotification: (id: number) => Promise<void>;
  deleteNotifications: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
};

const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  setNotifications: (list) => set({ notifications: list }),
  addNotification: (n) =>
    set((s) => ({ notifications: [n, ...s.notifications] })),
  readNotifications: async () => {
    const readNotification: number[] = [];

    set((s) => ({
      notifications: s.notifications.map((n) => {
        readNotification.push(n.id);
        return n.read === false ? { ...n, read: true } : n;
      }),
    }));

    try {
      await notificationApi.readNotifications();
    } catch {
      set((s) => ({
        notifications: s.notifications.map((n) =>
          readNotification.includes(n.id) ? { ...n, read: false } : n,
        ),
      }));
    }
  },
  readNotification: async (id) => {
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));

    try {
      await notificationApi.readNotification(id);
    } catch {
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, read: false } : n,
        ),
      }));
    }
  },
  deleteNotifications: async () => {
    const toDelete = get().notifications;

    set(() => ({
      notifications: [],
    }));

    try {
      await notificationApi.deleteNotifications();
    } catch {
      set(() => ({
        notifications: toDelete,
      }));
    }
  },
  deleteNotification: async (id) => {
    const toDelete = get().notifications.find((n) => n.id === id);
    if (!toDelete) return;

    set((s) => ({
      notifications: s.notifications.filter((n) => n.id !== id),
    }));

    try {
      await notificationApi.deleteNotification(id);
    } catch {
      set((s) => ({
        notifications: [...s.notifications, toDelete].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      }));
    }
  },
}));

export default useNotificationStore;
