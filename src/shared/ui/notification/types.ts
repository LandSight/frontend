export const notificationSeverity = ['success', 'error', 'info', 'warning'] as const;
export type NotificationSeverity = (typeof notificationSeverity)[number];

export type NotificationItem = {
  id: number;
  message: string;
  severity: NotificationSeverity;
  duration?: number;
};
