import { Route } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  { path: 'users', component: UsersListComponent },
  { path: '**', redirectTo: 'users' },
];
