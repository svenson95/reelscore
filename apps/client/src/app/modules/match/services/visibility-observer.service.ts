import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { FixtureStore } from '../../match/store';

export abstract class VisibilityObserverService {
  abstract init(): void;
}

@Injectable()
export class AbstractedVisibilityObserverService extends VisibilityObserverService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly fixtureStore = inject(FixtureStore);

  public init(): void {
    fromEvent(document, 'visibilitychange')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => this.isDocumentVisibleAgain()),
        tap(() => this.reloadMatch())
      )
      .subscribe();
  }

  private reloadMatch(): void {
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
