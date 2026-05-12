import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { BreakpointObserverService, DateString } from '@app/shared';

import { DateService, SelectedDateService } from '../../services';

import {
  ActionButtonsComponent,
  DatePickerComponent,
  TodayButtonComponent,
  WeekToggleGroupComponent,
} from './components';

@Component({
  selector: 'nav[rs-date-bar]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePickerComponent,
    TodayButtonComponent,
    WeekToggleGroupComponent,
    ActionButtonsComponent,
  ],
  styles: `
    :host { @apply w-full flex flex-wrap items-center justify-between px-3 pt-3 sm:px-4 sm:pt-4 gap-2 sm:gap-4; }
    .top { @apply flex w-full sm:w-fit items-center; }
    .top > *:not(:first-child) { border-left: 1px solid var(--mat-sys-surface); }
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

    <rs-week-toggle-group
      [weekdays]="weekdays()"
      [selectedDay]="selectedDay()"
      [calendarWeek]="calendarWeek()"
      (dateSelected)="setDate($event)"
    ></rs-week-toggle-group>

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
    if (day.includes('T')) {
      const formattedDate = day.split('T')[0];
      this.selectedDateService.setSelectedDay(formattedDate);
    } else {
      this.selectedDateService.setSelectedDay(day);
    }
  }
}
