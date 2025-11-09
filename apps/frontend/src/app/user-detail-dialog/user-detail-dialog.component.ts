import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../api.service';
import { User } from '@pdr-challenge-workspace/shared';
import { catchError, Observable, of, shareReplay } from 'rxjs';

@Component({
  selector: 'app-user-detail-dialog',
  standalone: true,
  imports: [
    // Angular
    AsyncPipe,
    DatePipe,
    // Angular Material
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-detail-dialog.component.html',
  styleUrl: './user-detail-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailDialogComponent {
  user$!: Observable<User | null>;
  loadError = false;

  private api = inject(ApiService);
  private dialogRef = inject(MatDialogRef<UserDetailDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);
  constructor() {
    this.user$ = this.api.get<User>(`users/${this.data.userId}`).pipe(
      shareReplay(1),
      catchError((err) => {
        console.error('Failed to load user', err);
        this.loadError = true;
        return of(null);
      }),
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
