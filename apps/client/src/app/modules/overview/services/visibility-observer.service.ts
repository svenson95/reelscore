import { inject, Injectable, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { WeekdayFixturesStore, WeekdayStandingsStore } from '../store';

import { DateService } from './date.service';

abstract class VisibilityObserverService {
  abstract init(): void;
}

@Injectable()
export class AbstractedVisibilityObserverService {
  private router = inject(Router);
  private dateService = inject(DateService);
  private weekFixturesStore = inject(WeekdayFixturesStore);
  private weekStandingsStore = inject(WeekdayStandingsStore);

  public init(): void {
    const isBackAgain = !document.hidden;
    const overviewRoute = /^\/\d{4}-\d{2}-\d{2}$/.test(this.router.url);
    const isNotLoading =
      !this.weekFixturesStore.isLoading() &&
      !this.weekStandingsStore.isLoading();
    fromEvent(document, 'visibilitychange')
      .pipe(
        takeUntilDestroyed(),
        filter(() => isBackAgain),
        filter(() => overviewRoute),
        filter(() => isNotLoading),
        tap(() => {
          const date = untracked(this.dateService.selectedDay).split('T')[0];
          console.log('test', date);
          this.weekFixturesStore.loadWeekdayFixtures(date, true);
          this.weekStandingsStore.loadWeekdayStandings(date, true);
        })
      )
      .subscribe();
  }
}

export const VISIBILITY_OBSERVER_SERVICE_PROVIDER = {
  provide: VisibilityObserverService,
  useClass: AbstractedVisibilityObserverService,
};
