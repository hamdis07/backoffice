import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true, // Standalone enabled
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  // Charger toutes les notifications
  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(
      (data: any[]) => {
        // Désérialisation des données si nécessaire
        this.notifications = data.map(notification => {
          return {
            ...notification,
            data: typeof notification.data === 'string' ? JSON.parse(notification.data) : notification.data
          };
        });
        this.loading = false;
      },
      (err) => {
        this.error = 'Erreur lors du chargement des notifications';
        this.loading = false;
      }
    );
  }
  

  // Marquer une notification comme lue
  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId).subscribe(() => {
      this.loadNotifications(); // Recharger les notifications après la mise à jour
    });
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe(() => {
      this.loadNotifications();
    });
  }

  // Supprimer une notification
  deleteNotification(notificationId: string): void {
    this.notificationService.deleteNotification(notificationId).subscribe(() => {
      this.loadNotifications(); // Recharger les notifications après la suppression
    });
  }
}
