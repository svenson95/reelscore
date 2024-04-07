import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DateValue, DayTime } from '../../models';
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
    MatTooltipModule,
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

      <button mat-button (click)="setDate('today')" [disabled]="isToday()">
        Heute
      </button>

      @if (isMobile()) {
      <div class="date-label">
        <span class="week">Woche {{ selectedDayTime() | date : 'w' }}</span>
        <span>{{ selectedDayTime() | date : 'dd.MM.YY' }}</span>
      </div>
      }
    </section>

    <futbet-week-toogle-group />

    @if (!isMobile()) {
    <div class="date-label">
      <span class="week">Woche {{ selectedDayTime() | date : 'w' }}</span>
      <span>{{ selectedDayTime() | date : 'dd.MM.YY' }}</span>
    </div>
    }
  `,
})
export class DateBarComponent {
  private readonly breakpoint = inject(BreakpointObserverService);
  readonly service = inject(DateService);
  readonly selectedDayTime = this.service.selectedDayTime;

  readonly isMobile = computed<boolean>(() => this.breakpoint.isMobile());
  readonly isToday = computed<boolean>(() =>
    this.isSameDate(this.selectedDayTime(), this.service.getDate('today'))
  );

  setDate(date: DateValue): void {
    const selected = this.service.getDate(date);
    this.selectedDayTime.set(selected);
  }

  private isSameDate(a: DayTime, b: DayTime): boolean {
    return a === b;
  }
}
