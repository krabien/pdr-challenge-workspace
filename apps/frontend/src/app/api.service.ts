import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '@pdr-challenge-workspace/shared';

// This is a global variable that is set in index.html
// It is used to configure the base URL for the API requests.
const API_URL = (<never>window)['API_URL'];

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
    return this.http.post<T>(`${(<never>window)['API_URL']}/${path}`, body);
  }
}
