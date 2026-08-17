import { inject, Injectable, signal } from '@angular/core';

import type { DateString } from '@lib/shared';
import { getTodayDateString } from '@lib/shared';

import { FilterService } from './filter.service';

@Injectable()
export class SelectedDateService {
  private readonly filterService = inject(FilterService);

  private readonly selectedDaySignal = signal<DateString>(this.initialDate);
  readonly selectedDay = this.selectedDaySignal.asReadonly();

  setSelectedDay(day: DateString): void {
    this.filterService.selectedCompetition.set(null);
    this.selectedDaySignal.set(day);
  }

  private get initialDate(): DateString {
    const url = window.location.pathname;
    return this.extractDateFromUrl(url);
  }

  private extractDateFromUrl(url: string): DateString {
    const dateString = url.split('/')[1];
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    if (!isValidDate) {
      console.warn(`Invalid or missing date in URL: ${dateString}`);
      return getTodayDateString();
    }
    return dateString;
  }
}
