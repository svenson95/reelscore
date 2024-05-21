import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  NativeDateAdapter,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TODAY } from '../../../models';
import { DateService } from '../../../services';

@Injectable()
class CustomDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}

const LAST_YEAR = new Date(TODAY.getFullYear() - 1, 0, 1);
const NEXT_YEAR = new Date(TODAY.getFullYear() + 1, 11, 31);

// TODO: refactor to lib?
@Component({
  selector: 'futbet-date-picker',
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
      --mdc-outlined-button-label-text-color: var(--fb-color-text-1);

      mat-form-field {
        @apply opacity-0 w-0 h-0;
      }
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
        (dateChange)="dateChange($event)"
        [min]="minDate"
        [max]="maxDate"
        [matDatepicker]="picker"
      />
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
})
export class DatePickerComponent {
  readonly minDate = LAST_YEAR;
  readonly maxDate = NEXT_YEAR;

  private service = inject(DateService);

  selectedDay = this.service.selectedDay;

  dateChange(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) this.selectedDay.set(event.value.toISOString());
  }
}
