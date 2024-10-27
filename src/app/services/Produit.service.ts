import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private baseUrl = 'http://localhost:8000/api/auth/produits';

  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  constructor(private http: HttpClient) {}

  getProduits(page: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/afficherTousLesProduits?page=${page}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching produits:', error);
          return throwError(error);
        })
      );
  }
  
  ajouterProduit(formData: FormData): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/nouveauproduit`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding produit:', error);
          return throwError(error);
        })
      );
  }
  
  getProduitById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`http://localhost:8000/api/produits/produits/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching produit by ID:', error);
          return throwError(error);
        })
      );
  }

  modifierProduit(id: number, formData: FormData): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/modifierleproduit/${id}`, formData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating produit:', error);
          return throwError(error);
        })
      );
  }

  supprimerProduit(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}/supprimerProduit/${id}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error deleting produit:', error);
          return throwError(error);
        })
      );
}
  

  ajouterPromos(idProduit: number, promoData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/${idProduit}/promos`, promoData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding promo:', error);
          return throwError(error);
        })
      );
  }

  updatePromos(idProduit: number, idPromos: number, promoData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.baseUrl}/${idProduit}/promos/${idPromos}`, promoData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating promo:', error);
          return throwError(error);
        })
      );
  }

  updateOrCreatePromos(idProduit: number, promoData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}/${idProduit}/promos/updateOrCreate`, promoData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error updating or creating promo:', error);
          return throwError(error);
        })
      );
  }
  featureProduct(idProduit: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post(`${this.baseUrl}/${idProduit}/feature`,{}, { headers });
  }

  // Unfeature a product
  unfeatureProduct(idProduit: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post(`${this.baseUrl}/${idProduit}/unfeature`,{}, {headers});
  }

  // Hide a product
  hideProduct(idProduit: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post(`${this.baseUrl}/${idProduit}/hide`,{}, {headers});
  }

  // Unhide a product
  unhideProduct(idProduit: number): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post(`${this.baseUrl}/${idProduit}/unhide`,{}, {headers});
  }

  // Search products with filters
  searchProducts(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/recherche`, { params });
  }

  index(filters: any): Observable<any> {
    let params = new HttpParams();
    
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        params = params.append(key, filters[key]);
      }
    }
    const token = localStorage.getItem('authToken'); // Adjust the key as necessary

    // Set the authorization header
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`http://localhost:8000/api/produits/recherche`, { params });
  }
}
