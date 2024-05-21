import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BreakpointObserverService, DateService } from '../../services';

import {
  CalenderWeekLabelComponent,
  DatePickerComponent,
  TodayButtonComponent,
  WeekToggleGroupComponent,
} from './components';

// TODO: refactor to lib?
@Component({
  selector: 'futbet-start-date-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerComponent,
    CalenderWeekLabelComponent,
    TodayButtonComponent,
    WeekToggleGroupComponent,
  ],
  styles: `
    :host { 
      @apply flex flex-wrap items-center justify-between mb-5 gap-3 sm:gap-5; 

      section { 
        @apply inline-flex flex-wrap items-center justify-center sm:w-fit gap-5; 

        div {
          @apply flex gap-5;
        }
      }
    }
  `,
  template: `
    <section>
      <div>
        <futbet-date-picker />

        @if (isMobile()) {
        <futbet-calender-week-label />
        <futbet-today-button />
        }
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
  private breakpoint = inject(BreakpointObserverService);
  private dateService = inject(DateService);

  selectedDay = this.dateService.selectedDay;
  isMobile = this.breakpoint.isMobile;
}
