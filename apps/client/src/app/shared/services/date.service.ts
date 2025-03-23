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

import {
  CalenderWeek,
  DateString,
  TODAY_DATE_STRING,
  createWeekDaysArray,
  getMondayFromDate,
  moveItem,
  toIsoString,
} from '@app/shared';

export abstract class DateService {
  abstract selectedDay: Signal<DateString>;
  abstract setSelectedDay(day: DateString): void;
  abstract isToday: Signal<boolean>;
  abstract calenderWeek: WritableSignal<CalenderWeek>;
  abstract weekdays: Signal<DateString[]>;
  abstract selectedTabIndex: Signal<number>;
  abstract getCalenderWeekFrom(day: DateString): CalenderWeek;
  abstract weekdaysFrom(date: Date): DateString[];
}

@Injectable()
export class AbstractedDateService extends DateService {
  private router = inject(Router);

  private urlDate = computed<string>(() => {
    const dateString = new Date(this.router.url.split('/')[1]);
    const formattedDate = toIsoString(dateString);
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

  selectedDayEffect = effect(
    () => {
      const date = this.selectedDay();
      const weekOfDay = this.getCalenderWeekFrom(date);
      if (untracked(this.calenderWeek) !== weekOfDay) {
        this.calenderWeek.set(weekOfDay);
      }
      const dateString = date.substring(0, 10);
      this.router.navigate([dateString]);
    },
    { allowSignalWrites: true }
  );

  isToday = computed<boolean>(
    () => this.selectedDay().substring(0, 10) === TODAY_DATE_STRING
  );

  calenderWeek = signal<CalenderWeek>(
    this.getCalenderWeekFrom(this.selectedDay())
  );

  weekdays = computed<DateString[]>(() => {
    const selectedDay = new Date(this.selectedDay());
    return this.weekdaysFrom(selectedDay);
  });

  getCalenderWeekFrom(day: DateString): CalenderWeek {
    const datepipe = new DatePipe('de-DE');
    return Number(datepipe.transform(day, 'w'));
  }

  weekdaysFrom(date: Date): DateString[] {
    const monday = getMondayFromDate(date);
    const weekdays = createWeekDaysArray(monday);
    return moveItem(weekdays, 0, 6);
  }
}

export const DATE_SERVICE_PROVIDER = {
  provide: DateService,
  useClass: AbstractedDateService,
};
