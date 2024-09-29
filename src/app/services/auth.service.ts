import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

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

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: { token: string }) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  getLoggedInUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`, { headers: this.getHeaders() });
  }

  registre(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registre`, data);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}
