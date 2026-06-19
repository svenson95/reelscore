import { ApplicationRef, DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { VersionReadyEvent } from '@angular/service-worker';
import { SwUpdate } from '@angular/service-worker';
import { filter, first, interval, switchMap } from 'rxjs';

const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour

export abstract class AppUpdateService {
  abstract init: () => void;
}

@Injectable()
export class AbstractedAppUpdateService implements AppUpdateService {
  private readonly appRef = inject(ApplicationRef);
  private readonly swUpdate = inject(SwUpdate);
  private readonly destroyRef = inject(DestroyRef);

  init(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.reloadWhenUpdateIsReady();
    this.checkForUpdatesAfterAppIsStable();
    this.reloadWhenUnrecoverable();
  }

  private reloadWhenUpdateIsReady(): void {
    this.swUpdate.versionUpdates
      .pipe(
        filter(
          (event): event is VersionReadyEvent => event.type === 'VERSION_READY'
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        document.location.reload();
      });
  }

  private checkForUpdatesAfterAppIsStable(): void {
    this.appRef.isStable
      .pipe(
        first(Boolean),
        switchMap(() => interval(UPDATE_CHECK_INTERVAL)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        void this.swUpdate.checkForUpdate();
      });

    this.appRef.isStable
      .pipe(first(Boolean), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.swUpdate.checkForUpdate();
      });
  }

  private reloadWhenUnrecoverable(): void {
    this.swUpdate.unrecoverable
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        document.location.reload();
      });
  }
}

export const APP_UPDATE_SERVICE_PROVIDER = {
  provide: AppUpdateService,
  useClass: AbstractedAppUpdateService,
};
