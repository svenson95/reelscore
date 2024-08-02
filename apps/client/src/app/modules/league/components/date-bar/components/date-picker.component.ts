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
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  DateString,
  LAST_YEAR_START,
  NEXT_YEAR_END,
  toIsoString,
} from '@app/models';

@Injectable()
class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

@Component({
  selector: 'reelscore-date-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTooltipModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
  styles: `
    :host {
      @apply flex;
      --mdc-outlined-button-label-text-color: var(--fb-color-text-1);

      mat-form-field {
        @apply opacity-0 w-0 h-0;
      }
    }

    button {
      --mdc-outlined-button-container-height: 40px;
    }

    ::ng-deep mat-datepicker-content {
      touch-action: pan-x pan-y;
    }
  `,
  template: `
    <button
      mat-stroked-button
      matTooltip="Datum auswählen"
      (click)="picker.open()"
    >
      {{ selectedDay() | date : 'dd.MM.YY' }}
    </button>
    <mat-form-field>
      <input
        matInput
        tabindex="-1"
        [value]="selectedDay()"
        (dateChange)="dateSelected.emit(toIsoString($event.value))"
        [min]="MIN_DATE"
        [max]="MAX_DATE"
        [matDatepicker]="picker"
      />
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
})
export class DatePickerComponent {
  readonly MIN_DATE = LAST_YEAR_START;
  readonly MAX_DATE = NEXT_YEAR_END;

  selectedDay = input.required<DateString>();
  dateSelected = output<DateString>();

  toIsoString = toIsoString;
}
