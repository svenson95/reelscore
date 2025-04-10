import { DestroyRef, inject, Injectable, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { WeekdayFixturesStore, WeekdayStandingsStore } from '../store';

import { DateService } from './date.service';

export abstract class VisibilityObserverService {
  abstract init(): void;
}

@Injectable()
export class AbstractedVisibilityObserverService {
  private destroyRef = inject(DestroyRef);

  private dateService = inject(DateService);
  private weekFixturesStore = inject(WeekdayFixturesStore);
  private weekStandingsStore = inject(WeekdayStandingsStore);

  public init(): void {
    fromEvent(document, 'visibilitychange')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => !document.hidden),
        filter((event) => this.isOverviewRoute(event)),
        filter(() => this.isNotLoading()),
        tap(() => this.reloadFixturesAndStandings())
      )
      .subscribe();
  }

  private reloadFixturesAndStandings(): void {
    const date = untracked(this.dateService.selectedDay).split('T')[0];
    this.weekFixturesStore.loadWeekdayFixtures(date, true);
    this.weekStandingsStore.loadWeekdayStandings(date, true);
    // TODO reset TODAY value
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
