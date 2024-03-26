import { Injectable, effect, signal } from '@angular/core';
import { DayTime, TODAY } from '../../components';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  readonly selectedDayTime = signal<DayTime>(TODAY.getTime());

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

  private getWeekdaysFromDate(date: DayTime | null): DayTime[] {
    if (date === null) return [0];
    return Array(7)
      .fill(new Date(date))
      .map((d, i) =>
        new Date(d.setDate(d.getDate() - d.getDay() + i)).getTime()
      );
  }
}
