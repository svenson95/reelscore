import { Injectable, Signal, signal } from '@angular/core';
import moment from 'moment-timezone';

import { DateString } from '../../../shared';

export abstract class SelectedDateService {
  abstract selectedDay: Signal<DateString>;
  abstract setSelectedDay(day: DateString): void;
}

@Injectable()
export class AbstractedSelectedDateService extends SelectedDateService {
  private selectedDaySignal = signal<DateString>(this.initialDate);
  selectedDay = this.selectedDaySignal.asReadonly();
  setSelectedDay(day: DateString): void {
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
      return moment().tz('Europe/Berlin').format('YYYY-MM-DD');
    }
    return dateString;
  }
}

export const SELECTED_DATE_SERVICE_PROVIDER = {
  provide: SelectedDateService,
  useClass: AbstractedSelectedDateService,
};
