import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, type Subscription, tap } from 'rxjs';

import { LiveRefreshService } from './live-refresh.service';

@Injectable({ providedIn: 'root' })
export class VisibilityObserverService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly liveRefreshService = inject(LiveRefreshService);

  private subscription?: Subscription;

  init(): void {
    if (this.subscription) {
      return;
    }

    this.subscription = fromEvent(document, 'visibilitychange')
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter(() => !document.hidden),
        tap(() => void this.liveRefreshService.refresh({ force: true }))
      )
      .subscribe();
  }

  stop(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
}
