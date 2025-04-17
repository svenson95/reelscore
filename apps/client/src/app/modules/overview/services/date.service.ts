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
import moment from 'moment';

import {
  CalendarWeek,
  DateString,
  TODAY_DATE_STRING,
  createWeekDaysArray,
} from '../../../shared';

export abstract class DateService {
  abstract selectedDay: Signal<DateString>;
  abstract setSelectedDay(day: DateString): void;
  abstract isToday: Signal<boolean>;
  abstract calendarWeek: WritableSignal<CalendarWeek>;
  abstract weekdays: Signal<DateString[]>;
  abstract selectedTabIndex: Signal<number>;
  abstract getCalendarWeekFrom(day: DateString): CalendarWeek;
}

@Injectable()
export class AbstractedDateService extends DateService {
  private router = inject(Router);

  private urlDate = computed<string>(() => {
    const dateString = this.router.url.split('/')[1];
    const formattedDate = moment(dateString)
      .tz('Europe/Berlin')
      .format('YYYY-MM-DD');
    return formattedDate;
  });

  #selectedDaySignal = signal<DateString>(this.urlDate());
  selectedDay = this.#selectedDaySignal.asReadonly();
  setSelectedDay(day: DateString): void {
    this.#selectedDaySignal.set(day);
  }

  selectedTabIndex = computed<number>(() => {
    return this.weekdays().findIndex((day) => day === this.selectedDay());
  });

  selectedDayEffect = effect(() => {
    const date = this.selectedDay();
    const weekOfDay = this.getCalendarWeekFrom(date);
    if (untracked(this.calendarWeek) !== weekOfDay) {
      this.calendarWeek.set(weekOfDay);
    }
    const dateString = date.substring(0, 10);
    this.router.navigate([dateString]);
  });

  isToday = computed<boolean>(() => this.selectedDay() === TODAY_DATE_STRING);

  calendarWeek = signal<CalendarWeek>(
    this.getCalendarWeekFrom(this.selectedDay())
  );

  weekdays = computed<DateString[]>(() => {
    const selectedDay = new Date(this.selectedDay());
    return createWeekDaysArray(selectedDay);
  });

  getCalendarWeekFrom(day: DateString): CalendarWeek {
    const datepipe = new DatePipe('de-DE');
    return Number(datepipe.transform(day, 'w'));
  }
}

export const DATE_SERVICE_PROVIDER = {
  provide: DateService,
  useClass: AbstractedDateService,
};
