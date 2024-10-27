import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
    private apiUrl = 'http://localhost:8000/api/auth';

    constructor(private http: HttpClient) {}
  
    private getHeaders(): HttpHeaders {
      let token = '';
      if (typeof window !== 'undefined') { // Check if window is defined
        token = localStorage.getItem('token') || '';
      }
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
  // Method to get clients with pagination
  //getClients(perPage: number = 10,page:number): Observable<any> {
   // return this.http.get<any>(`${this.apiUrl}/client/get-clients?per_page=${perPage}`, { headers: this.getHeaders() });
  //}
  getClients(perPage: number = 10, page: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/client/get-clients??page=${page}&perPage=${perPage}`, { headers: this.getHeaders() });
  }
  
  
  // Method to create a new client
  createClient(client: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/client/create`, client, { headers: this.getHeaders() });
  }

  // Method to update an existing client
  updateClient(id: number, clientData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/client/update/${id}`, clientData, { headers: this.getHeaders() });
  }

  // Method to delete a client
  deleteClient(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/client/delete/${id}`, { headers: this.getHeaders() });
  }

  // Method to show a specific client by ID
  showClient(id: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/client/show/${id}`, { headers: this.getHeaders() });
  }

  // Method to search for a client by username
  searchByUsername(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/client/search/username`, { user_name: username }, { headers: this.getHeaders() });
  }

  // Method to search clients with additional criteria
  searchClients(filters: { nom?: string; user_name?: string; prenom?: string; numero_telephone?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/client/research`, filters, { headers: this.getHeaders() });
  }
  

  // Method to update a client's status
  updateClientStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/client/update-status/${id}`, { status }, { headers: this.getHeaders() });
  }

  // Helper method to get headers with authorization token
 
}