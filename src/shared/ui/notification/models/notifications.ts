import { action, atom } from '@reatom/core';

import type { NotificationItem, NotificationSeverity } from '../types';

export const notificationsAtom = atom<NotificationItem[]>([]);

export const addNotification = action(
  (message: string, severity: NotificationSeverity = 'info', duration?: number) => {
    const id = Date.now();
    notificationsAtom.set((prev) => [...prev, { id, message, severity, duration }]);
  }
);

export const removeNotification = action((id: number) => {
  notificationsAtom.set((prev) => prev.filter((item) => item.id !== id));
});

export const clearNotifications = action(() => {
  notificationsAtom.set([]);
});
