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
  private readonly breakpoint = inject(BreakpointObserverService);
  private readonly dateService = inject(DateService);

  readonly selectedDay = this.dateService.selectedDay;
  readonly isMobile = this.breakpoint.isMobile;
}
