import { Injectable, computed, effect, signal } from '@angular/core';

import { DatePipe } from '@angular/common';
import { CalenderWeek, DateString, TODAY, moveItem } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  readonly selectedDay = signal<DateString>(TODAY.toISOString());

  selectedDayEffect = effect(
    () => {
      const day = this.selectedDay();
      const dayWeek = this.calenderWeekFrom(day);
      const isAnotherWeek = this.calenderWeek() !== dayWeek;
      if (isAnotherWeek) {
        this.calenderWeek.set(dayWeek);
      }
    },
    { allowSignalWrites: true }
  );

  readonly calenderWeek = signal<CalenderWeek>(
    this.calenderWeekFrom(this.selectedDay())
  );

  readonly weekdays = computed<DateString[]>(() =>
    this.getWeekDays(this.calenderWeek())
  );

  private calenderWeekFrom(day: DateString): CalenderWeek {
    const datepipe = new DatePipe('de-DE');
    return Number(datepipe.transform(day, 'w'));
  }

  private getWeekDays(calenderWeek: CalenderWeek): DateString[] {
    const monday = this.getMondayFromWeek(calenderWeek);
    const weekdays = this.createWeekDaysArray(monday);
    return moveItem(weekdays, 0, 6);
  }

  private createWeekDaysArray(date: Date): DateString[] {
    return Array(7)
      .fill(date)
      .map((d, i) => {
        const day = new Date(d.setDate(d.getDate() - d.getDay() + i));
        const isSunday = d.getDay() === 0;
        if (isSunday) day.setDate(day.getDate() + 7);

        day.setHours(0, 0, 0, 0);
        return day.toISOString();
      });
  }

  private getMondayFromWeek(calenderWeek: CalenderWeek): Date {
    const d = 1 + (calenderWeek - 1) * 7;
    const date = new Date(2024, 0, d);
    const dayOfWeek = date.getDay();

    const isSunday = dayOfWeek === 0;
    const difference = isSunday ? 6 : dayOfWeek - 1;

    return new Date(date.setDate(date.getDate() - difference));
  }
}
