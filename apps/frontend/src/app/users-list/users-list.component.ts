import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersStoreService } from '../users-storage.service';
import { User } from '@pdr-challenge-workspace/shared';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    // Angular
    AsyncPipe,
    DatePipe,
    // Angular Material
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent {
  // Define the columns to display in the material table
  readonly displayedColumns: (keyof User)[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'role',
  ];

  constructor(public readonly usersService: UsersStoreService) {}
}
