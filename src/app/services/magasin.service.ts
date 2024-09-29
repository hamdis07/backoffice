import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MagasinService {
  private apiUrl = 'http://localhost:8000/api/auth/magasins'; // URL mise à jour

  constructor(private http: HttpClient) {}

  // Obtenir un en-tête avec le token
  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Ajouter un magasin
  addMagasin(magasin: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, magasin, { headers: this.getHeaders() });
  }

  // Mettre à jour un magasin
  updateMagasin(id: number, magasin: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/modifier/${id}`, magasin, { headers: this.getHeaders() });
  }

  // Supprimer un magasin
  deleteMagasin(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }

 // In magasin.service.ts
 getMagasins(page: number = 1, perPage: number = 10): Observable<any> {
  const headers = this.getHeaders();

  return this.http.get<any>(`${this.apiUrl}/afficher?page=${page}&perPage=${perPage}`,{headers});
}


  // Obtenir un magasin par ID
  getMagasinById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/afficher/${id}`, { headers: this.getHeaders() });
  }

  // Obtenir le stock par magasin
  getStockByMagasin(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stock/${id}`, { headers: this.getHeaders() });
  }
}
