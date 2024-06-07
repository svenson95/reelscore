import { DatePipe } from '@angular/common';
import {
  EffectRef,
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';

import {
  CalenderWeek,
  DateString,
  TODAY_ISO_STRING,
  createWeekDaysArray,
  getMondayFromDate,
  moveItem,
} from '@app/models';

export abstract class DateService {
  abstract selectedDay: WritableSignal<DateString>;
  abstract selectedDayEffect: EffectRef;
  abstract isToday: Signal<boolean>;
  abstract calenderWeek: WritableSignal<CalenderWeek>;
  abstract weekdays: Signal<DateString[]>;
  abstract getCalenderWeekFrom(day: DateString): CalenderWeek;
  abstract weekdaysFrom(date: Date): DateString[];
}

@Injectable()
export class AbstractedDateService extends DateService {
  selectedDay = signal<DateString>(TODAY_ISO_STRING);

  selectedDayEffect = effect(
    () => {
      const weekOfDay = this.getCalenderWeekFrom(this.selectedDay());
      if (this.calenderWeek() !== weekOfDay) {
        this.calenderWeek.set(weekOfDay);
      }
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
