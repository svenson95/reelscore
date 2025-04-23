import { DatePipe } from '@angular/common';
import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment-timezone';

import { CalendarWeek, DateString } from '../../../shared';
import { SelectedDateService } from './selected-date.service';

export abstract class DateService {
  abstract selectedTabIndex: Signal<number>;
  abstract today: Signal<DateString>;
  abstract isToday: Signal<boolean>;
  abstract resetToday(): void;
  abstract calendarWeek: WritableSignal<CalendarWeek>;
  abstract weekdays: Signal<DateString[]>;
  abstract getCalendarWeekFrom(day: DateString): CalendarWeek;
}

@Injectable()
export class AbstractedDateService extends DateService {
  private router = inject(Router);
  private selectedDateService = inject(SelectedDateService);

  selectedTabIndex = computed<number>(() => {
    return this.weekdays().findIndex(
      (day) => day === this.selectedDateService.selectedDay()
    );
  });

  selectedDayEffect = effect(() => {
    const date = this.selectedDateService.selectedDay();
    const calendarWeek = this.calendarWeek;
    const weekOfDay = this.getCalendarWeekFrom(date);
    if (untracked(calendarWeek) !== weekOfDay) {
      calendarWeek.set(weekOfDay);
    }

    this.updateRoute(date);
  });

  #today = signal<DateString>(this.getToday());
  today = this.#today.asReadonly();
  isToday = computed<boolean>(
    () => this.selectedDateService.selectedDay() === this.today()
  );

  resetToday(): void {
    const todayDate = this.getToday();
    this.#today.set(todayDate);
  }

  private updateRoute(date: DateString): void {
    const currentRoute = this.router.url.split('/')[1];
    const dateRoute = date.substring(0, 10);

    if (currentRoute !== dateRoute) {
      this.router.navigate([dateRoute]);
    }
  }

  private getToday(): DateString {
    return moment().tz('Europe/Berlin').format('YYYY-MM-DD');
  }

  calendarWeek = signal<CalendarWeek>(
    this.getCalendarWeekFrom(this.selectedDateService.selectedDay())
  );

  weekdays = computed<DateString[]>(() => {
    void this.calendarWeek(); // trigger recompute
    const selectedDay = untracked(this.selectedDateService.selectedDay);
    const selectedDate = new Date(selectedDay);
    return this.createWeekDaysArray(selectedDate);
  });

  private getStartOfWeek = (date: Date): Date => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const correctedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() - correctedDayOfWeek + 1);
    return startOfWeek;
  };

  private createWeekDaysArray = (date: Date): DateString[] => {
    const startOfWeek = this.getStartOfWeek(date);

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return moment(day).tz('Europe/Berlin').format('YYYY-MM-DD');
    });
  };

  getCalendarWeekFrom(day: DateString): CalendarWeek {
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
