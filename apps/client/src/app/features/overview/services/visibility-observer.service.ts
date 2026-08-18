import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, type Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { getTodayDateString } from '@lib/shared';

import { WeekFixturesStore, WeekStandingsStore } from '../stores';

import { DateNavigationService } from './date-navigation.service';
import { SelectedDateService } from './selected-date.service';

export abstract class VisibilityObserverService {
  abstract init(): void;
  abstract stop(): void;
}

@Injectable()
export class AbstractedVisibilityObserverService extends VisibilityObserverService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly dateNavigationService = inject(DateNavigationService);
  private readonly selectedDateService = inject(SelectedDateService);

  private readonly weekFixturesStore = inject(WeekFixturesStore);
  private readonly weekStandingsStore = inject(WeekStandingsStore);

  private subscription?: Subscription;

  public init(): void {
    if (this.subscription) this.stop();

    this.subscription = fromEvent(document, 'visibilitychange')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this.isDocumentVisibleAgain()),
        tap(() => this.reloadData())
      )
      .subscribe();
  }

  public stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }

  private reloadData(): void {
    this.reloadOverview();
    this.updateTodayIfNeeded();
  }

  private reloadOverview(): void {
    const isLoading =
      this.weekFixturesStore.isLoading() || this.weekStandingsStore.isLoading();

    const isRefreshing =
      this.weekFixturesStore.isRefreshing() ||
      this.weekStandingsStore.isRefreshing();

    if (isLoading || isRefreshing) return;

    const date = this.selectedDateService.selectedDay();

    this.weekFixturesStore.loadWeekFixtures(date, true);
    this.weekStandingsStore.loadWeekStandings(date, true);
  }

  private updateTodayIfNeeded(): void {
    const now = getTodayDateString();

    if (this.dateNavigationService.today() !== now) {
      this.dateNavigationService.resetToday();
    }
  }

  private isDocumentVisibleAgain(): boolean {
    return !document.hidden;
  }
}

export const VISIBILITY_OBSERVER_SERVICE_PROVIDER = {
  provide: VisibilityObserverService,
  useClass: AbstractedVisibilityObserverService,
};
