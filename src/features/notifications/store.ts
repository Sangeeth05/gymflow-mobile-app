import { create } from 'zustand';
import { notifications as mockNotifications, type AppNotification } from '../../mocks/data';

type NotificationState = {
  items: AppNotification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  reset: () => void;
};

export const useNotifications = create<NotificationState>()((set) => ({
  items: mockNotifications,
  markRead: (id) => set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
  reset: () => set({ items: mockNotifications }),
}));

export function useUnreadCount(): number {
  return useNotifications((s) => s.items.filter((n) => !n.read).length);
}
