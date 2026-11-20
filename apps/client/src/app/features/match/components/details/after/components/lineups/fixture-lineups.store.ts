import { inject, Injectable, signal } from '@angular/core';

import type { Subscription } from 'rxjs';

import type { FixtureId, MatchLineupsResult } from '@reelscore-sdk/models';

import { FixtureLineupsService } from './fixture-lineups.service';

@Injectable()
export class FixtureLineupsStore {
  private readonly service = inject(FixtureLineupsService);
  private currentFixtureId: FixtureId | null = null;
  private request?: Subscription;

  readonly data = signal<MatchLineupsResult | null>(null);
  readonly loading = signal(false);
  readonly error = signal(false);

  load(fixtureId: FixtureId): void {
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

  cancel(): void {
    this.request?.unsubscribe();
    this.request = undefined;
  }
}
