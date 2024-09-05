import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: { token: string }) => {
        if (typeof window !== 'undefined') {
          // Store the token in local storage
          localStorage.setItem('token', response.token);
        }
      })
    );
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
