import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8000/api/auth'; // Remplacer par l'URL de votre API

    constructor(private http: HttpClient) {}

    // Helper method to get headers with authorization token
    private getHeaders(): HttpHeaders {
      let token = '';
      if (typeof window !== 'undefined') { // Vérifie si la fenêtre est définie
        token = localStorage.getItem('token') || '';
      }
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
    }

    // Méthode pour récupérer les notifications de l'utilisateur connecté
    getNotifications(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/notifications`, { headers: this.getHeaders() });
    }

    // Méthode pour marquer une notification spécifique comme lue
    markAsRead(notificationId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/notifications/${notificationId}/mark-as-read`, {}, { headers: this.getHeaders() });
    }

    // Méthode pour marquer toutes les notifications comme lues
    markAllAsRead(): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/notifications/read-all`, {}, { headers: this.getHeaders() });
    }

    // Méthode pour supprimer une notification spécifique
    deleteNotification(notificationId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/notifications/supprimer/${notificationId}`, { headers: this.getHeaders() });
    }

    // Méthode pour récupérer une notification par ID
    showNotification(notificationId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/notifications/${notificationId}`, { headers: this.getHeaders() });
    }

    // Méthode pour rechercher des notifications en fonction de filtres
    searchNotifications(filters: { type?: string; read_at?: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/notifications/search`, filters, { headers: this.getHeaders() });
    }
}
