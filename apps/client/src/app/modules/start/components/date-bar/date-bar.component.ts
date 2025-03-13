import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  BreakpointObserverService,
  DateService,
  WeekdayFixturesStore,
  WeekdayStandingsStore,
} from '@app/shared';

import {
  ActionButtonsComponent,
  DatePickerComponent,
  TodayButtonComponent,
  WeekToggleGroupComponent,
} from './components';

@Component({
  selector: 'reelscore-date-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule,
    DatePickerComponent,
    TodayButtonComponent,
    WeekToggleGroupComponent,
    ActionButtonsComponent,
  ],
  styles: `
    :host { @apply w-full flex flex-wrap items-center justify-between mb-5 gap-5; }
    mat-spinner { 
      --mdc-circular-progress-active-indicator-color: var(--fb-color-red); 
      @media (max-width: 400px) { @apply hidden; }
    }
    .top { @apply flex w-full sm:w-fit items-center gap-5; }
    .spacer { @apply flex-grow; }
  `,
  template: `
    <div class="top">
      <reelscore-date-picker
        [selectedDay]="selectedDay()"
        (dateSelected)="selectedDay.set($event)"
      />
      @if (isMobile()){ @if (!isToday()) {
      <reelscore-today-button
        [isToday]="isToday()"
        (onClick)="selectedDay.set($event)"
      />
      } @if (isLoading()) {
      <mat-spinner diameter="20"></mat-spinner>}
      <div class="spacer"></div>
      <reelscore-action-buttons />
      }
    </div>

    <reelscore-week-toogle-group
      [weekdays]="weekdays()"
      [selectedDay]="selectedDay()"
      (dateSelected)="selectedDay.set($event)"
    />

    @if (!isMobile()){ @if (!isToday()) {
    <reelscore-today-button
      [isToday]="isToday()"
      (onClick)="selectedDay.set($event)"
    />
    } @if (isLoading()) {
    <mat-spinner diameter="20"></mat-spinner>}
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

  weekStandingsStore = inject(WeekdayStandingsStore);
  weekFixturesStore = inject(WeekdayFixturesStore);

  isLoading = computed(
    () =>
      this.weekStandingsStore.isLoading() || this.weekFixturesStore.isLoading()
  );
}
