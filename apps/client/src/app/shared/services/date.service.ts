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
  TODAY_ISO_STRING,
  createWeekDaysArray,
  getMondayFromDate,
  moveItem,
  toIsoString,
} from '@app/shared';

export abstract class DateService {
  abstract selectedDay: WritableSignal<DateString>;
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
    return toIsoString(dateString);
  });
  selectedDay = signal<DateString>(this.urlDate());

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
      this.router.navigate([date.split('T')[0]]);
    },
    { allowSignalWrites: true }
  );

  isToday = computed<boolean>(() => this.selectedDay() === TODAY_ISO_STRING);

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
