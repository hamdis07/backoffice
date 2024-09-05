import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenreService {
  private baseUrl = 'http://localhost:8000/api/auth/genres';

  constructor(private http: HttpClient) {}

  getGenres(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getGenre(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addGenre(genre: any): Observable<any> {
    return this.http.post(this.baseUrl, genre);
  }

  updateGenre(id: number, genre: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, genre);
  }

  deleteGenre(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
