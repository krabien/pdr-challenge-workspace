import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UserSchema } from '@pdr-challenge-workspace/shared';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    // Angular
    ReactiveFormsModule,
    // Angular Material
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);
  private readonly fb = inject(FormBuilder);

  // populate roles from the shared library as it is the single source of truth
  readonly roles = UserSchema.shape.role.options as string[];

  readonly form = this.fb.group({
    firstName: [''],
    lastName: [''],
    email: [''],
    role: [this.roles[this.roles.length - 1], []],
    phoneNumber: [''],
    birthDate: [null],
  });

  close(): void {
    this.dialogRef.close();
  }
}
