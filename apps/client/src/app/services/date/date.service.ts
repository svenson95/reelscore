import { Injectable, computed, effect, signal } from '@angular/core';

import { DayTime, TODAY } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  readonly selectedDayTime = signal<DayTime>(TODAY.getTime());

  readonly currentCalenderWeek = computed<number>(() => {
    const d = new Date(TODAY);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  });

  readonly selectedCalenderWeek = signal<number>(this.currentCalenderWeek());

  readonly weekdays = signal<DayTime[]>(
    this.getWeekdaysFromDate(this.selectedDayTime())
  );

  readonly selectedDayEffect = effect(
    () => {
      if (!this.weekdays()?.includes(this.selectedDayTime())) {
        this.weekdays.set(this.getWeekdaysFromDate(this.selectedDayTime()));
      }
    },
    { allowSignalWrites: true }
  );

  getDate(
    week: 'today' | 'previous-day' | 'next-day' | 'previous-week' | 'next-week'
  ): DayTime {
    const date = new Date(this.selectedDayTime()).getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    switch (week) {
      case 'today':
        return new Date().getTime();
      case 'previous-day':
        return new Date(date - oneDay).getTime();
      case 'next-day':
        return new Date(date + oneDay).getTime();
      case 'previous-week':
        return new Date(date - oneWeek).getTime();
      case 'next-week':
        return new Date(date + oneWeek).getTime();
    }
  }

  private getWeekdaysFromDate(date: DayTime): DayTime[] {
    const array = Array(7)
      .fill(new Date(date))
      .map((d, i) =>
        new Date(d.setDate(d.getDate() - d.getDay() + i)).getTime()
      );
    array.push(array.shift()!);
    return array;
  }
}
