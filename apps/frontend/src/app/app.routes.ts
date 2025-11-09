import { Route } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { SmileyComponent } from './smiley/smiley.component';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'users' },
  { path: 'users', component: UsersListComponent },
  { path: 'smiley', component: SmileyComponent },
  { path: '**', redirectTo: 'users' },
];
