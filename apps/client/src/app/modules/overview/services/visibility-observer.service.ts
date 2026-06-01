import { DestroyRef, inject, Injectable, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import moment from 'moment';

import { WeekdayFixturesStore, WeekdayStandingsStore } from '../store';

import { DateService } from './date.service';
import { SelectedDateService } from './selected-date.service';

export abstract class VisibilityObserverService {
  abstract init(): void;
}

@Injectable()
export class AbstractedVisibilityObserverService extends VisibilityObserverService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly dateService = inject(DateService);
  private readonly selectedDateService = inject(SelectedDateService);

  private readonly weekFixturesStore = inject(WeekdayFixturesStore);
  private readonly weekStandingsStore = inject(WeekdayStandingsStore);

  public init(): void {
    fromEvent(document, 'visibilitychange')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this.isDocumentVisibleAgain()),
        tap(() => this.reloadData())
      )
      .subscribe();
  }

  private reloadData(): void {
    this.reloadOverview();
    this.updateTodayIfNeeded();
  }

  private reloadOverview(): void {
    const isLoading =
      this.weekFixturesStore.isLoading() || this.weekStandingsStore.isLoading();
    if (isLoading) return;

    const date = untracked(this.selectedDateService.selectedDay);

    this.weekFixturesStore.loadWeekdayFixtures(date, true);
    this.weekStandingsStore.loadWeekdayStandings(date, true);
  }

  private updateTodayIfNeeded(): void {
    const now = moment().tz('Europe/Berlin').format('YYYY-MM-DD');

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
