import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BreakpointObserverService, DateString } from '../../../../shared';
import { DateService, SelectedDateService } from '../../services';

import {
  ActionButtonsComponent,
  DatePickerComponent,
  TodayButtonComponent,
  WeekToggleGroupComponent,
} from './components';

@Component({
  selector: 'section[rs-date-bar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerComponent,
    TodayButtonComponent,
    WeekToggleGroupComponent,
    ActionButtonsComponent,
  ],
  styles: `
    :host { @apply w-full flex flex-wrap items-center justify-between px-5 pt-5 gap-5; }
    .top { @apply flex w-full sm:w-fit items-center gap-5; }
    .spacer { @apply flex-grow; }
  `,
  template: `
    <div class="top">
      <rs-date-picker
        [selectedDay]="selectedDay()"
        (dateSelected)="setDate($event)"
      />
      @if (isMobile()){ @if (!isToday()) {
      <rs-today-button
        [today]="today()"
        [isToday]="isToday()"
        (clicked)="setDate($event)"
      />
      }
      <div class="spacer"></div>
      <rs-action-buttons />
      }
    </div>
    <rs-week-toogle-group
      [weekdays]="weekdays()"
      [selectedDay]="selectedDay()"
      [calendarWeek]="calendarWeek()"
      (dateSelected)="setDate($event)"
    />

    @if (!isMobile()){ @if (!isToday()) {
    <rs-today-button
      [today]="today()"
      [isToday]="isToday()"
      (clicked)="setDate($event)"
    />
    }
    <div class="spacer"></div>
    <rs-action-buttons />
    }
  `,
})
export class DateBarComponent {
  private breakpointObserverService = inject(BreakpointObserverService);
  isMobile = this.breakpointObserverService.isMobile;

  private dateService = inject(DateService);
  private selectedDateService = inject(SelectedDateService);
  selectedDay = this.selectedDateService.selectedDay;
  weekdays = this.dateService.weekdays;
  today = this.dateService.today;
  isToday = this.dateService.isToday;
  calendarWeek = this.dateService.calendarWeek;

  setDate(day: DateString): void {
    this.selectedDateService.setSelectedDay(day);
  }
}
