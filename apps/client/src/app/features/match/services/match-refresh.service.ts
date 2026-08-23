import { computed, inject, Injectable } from '@angular/core';

import { getFixtureStatusState, RefreshRegistryService } from '@app/shared';
import type { FixtureId } from '@lib/models';

import { MatchFacade } from '../match.facade';

@Injectable()
export class MatchRefreshService {
  private readonly refreshRegistry = inject(RefreshRegistryService);
  private readonly facade = inject(MatchFacade);

  private unregister?: () => void;

  private readonly isLive = computed(() => {
    const status = this.facade.fixture()?.data.fixture.status.short;

    return status ? getFixtureStatusState(status).isLive : false;
  });

  private readonly canRefresh = computed(
    () => !this.facade.isLoading() && !this.facade.isRefreshing()
  );

  init(fixtureId: FixtureId): void {
    this.destroy();

    this.unregister = this.refreshRegistry.register({
      id: `match:${fixtureId}`,
      isLive: this.isLive,
      canRefresh: this.canRefresh,
      refresh: () => this.facade.reloadFixture(),
    });
  }

  destroy(): void {
    this.unregister?.();
    this.unregister = undefined;
  }
}
