import { DestroyRef, inject, Injectable, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';
import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { WeekdayFixturesStore, WeekdayStandingsStore } from '../store';

import { DateService } from './date.service';
import { SelectedDateService } from './selected-date.service';

export abstract class VisibilityObserverService {
  abstract init(): void;
}

@Injectable()
export class AbstractedVisibilityObserverService {
  private destroyRef = inject(DestroyRef);

  private dateService = inject(DateService);
  private selectedDateService = inject(SelectedDateService);
  private weekFixturesStore = inject(WeekdayFixturesStore);
  private weekStandingsStore = inject(WeekdayStandingsStore);

  public init(): void {
    fromEvent(document, 'visibilitychange')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this.isDocumentVisibleAgain()),
        filter((event) => this.isOverviewRoute(event)),
        tap(() => this.reloadData())
      )
      .subscribe();
  }

  private reloadData(): void {
    if (this.isNotLoading()) {
      const date = untracked(this.selectedDateService.selectedDay);
      this.weekFixturesStore.loadWeekdayFixtures(date, true);
      this.weekStandingsStore.loadWeekdayStandings(date, true);
    }

    const now = moment().tz('Europe/Berlin').format('YYYY-MM-DD');
    if (this.dateService.today() !== now) {
      this.dateService.resetToday();
    }
  }

  private isDocumentVisibleAgain(): boolean {
    return !document.hidden;
  }

  private isOverviewRoute(event: Event): boolean {
    const target = event.target as Document;
    const URL = target.URL;
    const baseURI = target.baseURI;
    const url = URL.substring(baseURI.length, URL.length);
    return /^\d{4}-\d{2}-\d{2}$/.test(url);
  }

  private isNotLoading(): boolean {
    return (
      !this.weekFixturesStore.isLoading() &&
      !this.weekStandingsStore.isLoading()
    );
  }
}

export const VISIBILITY_OBSERVER_SERVICE_PROVIDER = {
  provide: VisibilityObserverService,
  useClass: AbstractedVisibilityObserverService,
};
