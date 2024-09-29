import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api/auth/admin';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') { // Check if window is defined
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAdmins(page: number = 1, perPage: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-admins?page=${page}&per_page=${perPage}`, { headers: this.getHeaders() });
  }

  getAdminById(id: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/show/${id}`, { headers: this.getHeaders() });
  }

  createAdministrateur(admin: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, admin, { headers: this.getHeaders() });
  }

  updateAdmin(id: string, adminData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/update/${id}`, adminData, { headers: this.getHeaders() });
  }

  deleteAdmin(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }
  searchByUsernameadmin(userName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/search-by-username`, { user_name: userName }, { headers: this.getHeaders() });
  }

  // admin.service.ts
searchAdmins(filters: { user_name?: string; email?: string; nom?: string; prenom?: string; numero_telephone?: string }): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/research`, filters, { headers: this.getHeaders() });
}

  updateAdminStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update-status/${id}`, { status }, { headers: this.getHeaders() });
  }
  getUsersByRole(role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/get-users-by-role`, { role }, { headers: this.getHeaders() });
  }
}

