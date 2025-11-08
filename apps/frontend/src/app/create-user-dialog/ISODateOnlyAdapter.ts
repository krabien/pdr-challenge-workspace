// Component-scoped date adapter to use yyyy-MM-dd for parse/display
import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';

export const YYYY_MM_DD_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'yyyy-MM-dd',
  },
  display: {
    dateInput: 'yyyy-MM-dd',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'yyyy-MM-dd',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Injectable()
export class ISODateOnlyAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  override parse(value: unknown): Date | null {
    if (typeof value === 'string') {
      const str = value.trim();
      const m = str.match(/^\d{4}-\d{2}-\d{2}$/);
      if (m) {
        const [y, mth, d] = str.split('-').map((x) => Number(x));
        const dt = new Date(y, mth - 1, d);
        if (
          !isNaN(dt.getTime()) &&
          dt.getFullYear() === y &&
          dt.getMonth() === mth - 1 &&
          dt.getDate() === d
        ) {
          return dt;
        }
        return null;
      }
    }
    return super.parse(value);
  }
}
