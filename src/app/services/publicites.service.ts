import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PubliciteService {
  private apiUrl = 'http://localhost:8000/api'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  // Méthode pour créer une nouvelle publicité
  createPublicite(publiciteData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/publicites/create`, publiciteData, {
      headers: this.getHeaders()
    });
  }

  // Méthode pour lister toutes les publicités avec pagination
  getPublicites(page: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/publicites?page=${page}`, {
      headers: this.getHeaders()
    });
  }
  // Méthode pour afficher une publicité par ID
  getPubliciteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/publicites/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Méthode pour mettre à jour une publicité
  updatePublicite(id: number, publiciteData: FormData): Observable<any> {
    console.log('Mise à jour de la publicité avec ID:', id); // Vérifiez l'ID ici
    return this.http.post(`${this.apiUrl}/auth/publicites/update/${id}`, publiciteData, {
        headers: this.getHeaders()
    });
}

  // Méthode pour supprimer une publicité
  deletePublicite(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/auth/publicites/delete/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Méthode pour obtenir les en-têtes d'authentification
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json' // Adaptez si nécessaire
    });

    // Vérifiez si vous êtes dans un environnement navigateur avant d'accéder à localStorage
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké dans le localStorage
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
