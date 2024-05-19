import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { DateString, TODAY } from '../../models';
import { BreakpointObserverService, DateService } from '../../services';

import { DateBarDatePickerComponent } from './date-picker.component';
import { DateBarWeekToggleGroupComponent } from './week-toggle-group.component';

// TODO: refactor to lib?
@Component({
  selector: 'futbet-start-date-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BreakpointObserverService],
  imports: [
    CommonModule,
    MatButtonModule,
    DateBarDatePickerComponent,
    DateBarWeekToggleGroupComponent,
  ],
  styles: `
    :host { 
      @apply flex flex-wrap items-center justify-center mb-5 gap-3 sm:gap-5; 
      --mdc-text-button-label-text-color: var(--fb-color-green-1);

      section { @apply flex items-center w-full sm:w-fit; 
        button { @apply text-fb-font-size-body-2; } 
      }
      .date-label { 
        @apply flex ml-auto gap-3 text-fb-font-size-body-2; 

        .week { @apply text-fb-color-text-2; }
      }
    }
  `,
  template: `
    <section>
      <futbet-date-picker />

      <button mat-button (click)="setToday()" [disabled]="isToday()">
        Heute
      </button>

      @if (isMobile()) {
      <div class="date-label">
        <span class="week">Woche {{ selectedCalenderWeek() }}</span>
        <span>{{ selectedDay() | date : 'dd.MM.YY' }}</span>
      </div>
      }
    </section>

    <futbet-week-toogle-group />

    @if (!isMobile()) {
    <div class="date-label">
      <span class="week">Woche {{ selectedCalenderWeek() }}</span>
      <span>{{ selectedDay() | date : 'dd.MM.YY' }}</span>
    </div>
    }
  `,
})
export class DateBarComponent {
  private readonly breakpoint = inject(BreakpointObserverService);
  private readonly dateService = inject(DateService);

  readonly selectedDay = this.dateService.selectedDay;
  readonly selectedCalenderWeek = this.dateService.calenderWeek;

  readonly isMobile = computed<boolean>(() => this.breakpoint.isMobile());
  readonly isToday = computed<boolean>(() =>
    this.isSameDate(this.selectedDay(), TODAY)
  );

  setToday(): void {
    this.selectedDay.set(TODAY.toISOString());
  }

  private isSameDate(a: DateString, b: Date): boolean {
    const ad = new Date(a);
    const first = `${ad.getFullYear()}-${ad.getMonth()}-${ad.getDate()}`;
    const second = `${b.getFullYear()}-${b.getMonth()}-${b.getDate()}`;
    return first === second;
  }
}
