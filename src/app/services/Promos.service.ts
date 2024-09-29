// src/app/services/promos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromosService {
  private apiUrl = 'http://localhost:8000/api/auth/promos'; // Replace with your Laravel API URL

  constructor(private http: HttpClient) {}

  // Method to get HTTP headers with the authorization token
  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all promotions with pagination
 // In PromosService
getPromos(page: number = 1): Observable<any> {
  const headers = this.getHeaders();
  return this.http.get(`${this.apiUrl}?page=${page}`, { headers })
    .pipe(
      catchError((error) => {
        console.error('Error fetching promotions:', error);
        return throwError(error);
      })
    );
}

getProduits(): Observable<any> {
  const headers = this.getHeaders();  // Obtenez les en-têtes correctement
  return this.http.get<any>(`${this.apiUrl}/produits`, { headers });
}
  // Get a single promotion
  getPromo(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/afficher/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching promotion by ID:', error);
          return throwError(error);
        })
      );
  }

  // Create a new promotion
  createPromo(promoData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/creerunepromotion`, promoData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error creating promotion:', error);
          return throwError(error);
        })
      );
  }

  // Update an existing promotion
  updatePromo(id: number, promoData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/modifier/${id}`, promoData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating promotion:', error);
          return throwError(error);
        })
      );
  }

  // Delete a promotion
  deletePromo(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/supprimer/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error deleting promotion:', error);
          return throwError(error);
        })
      );
  }

  // Apply promotion to multiple products
  applyPromoToProducts(promoData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/appliquerunepromotion`, promoData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error applying promotion to products:', error);
          return throwError(error);
        })
      );
  }

  // Apply existing promotion to multiple products
  applyExistingPromoToProducts(promoId: number, promoData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/apply-existing-promo/${promoId}`, promoData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error applying existing promotion to products:', error);
          return throwError(error);
        })
      );
}
}
