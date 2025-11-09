import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { User, UserDto } from '@pdr-challenge-workspace/shared';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsersStoreService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  readonly users$ = this.usersSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();
  private api = inject(ApiService);

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingSubject.next(true);
    this.api
      .get<User[]>('users')
      .pipe(
        tap((users) => {
          // Data is received and typed as User[] from the shared library
          this.usersSubject.next(users);
          this.loadingSubject.next(false);
        }),
        catchError((error) => {
          console.error('Failed to load users', error);
          this.loadingSubject.next(false);
          // Optionally handle error state
          return of([]);
        }),
      )
      .subscribe();
  }

  createUser(userDto: UserDto): Observable<User> {
    return this.api.post<User>('users', userDto).pipe(
      tap((newUser) => {
        // Add the new user to the local array and update the subject
        this.usersSubject.next([...this.usersSubject.getValue(), newUser]);
      }),
    );
  }
}
