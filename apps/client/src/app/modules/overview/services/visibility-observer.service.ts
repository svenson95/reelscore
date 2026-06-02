import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { getTodayDateString } from '@app/shared';

import { WeekdayFixturesStore, WeekdayStandingsStore } from '../store';

import { DateService } from './date.service';
import { SelectedDateService } from './selected-date.service';

export abstract class VisibilityObserverService {
  abstract init(): void;
  abstract stop(): void;
}

@Injectable()
export class AbstractedVisibilityObserverService extends VisibilityObserverService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly dateService = inject(DateService);
  private readonly selectedDateService = inject(SelectedDateService);

  private readonly weekFixturesStore = inject(WeekdayFixturesStore);
  private readonly weekStandingsStore = inject(WeekdayStandingsStore);

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

    this.weekFixturesStore.loadWeekdayFixtures(date, true);
    this.weekStandingsStore.loadWeekdayStandings(date, true);
  }

  private updateTodayIfNeeded(): void {
    const now = getTodayDateString();

    if (this.dateService.today() !== now) {
      this.dateService.resetToday();
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
