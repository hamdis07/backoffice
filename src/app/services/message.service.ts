import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8000/api/Adminmessage'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  listMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/messages`);
  }

  showMessage(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/messages/${id}`);
  }

  replyToMessage(id: number, reply: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/messages/${id}/reply`, reply);
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/messages/${id}`);
  }

  blockUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}/block`);
  }
}
