// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ClientsService {
//   private apiUrl = 'http://localhost:8000/api/auth/superadmin'; // Change this URL if needed

//   constructor(private http: HttpClient) {}

//   private getHeaders(): HttpHeaders {
//     let token = '';
//     if (typeof window !== 'undefined') { // Check if window is defined
//       token = localStorage.getItem('token') || '';
//     }
//     return new HttpHeaders({
//       'Authorization': `Bearer ${token}`
//     });
//   }

//   getClients(page: number = 1, perPage: number = 10): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/get-clients?page=${page}&per_page=${perPage}`, { headers: this.getHeaders() });
//   }

//   getClientById(id: string | null): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/show-client/${id}`, { headers: this.getHeaders() });
//   }

//   createClient(client: FormData): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/createclient`, client, { headers: this.getHeaders() });
//   }

//   updateClient(id: string, clientData: FormData): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/updateclient/${id}`, clientData, { headers: this.getHeaders() });
//   }

//   deleteClient(id: number): Observable<any> {
//     return this.http.delete<any>(`${this.apiUrl}/deleteclient/${id}`, { headers: this.getHeaders() });
//   }

//   searchByUsername(username: string): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/search-by-username`, { user_name: username }, { headers: this.getHeaders() });
//   }

//   searchClients(filters: { nom?: string; prenom?: string; numero_telephone?: string }): Observable<any> {
//     return this.http.post<any>(`${this.apiUrl}/rechercher-client`, filters, { headers: this.getHeaders() });
//   }
// }
