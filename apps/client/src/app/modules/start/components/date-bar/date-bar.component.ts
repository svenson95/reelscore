import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import {
  BreakpointObserverService,
  DateService,
  DateString,
} from '@app/shared';

import {
  ActionButtonsComponent,
  DatePickerComponent,
  TodayButtonComponent,
  WeekToggleGroupComponent,
} from './components';

@Component({
  selector: 'reelscore-date-bar',
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
      <reelscore-date-picker
        [selectedDay]="selectedDay()"
        (dateSelected)="setDate($event)"
      />
      @if (isMobile()){ @if (!isToday()) {
      <reelscore-today-button
        [isToday]="isToday()"
        (clicked)="setDate($event)"
      />
      }
      <div class="spacer"></div>
      <reelscore-action-buttons />
      }
    </div>

    <reelscore-week-toogle-group
      [weekdays]="weekdays()"
      [selectedDay]="selectedDay()"
      (dateSelected)="setDate($event)"
    />

    @if (!isMobile()){ @if (!isToday()) {
    <reelscore-today-button [isToday]="isToday()" (clicked)="setDate($event)" />
    }
    <div class="spacer"></div>
    <reelscore-action-buttons />
    }
  `,
})
export class DateBarComponent {
  breakpointObserverService = inject(BreakpointObserverService);
  isMobile = this.breakpointObserverService.isMobile;

  dateService = inject(DateService);
  selectedDay = this.dateService.selectedDay;
  weekdays = this.dateService.weekdays;
  isToday = this.dateService.isToday;

  setDate(day: DateString) {
    this.dateService.setSelectedDay(day);
  }
}
