import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SousCategorieService {
  private apiUrl = 'http://localhost:8000/api';  // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  // Method to get authorization headers
  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') { // Check if window is defined
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' // Add content type if necessary
    });
  }

  // Fetch all sous-catégories with pagination
  getSousCategories(perPage: number, page: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/souscategories`, {
      headers: this.getHeaders(),
      params: { per_page: perPage.toString(), page: page.toString() }
    }).pipe(
      catchError(this.handleError) // Handle errors
    );
  }

  // Fetch a single sous-catégorie by ID
  getSousCategorie(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/souscategories/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Create a new sous-catégorie
  createSousCategorie(sousCategorie: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/souscategories/create`, sousCategorie, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Update an existing sous-catégorie
  updateSousCategorie(id: number, sousCategorie: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/souscategories/update/${id}`, sousCategorie, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Delete a sous-catégorie
  deleteSousCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/souscategories/supprimer/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Handle errors from the HTTP requests
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
