import { DatePipe } from '@angular/common';
import { Injectable, computed, effect, signal } from '@angular/core';

import {
  CalenderWeek,
  DateString,
  TODAY,
  createWeekDaysArray,
  getMondayFromWeek,
  moveItem,
} from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  readonly selectedDay = signal<DateString>(TODAY.toISOString());

  selectedDayEffect = effect(
    () => {
      const dayWeek = this.getCalenderWeekFrom(this.selectedDay());
      const isAnotherWeek = this.calenderWeek() !== dayWeek;
      if (isAnotherWeek) {
        this.calenderWeek.set(dayWeek);
      }
    },
    { allowSignalWrites: true }
  );

  readonly isToday = computed<boolean>(
    () => this.selectedDay() === TODAY.toISOString()
  );

  readonly calenderWeek = signal<CalenderWeek>(
    this.getCalenderWeekFrom(this.selectedDay())
  );

  readonly weekdays = computed<DateString[]>(() =>
    this.getWeekDays(this.calenderWeek())
  );

  private getCalenderWeekFrom(day: DateString): CalenderWeek {
    const datepipe = new DatePipe('de-DE');
    return Number(datepipe.transform(day, 'w'));
  }

  private getWeekDays(calenderWeek: CalenderWeek): DateString[] {
    const monday = getMondayFromWeek(calenderWeek);
    const weekdays = createWeekDaysArray(monday);
    return moveItem(weekdays, 0, 6);
  }
}
