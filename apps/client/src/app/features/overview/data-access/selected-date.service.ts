import { DOCUMENT, Location } from '@angular/common';
import { inject, Injectable, REQUEST, signal } from '@angular/core';

import type { DateString } from '@reelscore-sdk/helpers';
import { getTodayDateString } from '@reelscore-sdk/helpers';

import { FilterService } from './filter.service';

@Injectable()
export class SelectedDateService {
  private readonly filterService = inject(FilterService);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);
  private readonly request = inject(REQUEST, { optional: true });

  private readonly selectedDaySignal = signal<DateString>(this.initialDate);
  readonly selectedDay = this.selectedDaySignal.asReadonly();

  setSelectedDay(day: DateString): void {
    this.filterService.selectedCompetition.set(null);
    this.selectedDaySignal.set(day);
  }

  private get initialDate(): DateString {
    return this.extractDateFromUrl(this.currentPathname);
  }

  private get currentPathname(): string {
    const requestUrl = this.request?.url;

    if (requestUrl) {
      return new URL(requestUrl).pathname;
    }

    return this.document.defaultView?.location.pathname ?? this.location.path();
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
