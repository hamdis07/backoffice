import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://localhost:8000/api';  // Remplacez par votre URL d'API

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir les headers d'autorisation
  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') { // Check if window is defined
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Récupérer toutes les catégories
  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`, { headers: this.getHeaders() });
  }

  // Récupérer une catégorie par ID
  getCategorie(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/${id}`, { headers: this.getHeaders() });
  }

  // Créer une nouvelle catégorie
  createCategorie(categorie: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/categories/create`, categorie, { headers: this.getHeaders() });
  }

  // Mettre à jour une catégorie
  updateCategorie(id: number, categorie: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/categories/update/${id}`, categorie, { headers: this.getHeaders() });
  }

  // Supprimer une catégorie
  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/categories/delete/${id}`, { headers: this.getHeaders() });
  }
}
