import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { BreakpointObserverService } from '@app/shared';
import type { DateString } from '@lib/shared';

import { DateService, SelectedDateService } from '../../services';
import { WeekdayFixturesStore, WeekdayStandingsStore } from '../../store';

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
    :host { @apply w-full flex flex-wrap items-center justify-between px-3 pt-3 gap-2 sm:gap-4; }
    .top { @apply flex w-full sm:w-fit items-center; }
    .top > *:not(:first-child) { border-left: 1px solid var(--mat-sys-surface); }
    .spacer { @apply flex-grow; }
    :host ::ng-deep button.is-open {
      @apply bg-rs-color-primary text-rs-color-text-3;
    }
  `,
  template: `
    <div class="top">
      <rs-date-picker
        [selectedDay]="selectedDay()"
        [isLoading]="isLoading()"
        (dateSelected)="setDate($event)"
      />
      @if (isMobile()){ @if (!isToday()) {
      <rs-today-button [isLoading]="isLoading()" (clicked)="resetDate()" />
      }
      <div class="spacer"></div>
      <rs-action-buttons />
      }
    </div>

    <rs-week-toggle-group
      [weekdays]="weekdays()"
      [selectedDay]="selectedDay()"
      [calendarWeek]="calendarWeek()"
      [isLoading]="isLoading()"
      (dateSelected)="setDate($event)"
    ></rs-week-toggle-group>

    @if (!isMobile()){ @if (!isToday()) {
    <rs-today-button [isLoading]="isLoading()" (clicked)="resetDate()" />
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

  private readonly weekFixtures = inject(WeekdayFixturesStore);
  private readonly weekStandings = inject(WeekdayStandingsStore);

  readonly isLoading = computed<boolean>(
    () => this.weekFixtures.isLoading() || this.weekStandings.isLoading()
  );

  setDate(day: DateString): void {
    const formattedDate = day.split('T')[0];
    this.selectedDateService.setSelectedDay(formattedDate);
  }

  resetDate(): void {
    this.dateService.resetToday();
  }
}
