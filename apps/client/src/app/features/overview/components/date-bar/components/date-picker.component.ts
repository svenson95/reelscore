import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import {
  MatDatepickerIntl,
  MatDatepickerModule,
} from '@angular/material/datepicker';
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

@Injectable()
export class CustomMatDatepickerIntl extends MatDatepickerIntl {
  override prevMonthLabel = '';
  override nextMonthLabel = '';
  override prevMultiYearLabel = '';
  override nextMultiYearLabel = '';
}

const DATE_PICKER_PROVIDERS = [
  provideNativeDateAdapter(),
  { provide: DateAdapter, useClass: CustomDateAdapter },
  { provide: MatDatepickerIntl, useClass: CustomMatDatepickerIntl },
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
      [disabled]="isLoading()"
      [class.is-open]="picker.opened"
    >
      <mat-icon>calendar_today</mat-icon>
      <span>{{ selectedDate() | date : 'dd.MM.yy' }}</span>
    </button>

    <mat-form-field>
      <input
        matInput
        tabindex="-1"
        [value]="selectedDate()"
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
  readonly isLoading = input.required<boolean>();
  readonly dateSelected = output<DateString>();

  readonly MIN_DATE = new Date(2023, 7, 11);
  readonly MAX_DATE = new Date(2026, 11, 31);

  readonly selectedDate = computed<Date>(() => {
    const value = this.selectedDay();
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  });

  updateDate(value: Date | null): void {
    if (!value) return;
    const date = formatDateToYearMonthDay(value);
    this.dateSelected.emit(date);
  }
}
