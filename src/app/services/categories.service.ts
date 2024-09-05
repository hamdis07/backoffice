import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private baseUrl = 'http://localhost:8000/api/auth/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getCategory(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post(this.baseUrl, category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
