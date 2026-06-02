import { inject, Injectable, Signal, signal } from '@angular/core';

import { DateString, getTodayDateString } from '@app/shared';

import { FilterService } from './filter.service';

export abstract class SelectedDateService {
  abstract selectedDay: Signal<DateString>;
  abstract setSelectedDay(day: DateString): void;
}

@Injectable()
export class AbstractedSelectedDateService extends SelectedDateService {
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

export const SELECTED_DATE_SERVICE_PROVIDER = {
  provide: SelectedDateService,
  useClass: AbstractedSelectedDateService,
};
