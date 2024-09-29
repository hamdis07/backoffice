import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/auth'; // Adjust this to match your backend's base API URL

  constructor(private http: HttpClient) {}

  // Method to get headers with authorization token
  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetch all clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clients`, { headers: this.getHeaders() });
  }

  // Fetch users filtered by admin or client
  getUsers(filterPrestataire: boolean, filterClient: boolean): Observable<any[]> {
    let url = `${this.apiUrl}`;
    if (filterPrestataire) {
      url += '?type=prestataire';
    } else if (filterClient) {
      url += '?type=client';
    }
  
    return this.http.get<any>(`${this.apiUrl}/users`, { headers: this.getHeaders() })
    .pipe(
      tap((response) => console.log('Users fetched:', response)),
      catchError((error) => {
        console.error('Error fetching users:', error);
        return throwError(error);  // Vous pouvez afficher un message d'erreur dans l'UI
      })
    );
  }
  
  


  // Fetch a specific user by ID
  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  // Delete a user by ID
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }

  // Search for users by username
  searchByUsername(userName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/search/${userName}`, { headers: this.getHeaders() });
  }
}
