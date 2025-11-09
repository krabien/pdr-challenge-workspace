import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@pdr-challenge-workspace/shared';

// The base URL for the NestJS backend. hardcoded here for ease of use,
// this would typically be fetched from a compile-time configuration.
const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})

// This service is responsible for making HTTP requests to the NestJS backend.
// It abstracts away the details of making requests so we can easily mock
// the backend in tests.
export class ApiService {
  private http = inject(HttpClient);

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${API_URL}/${path}`);
  }

  post<T>(path: string, body: User): Observable<T> {
    return this.http.post<T>(`${API_URL}/${path}`, body);
  }
}
