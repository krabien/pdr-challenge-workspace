import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { UsersStoreService } from '../users-storage.service';
import { User } from '@pdr-challenge-workspace/shared';
import { Subscription } from 'rxjs';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    // Angular
    AsyncPipe,
    RouterModule,
    // Angular Material
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersListComponent implements OnDestroy {
  // Define the columns to display in the material table
  readonly displayedColumns: (keyof User)[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'role',
  ];

  readonly dataSource = new MatTableDataSource<User>([]);

  // because the table is inside an @if block, we have to use a view child to get the paginator
  @ViewChild(MatPaginator)
  set paginator(p: MatPaginator | undefined) {
    if (p) {
      this.dataSource.paginator = p;
    }
  }

  private sub = new Subscription();

  constructor(
    public readonly usersService: UsersStoreService,
    private dialog: MatDialog
  ) {
    // search by full name
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const fullName = `${data.firstName} ${data.lastName}`.toLowerCase();
      return fullName.includes(filter);
    };

    // Feed data into the table's data source
    this.sub.add(
      this.usersService.users$.subscribe((users) => {
        this.dataSource.data = users ?? [];
      })
    );
  }

  openDetails(user: User): void {
    if (!user?.id) return;
    this.dialog.open(UserDetailDialogComponent, {
      data: { userId: user.id },
      width: '480px',
    });
  }

  // Called from the template on input
  applyFilter(value: string): void {
    this.dataSource.filter = (value ?? '').trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  openCreateUserDialog() {
    this.dialog.open(CreateUserDialogComponent, {
      width: '480px',
    });
  }
}
