import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  addDays,
  formatCalendarWeekKey,
  getTodayDateString,
  getWeekStartFromKey,
  type DateString,
} from '@lib/shared';

import { SelectedDateService } from './selected-date.service';

@Injectable()
export class DateNavigationService {
  private readonly router = inject(Router);
  private readonly selectedDateService = inject(SelectedDateService);

  private readonly todaySignal = signal<DateString>(getTodayDateString());
  readonly today = this.todaySignal.asReadonly();

  readonly calendarWeekKey = computed<string>(() =>
    formatCalendarWeekKey(this.selectedDateService.selectedDay())
  );

  readonly weekdays = computed<DateString[]>(() =>
    this.createWeekDaysArray(this.calendarWeekKey())
  );

  readonly selectedTabIndex = computed<number>(() =>
    this.weekdays().findIndex(
      (day) => day === this.selectedDateService.selectedDay()
    )
  );

  readonly isToday = computed<boolean>(
    () => this.selectedDateService.selectedDay() === this.today()
  );

  private readonly selectedDayEffect = effect(() => {
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

  private createWeekDaysArray(weekKey: string): DateString[] {
    const weekStart = getWeekStartFromKey(weekKey);

    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  }
}
