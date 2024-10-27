import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:8000/api'; // Replace with your backend URL

  constructor(private http: HttpClient) {}
  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  // Fetch a specific message by ID
  getMessageById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/messages/${id}`, { headers: this.getHeaders() });
  }
  getConversationWithUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/messages/user/${userId}`,{ headers: this.getHeaders() });
  }
  getUsersWithLastMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/last-message`);
  }

  // Reply to a specific message
  replyToMessage(idMessage: number, replyData: { reply: string }, files?: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('reply', replyData.reply);
    if (files && files.length) {
      files.forEach((file) => {
        formData.append('files[]', file, file.name);
      });
    }
    return this.http.post(`${this.apiUrl}/auth/messages/${idMessage}/reply`, formData, { headers: this.getHeaders() });
}

  

  // Delete a specific message
  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/messages/${id}`, { headers: this.getHeaders() });
  }

  // List all admins
  listAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/admins`, { headers: this.getHeaders() });
  }

  // List all clients with pagination
  listClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/clients`, { headers: this.getHeaders() });
  }
  listallusers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/allusers`, { headers: this.getHeaders() });
  }
  // Send a message to a specific client
  sendMessageToClients(userIds: number[], content: string, files: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('content', content);
    formData.append('user_ids', userIds.join(',')); // Join user IDs with commas
    if (files && files.length) {
      files.forEach((file) => {
        formData.append('files[]', file, file.name);
      });
    }
    return this.http.post(`${this.apiUrl}/auth/messages/send-to-client`, formData, { headers: this.getHeaders() });
  }


  // List all messages
  listMessages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/messages`, { headers: this.getHeaders() });
  }

  // List unread messages
  listUnreadMessages(): Observable<any> {
    return this.http.get(`http://localhost:8000/api/messages/unread` ,{ headers: this.getHeaders() });
  }

  // List read messages
  listReadMessages(): Observable<any> {
    return this.http.get(`http://localhost:8000/api/messages/read`, { headers: this.getHeaders() });
  }

  // Search messages by username
  searchMessages(username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/messages/recherche/search`, { username }, { headers: this.getHeaders() });
  }
  getMessagesByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/messages/user/${userId}`, { headers: this.getHeaders() });
  }

}
