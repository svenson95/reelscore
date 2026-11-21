import { DestroyRef, inject, Injectable, signal } from '@angular/core';

import type { Subscription } from 'rxjs';

import type { FixtureId, MatchLineupsResult } from '@reelscore-sdk/models';

import { HttpFixtureLineupsService } from '../data-access';

@Injectable()
export class FixtureLineupsStore {
  private readonly service = inject(HttpFixtureLineupsService);
  private currentFixtureId: FixtureId | null = null;
  private request?: Subscription;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cancel());
  }

  readonly data = signal<MatchLineupsResult | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  loadLineups(fixtureId: FixtureId): void {
    this.cancel();

    if (fixtureId !== this.currentFixtureId) {
      this.currentFixtureId = fixtureId;
      this.data.set(null);
    }

    this.loading.set(true);
    this.error.set(false);
    this.request = this.service.getLineups(fixtureId).subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  reset(): void {
    this.cancel();
    this.currentFixtureId = null;
    this.data.set(null);
    this.loading.set(false);
    this.error.set(false);
  }

  cancel(): void {
    this.request?.unsubscribe();
    this.request = undefined;
  }
}
