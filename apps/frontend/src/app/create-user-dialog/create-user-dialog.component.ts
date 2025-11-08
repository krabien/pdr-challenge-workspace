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
import { UserDto, UserSchema } from '@pdr-challenge-workspace/shared';

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
    birthDate: [null as Date | null],
  });

  // Helpers for template to avoid TS-like casts in Angular expressions
  hasZodError(controlName?: string): boolean {
    const ctrl = controlName ? this.form.get(controlName) : this.form;
    return !!ctrl?.errors?.['zod'];
  }
  getZodErrors(controlName?: string): string[] {
    const ctrl = controlName ? this.form.get(controlName) : this.form;
    const errs = ctrl?.errors?.['zod'] as unknown as string[] | undefined;
    return Array.isArray(errs) ? errs : [];
  }

  private formatLocalDate(d: Date): string {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  onSubmit(): void {
    // clear previous zod errors
    Object.keys(this.form.controls).forEach((key) => {
      const c = this.form.get(key);
      if (!c) return;
      if (c.hasError('zod')) {
        const errs = { ...(c.errors || {}) } as Record<string, unknown>;
        delete errs['zod'];
        c.setErrors(Object.keys(errs).length ? errs : null);
      }
      c.markAsTouched();
    });
    if (this.form.hasError('zod')) {
      const errs = { ...(this.form.errors || {}) } as Record<string, unknown>;
      delete errs['zod'];
      this.form.setErrors(Object.keys(errs).length ? errs : null);
    }

    const raw = this.form.getRawValue();
    const dto: UserDto = {
      firstName: (raw.firstName ?? '').trim(),
      lastName: (raw.lastName ?? '').trim(),
      email: (raw.email ?? '').trim() || undefined,
      phoneNumber: (raw.phoneNumber ?? '').trim() || undefined,
      birthDate: raw.birthDate
        ? this.formatLocalDate(raw.birthDate as Date)
        : '',
      role: raw.role as never,
    } as const;

    const result = UserSchema.safeParse(dto);
    if (result.success) {
      this.submitAndClose(dto);
      return;
    }

    for (const issue of result.error.issues) {
      const path = issue.path?.[0] as string | undefined;
      if (path && this.form.get(path)) {
        const ctrl = this.form.get(path)!;
        const prev = ctrl.errors || {};
        const messages = [issue.message].concat(
          (prev['zod'] as string[] | undefined) || []
        );
        ctrl.setErrors({ ...prev, zod: messages });
        ctrl.markAsTouched();
      } else {
        const prev = this.form.errors || {};
        const messages = [issue.message].concat(
          (prev['zod'] as string[] | undefined) || []
        );
        this.form.setErrors({ ...prev, zod: messages });
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  private submitAndClose(dto: UserDto) {
    // No submit logic yet; just log to console to demonstrate validity.
    // eslint-disable-next-line no-console
    console.log('Validated user DTO', dto);
    this.close();
  }
}
