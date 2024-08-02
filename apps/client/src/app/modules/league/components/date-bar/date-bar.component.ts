import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BreakpointObserverService, DateService } from '@app/services';

import {
  CalenderWeekLabelComponent,
  DatePickerComponent,
  TodayButtonComponent,
  WeekToggleGroupComponent,
} from './components';

@Component({
  selector: 'reelscore-date-bar',
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
    }

    section { 
      @apply inline-flex flex-wrap items-center justify-center sm:w-fit gap-5; 
    }
      
    div { @apply flex gap-5 items-center; }
    .top { @apply w-full xs:w-fit justify-between; }
  `,
  template: `
    <section>
      <div class="top">
        <reelscore-date-picker
          [selectedDay]="selectedDay()"
          (dateSelected)="selectedDay.set($event)"
        />

        @if (isMobile()) {
        <div class="week-and-time">
          <reelscore-calender-week-label [week]="calenderWeek()" />
          <reelscore-today-button
            [isToday]="isToday()"
            (onClick)="selectedDay.set($event)"
          />
        </div>
        }
      </div>

      <reelscore-week-toogle-group
        [weekdays]="weekdays()"
        [selectedDay]="selectedDay()"
        (dateSelected)="selectedDay.set($event)"
      />

      @if (!isMobile()) {
      <reelscore-calender-week-label [week]="calenderWeek()" />
      }
    </section>

    @if (!isMobile()) {
    <reelscore-today-button
      [isToday]="isToday()"
      (onClick)="selectedDay.set($event)"
    />
    }
  `,
})
export class DateBarComponent {
  bos = inject(BreakpointObserverService);
  ds = inject(DateService);

  selectedDay = this.ds.selectedDay;
  weekdays = this.ds.weekdays;
  calenderWeek = this.ds.calenderWeek;
  isToday = this.ds.isToday;

  isMobile = this.bos.isMobile;
}
