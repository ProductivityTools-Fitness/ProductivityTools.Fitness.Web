import { Component, inject } from '@angular/core';
import { AppNotification, NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
})
export class NotificationComponent {
  readonly notificationService = inject(NotificationService);

  handleAction(notification: AppNotification): void {
    if (notification.action?.callback) {
      notification.action.callback();
    }
    this.notificationService.dismiss(notification.id);
  }

  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
