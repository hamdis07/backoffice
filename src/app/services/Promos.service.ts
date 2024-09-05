import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromosService {
  private baseUrl = 'http://localhost:8000/api/promos';

  constructor(private http: HttpClient) {}

  getPromos(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  addPromo(idProduit: number, promo: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${idProduit}`, promo);
  }

  updatePromo(idProduit: number, promo: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${idProduit}`, promo);
  }

  updateOrCreatePromo(idProduit: number, promo: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${idProduit}`, promo);
  }

  removePromo(idProduit: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idProduit}`);
  }
}
