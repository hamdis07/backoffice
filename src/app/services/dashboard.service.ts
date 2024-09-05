import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = 'http://localhost:8000/api/auth/dashboard';

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

  getStats(): Observable<any> {
    return this.http.get<any>(this.baseUrl, { headers: this.getHeaders() });
  }
}
