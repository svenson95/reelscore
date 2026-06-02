import { DatePipe } from '@angular/common';
import {
  Injectable,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import moment from 'moment-timezone';

import {
  APP_TIMEZONE,
  CalendarWeek,
  DateString,
  formatCalendarWeekKey,
  getTodayDateString,
} from '@app/shared';

import { SelectedDateService } from './selected-date.service';

export abstract class DateService {
  abstract selectedTabIndex: Signal<number>;
  abstract today: Signal<DateString>;
  abstract isToday: Signal<boolean>;
  abstract resetToday(): void;
  abstract calendarWeek: Signal<CalendarWeek>;
  abstract calendarWeekKey: Signal<string>;
  abstract weekdays: Signal<DateString[]>;
}

@Injectable()
export class AbstractedDateService extends DateService {
  private readonly router = inject(Router);
  private readonly selectedDateService = inject(SelectedDateService);

  readonly selectedTabIndex = computed<number>(() => {
    return this.weekdays().findIndex(
      (day) => day === this.selectedDateService.selectedDay()
    );
  });

  private readonly todaySignal = signal<DateString>(getTodayDateString());
  readonly today = this.todaySignal.asReadonly();
  readonly isToday = computed<boolean>(
    () => this.selectedDateService.selectedDay() === this.today()
  );

  readonly calendarWeek = computed<CalendarWeek>(() =>
    this.getCalendarWeekFrom(this.selectedDateService.selectedDay())
  );

  readonly calendarWeekKey = computed<string>(() =>
    formatCalendarWeekKey(this.selectedDateService.selectedDay())
  );

  readonly weekdays = computed<DateString[]>(() => {
    const selectedDay = this.selectedDateService.selectedDay();

    return this.createWeekDaysArray(selectedDay);
  });

  readonly selectedDayEffect = effect(() => {
    const date = this.selectedDateService.selectedDay();
    this.updateRoute(date);
  });

  resetToday(): void {
    const todayDate = getTodayDateString();

    this.todaySignal.set(todayDate);
    this.selectedDateService.setSelectedDay(todayDate);
  }

  private updateRoute(date: DateString): void {
    const currentRoute = this.router.url.split('/')[1];
    const dateRoute = date.substring(0, 10);

    if (currentRoute !== dateRoute) {
      this.router.navigate([dateRoute]);
    }
  }

  private createWeekDaysArray(day: DateString): DateString[] {
    const startOfWeek = moment
      .tz(day, 'YYYY-MM-DD', APP_TIMEZONE)
      .startOf('isoWeek');

    return Array.from({ length: 7 }, (_, index) =>
      startOfWeek.clone().add(index, 'days').format('YYYY-MM-DD')
    );
  }

  private getCalendarWeekFrom(day: DateString): CalendarWeek {
    try {
      const datepipe = new DatePipe('de-DE');
      const week = datepipe.transform(day, 'w');
      if (!week) {
        throw new Error(
          `Invalid date: getCalendarWeekFrom(day: DateString): CalendarWeek | ${day}`
        );
      }
      return Number(week);
    } catch (error) {
      console.error(
        'Error calculating calendar week: getCalendarWeekFrom(day: DateString): CalendarWeek',
        error
      );
      return 0;
    }
  }
}

export const DATE_SERVICE_PROVIDER = {
  provide: DateService,
  useClass: AbstractedDateService,
};
