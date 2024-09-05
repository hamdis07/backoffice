import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MagasinService {
  private apiUrl = 'http://localhost:8000/api/Admin'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  addMagasin(magasin: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addMagasin`, magasin);
  }

  updateMagasin(id: number, magasin: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateMagasin/${id}`, magasin);
  }

  deleteMagasin(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteMagasin/${id}`);
  }

  getAllMagasins(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllMagasins`);
  }

  getStockByMagasin(magasinId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getStockByMagasin/${magasinId}`);
  }
}
