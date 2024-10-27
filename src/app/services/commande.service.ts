import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8000/api/auth'; // Remplacez par votre URL backend

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir les en-têtes avec le token d'authentification
  
  private getHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') { // Check if window is defined
      token = localStorage.getItem('token') || '';
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getUsers(): Observable<any> {
    const headers = this.getHeaders();  // Obtenez les en-têtes correctement
    return this.http.get<any>(`${this.apiUrl}/users`, { headers });
  }
  
  getProduits(): Observable<any> {
    const headers = this.getHeaders();  // Obtenez les en-têtes correctement
    return this.http.get<any>(`${this.apiUrl}/produits`, { headers });
  }
  

  

  // Ajouter commande pour un client
  commanderPourClient(commandeData: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/commander-pour-client`, commandeData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error adding order for client:', error);
          return throwError(error);
        })
      );
  }

  // Recherche de commandes
  rechercherCommande(query: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/commandes/recherche`, {
      params: { query },
      headers
    }).pipe(
      catchError((error) => {
        console.error('Error searching orders:', error);
        return throwError(error);
      })
    );
  }

  // Suppression d'une commande
  deleteCommande(commandeId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/commandes/supprimer/${commandeId}`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error deleting order:', error);
          return throwError(error);
        })
      );
  }

  // Pagination des commandes
  getCommandesPaginated(page: number, itemsPerPage: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/commandes/details`, {
      headers,
      params: { page: page.toString(), itemsPerPage: itemsPerPage.toString() }
    }).pipe(
      catchError((error) => {
        console.error('Error fetching paginated orders:', error);
        return throwError(error);
      })
    );
  }

  // Détails d'une commande spécifique
  getCommandeDetails(commandeId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/commandes/${commandeId}/details`, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error fetching order details:', error);
          if (error.status === 401) {
            // Traitez ici le cas d'erreur 401 (non autorisé)
            console.warn('Authentication error. Please check your token.');
          }
          return throwError(error);
        })
      );
  }
  

  // Changement de statut d'une commande
  changerStatutCommande(commandeId: number, statut: string): Observable<any> {
    const headers = this.getHeaders();
    const body = { statut };
    return this.http.post(`${this.apiUrl}/admin/commandes/${commandeId}/statut`, body, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error changing order status:', error);
          return throwError(error);
        })
      );
  }

  // Exportation d'une commande en PDF
  exporterCommandePDF(commandeId: number): Observable<Blob> {
    const headers = this.getHeaders().append('Accept', 'application/pdf');
    return this.http.get(`${this.apiUrl}/exportcommandespdf/${commandeId}`, {
      headers,
      responseType: 'blob'
    }).pipe(
      catchError((error) => {
        console.error('Error exporting order as PDF:', error);
        return throwError(error);
      })
    );
  }

  // Exportation de toutes les commandes
  exporterToutesCommandes(): Observable<Blob> {
    const headers = this.getHeaders().append('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.get(`${this.apiUrl}/export-commandes`, {
      headers,
      responseType: 'blob'
    }).pipe(
      catchError((error) => {
        console.error('Error exporting all orders:', error);
        return throwError(error);
      })
    );
  }

  // Gérer les erreurs
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}



