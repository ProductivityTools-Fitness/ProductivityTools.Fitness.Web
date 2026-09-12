import { inject, Injectable, NgZone, signal } from '@angular/core';

export type NotificationType = 'error' | 'warning' | 'info' | 'success';

export interface NotificationAction {
  label: string;
  callback: () => void;
}

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
  action?: NotificationAction;
  durationMs?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly ngZone = inject(NgZone);
  readonly notifications = signal<AppNotification[]>([]);
  private readonly timerMap = new Map<string, ReturnType<typeof setTimeout>>();

  show(options: {
    message: string;
    type?: NotificationType;
    action?: NotificationAction;
    durationMs?: number;
  }): string {
    const type = options.type || 'info';
    const durationMs = options.durationMs !== undefined ? options.durationMs : 6000;

    // Check if an identical notification is already shown to avoid duplication
    const current = this.notifications();
    const existing = current.find((n) => n.message === options.message && n.type === type);
    if (existing) {
      this.resetTimer(existing.id, durationMs);
      return existing.id;
    }

    const id = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newNotification: AppNotification = {
      id,
      message: options.message,
      type,
      action: options.action,
      durationMs,
    };

    this.ngZone.run(() => {
      this.notifications.update((list) => [...list, newNotification]);
    });

    if (durationMs > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
      this.timerMap.set(id, timer);
    }

    return id;
  }

  showError(message: string, action?: NotificationAction, durationMs = 7000): string {
    return this.show({ message, type: 'error', action, durationMs });
  }

  showWarning(message: string, action?: NotificationAction, durationMs = 6000): string {
    return this.show({ message, type: 'warning', action, durationMs });
  }

  showInfo(message: string, action?: NotificationAction, durationMs = 5000): string {
    return this.show({ message, type: 'info', action, durationMs });
  }

  showSuccess(message: string, action?: NotificationAction, durationMs = 4000): string {
    return this.show({ message, type: 'success', action, durationMs });
  }

  dismiss(id: string): void {
    const timer = this.timerMap.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timerMap.delete(id);
    }
    this.ngZone.run(() => {
      this.notifications.update((list) => list.filter((n) => n.id !== id));
    });
  }

  clearAll(): void {
    for (const timer of this.timerMap.values()) {
      clearTimeout(timer);
    }
    this.timerMap.clear();
    this.ngZone.run(() => {
      this.notifications.set([]);
    });
  }

  private resetTimer(id: string, durationMs: number): void {
    const existingTimer = this.timerMap.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      this.timerMap.delete(id);
    }
    if (durationMs > 0) {
      const timer = setTimeout(() => {
        this.dismiss(id);
      }, durationMs);
      this.timerMap.set(id, timer);
    }
  }
}
