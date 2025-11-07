import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// The base URL for the NestJS backend. hardcoded here for ease of use,
// this would typically be fetched from an environment variable.
const API_URL = 'http://localhost:3000/api';

@Injectable({
  providedIn: 'root',
})

// This service is responsible for making HTTP requests to the NestJS backend.
// It abstracts away the details of making requests so we can easily mock
// the backend in tests.
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    console.log('GET', API_URL, path);
    return this.http.get<T>(`${API_URL}/${path}`);
  }

  post<T>(path: string, body: any): Observable<T> {
    console.log('POST', API_URL, path);
    return this.http.post<T>(`${API_URL}/${path}`, body);
  }
}
