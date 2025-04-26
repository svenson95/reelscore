import { CommonModule } from '@angular/common';
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
import moment from 'moment-timezone';

import { DateString } from '@app/shared';

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
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatIconModule,
  ],
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

    ::ng-deep mat-datepicker-content {
      touch-action: pan-x pan-y;
    }
  `,
  template: `
    <button
      mat-flat-button
      matTooltip="Datum auswählen"
      (click)="picker.open()"
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
  readonly MIN_DATE = new Date(moment().toDate().getFullYear() - 1, 0, 1);
  readonly MAX_DATE = new Date(moment().toDate().getFullYear() + 1, 11, 31);

  selectedDay = input.required<DateString>();
  dateSelected = output<DateString>();

  updateDate(value: DateString): void {
    const date = moment(value).tz('Europe/Berlin').format('YYYY-MM-DD');
    this.dateSelected.emit(date);
  }
}
