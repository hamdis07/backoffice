import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SousCategorieService {
  private baseUrl = 'http://localhost:8000/api/auth/sous_categories';

  constructor(private http: HttpClient) {}

  getSousCategories(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getSousCategorie(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addSousCategorie(sousCategorie: any): Observable<any> {
    return this.http.post(this.baseUrl, sousCategorie);
  }

  updateSousCategorie(id: number, sousCategorie: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, sousCategorie);
  }

  deleteSousCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
