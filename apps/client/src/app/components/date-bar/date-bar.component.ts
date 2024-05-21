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
        <futbet-date-picker
          [selectedDay]="selectedDay()"
          (dateSelected)="selectedDay.set($event)"
        />

        @if (isMobile()) {
        <futbet-calender-week-label [week]="calenderWeek()" />
        <futbet-today-button
          [isToday]="isToday()"
          (onClick)="selectedDay.set($event)"
        />
        }
      </div>

      <futbet-week-toogle-group
        [weekdays]="weekdays()"
        [selectedDay]="selectedDay()"
        (dateSelected)="selectedDay.set($event)"
      />

      @if (!isMobile()) {
      <futbet-calender-week-label [week]="calenderWeek()" />
      }
    </section>

    @if (!isMobile()) {
    <futbet-today-button
      [isToday]="isToday()"
      (onClick)="selectedDay.set($event)"
    />
    }
  `,
})
export class DateBarComponent {
  private breakpoint = inject(BreakpointObserverService);
  private dateService = inject(DateService);

  selectedDay = this.dateService.selectedDay;
  weekdays = this.dateService.weekdays;
  calenderWeek = this.dateService.calenderWeek;
  isToday = this.dateService.isToday;

  isMobile = this.breakpoint.isMobile;
}
