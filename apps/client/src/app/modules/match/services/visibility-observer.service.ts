import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { FixtureStore } from '../../match/store';

export abstract class VisibilityObserverService {
  abstract init(): void;
  abstract stop(): void;
}

@Injectable()
export class AbstractedVisibilityObserverService extends VisibilityObserverService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly fixtureStore = inject(FixtureStore);

  private subscription?: Subscription;

  public init(): void {
    this.stop();

    this.subscription = fromEvent(document, 'visibilitychange')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this.isDocumentVisibleAgain()),
        tap(() => this.reloadMatch())
      )
      .subscribe();
  }

  public stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }

  private reloadMatch(): void {
    const isRefreshing = this.fixtureStore.isRefreshing();

    if (isRefreshing) return;

    this.fixtureStore.reloadFixture();
  }

  private isDocumentVisibleAgain(): boolean {
    return !document.hidden;
  }
}

export const VISIBILITY_OBSERVER_SERVICE_PROVIDER = {
  provide: VisibilityObserverService,
  useClass: AbstractedVisibilityObserverService,
};
