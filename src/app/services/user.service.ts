// src/app/core/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiUrl = 'http://localhost:8000/api/user';

  constructor(private http: HttpClient) {}

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchByUsername(userName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search/${userName}`);
  }
}
