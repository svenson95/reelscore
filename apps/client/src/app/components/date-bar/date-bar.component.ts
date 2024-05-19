import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BreakpointObserverService, DateService } from '../../services';

import {
  CalenderWeekLabelComponent,
  DateBarDatePickerComponent,
  DateBarWeekToggleGroupComponent,
  TodayButtonComponent,
} from './components';

// TODO: refactor to lib?
@Component({
  selector: 'futbet-start-date-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    DateBarDatePickerComponent,
    DateBarWeekToggleGroupComponent,
    CalenderWeekLabelComponent,
    TodayButtonComponent,
  ],
  styles: `
    :host { 
      @apply flex flex-wrap items-center justify-between mb-5 gap-3 sm:gap-5; 
      --mdc-text-button-label-text-color: var(--fb-color-green-1);

      section { 
        @apply inline-flex flex-wrap items-center justify-between w-full sm:w-fit gap-5; 

        .date-labels {
          @apply flex gap-5;
        }
      }

      span, futbet-calender-week-label { 
        @apply flex items-center ml-auto gap-3 text-fb-font-size-body-2; 
      }
    }
  `,
  template: `
    <section>
      <futbet-date-picker />

      <div class="date-labels">
        @if (isMobile()) {
        <futbet-today-button />

        <futbet-calender-week-label />
        }
        <span>{{ selectedDay() | date : 'dd.MM.YY' }}</span>
      </div>

      <futbet-week-toogle-group />

      @if (!isMobile()) {
      <futbet-calender-week-label />
      }
    </section>

    @if (!isMobile()) {
    <futbet-today-button />
    }
  `,
})
export class DateBarComponent {
  private readonly breakpoint = inject(BreakpointObserverService);
  private readonly dateService = inject(DateService);

  readonly selectedDay = this.dateService.selectedDay;
  readonly isMobile = this.breakpoint.isMobile;
}
