import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  NativeDateAdapter,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import type { DateString } from '@lib/shared';
import { formatDateToYearMonthDay } from '@lib/shared';

const MAT_MODULES = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatIconModule,
];

@Injectable()
class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

const DATE_PICKER_PROVIDERS = [
  provideNativeDateAdapter(),
  { provide: DateAdapter, useClass: CustomDateAdapter },
];

@Component({
  selector: 'rs-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...MAT_MODULES, DatePipe],
  providers: [...DATE_PICKER_PROVIDERS],
  styles: `
    @use '@angular/material' as mat;

    :host {
      @apply flex;

      mat-form-field {
        @apply opacity-0 w-0 h-0;
      }

      @include mat.button-overrides(
        (
          filled-container-height: 36px,
        )
      );
    }
  `,
  template: `
    <button
      mat-flat-button
      (click)="picker.open()"
      [class.is-open]="picker.opened"
    >
      <mat-icon>calendar_today</mat-icon>
      <span>{{ selectedDay() | date : 'dd.MM.YY' }}</span>
    </button>
    <mat-form-field>
      <input
        matInput
        tabindex="-1"
        [value]="selectedDay()"
        (dateChange)="updateDate($event.value)"
        [min]="MIN_DATE"
        [max]="MAX_DATE"
        [matDatepicker]="picker"
      />
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
})
export class DatePickerComponent {
  readonly selectedDay = input.required<DateString>();
  readonly dateSelected = output<DateString>();

  readonly MIN_DATE = formatDateToYearMonthDay(new Date(2023, 7, 11));
  readonly MAX_DATE = formatDateToYearMonthDay(
    new Date(new Date().getFullYear(), 11, 31)
  );

  updateDate(value: DateString): void {
    const date = formatDateToYearMonthDay(value);
    this.dateSelected.emit(date);
  }
}
