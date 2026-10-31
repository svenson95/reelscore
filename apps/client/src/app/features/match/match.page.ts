import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';

import type { CompetitionUrl, FixtureId } from '@reelscore-sdk/models';

import { SkeletonPreviewService } from '@app/core';
import { ReplayAnimationOnNavigationDirective } from '@app/shared';

import {
  MatchDetailsComponent,
  MatchHeaderComponent,
  PageHeaderComponent,
} from './components';
import {
  MatchRealtimeService,
  MatchRefreshService,
  SERVICE_PROVIDERS,
} from './data-access';
import { STORE_PROVIDERS } from './state';

import { MatchFacade } from './match.facade';

@Component({
  selector: 'div[rs-match-page]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    MatchHeaderComponent,
    MatchDetailsComponent,
    ReplayAnimationOnNavigationDirective,
  ],
  providers: [MatchFacade, ...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host {
      @apply gap-5;
    }
  `,
  template: `
    @if (error() && !data()) {
    <section class="page-error">
      <p class="no-data">Es ist ein Fehler aufgetreten.</p>
    </section>
    } @else { @if (error()) {
    <p class="page-error" role="status">
      Aktualisierung fehlgeschlagen. Die zuletzt geladenen Spieldaten bleiben
      sichtbar.
    </p>
    }
    <div
      rs-page-header
      class="animate-drop-from-top"
      rsReplayAnimationOnNavigation
    ></div>

    <section
      rs-match-header
      [fixtureId]="fixtureId()"
      [data]="forceSkeletons() ? null : data()"
      [highlights]="forceSkeletons() ? null : fixture()?.highlights ?? null"
    ></section>

    <section rs-match-details [forceLoading]="forceSkeletons()"></section>
    }
  `,
})
export class MatchPage {
  readonly fixtureId = input.required<FixtureId>();
  readonly competitionUrl = input.required<CompetitionUrl>();

  private readonly facade = inject(MatchFacade);
  private readonly refreshService = inject(MatchRefreshService);
  private readonly matchRealtimeService = inject(MatchRealtimeService);
  private readonly skeletonPreviewService = inject(SkeletonPreviewService);

  readonly fixture = this.facade.fixture;
  readonly data = this.facade.data;
  readonly error = this.facade.error;

  readonly forceSkeletons = this.skeletonPreviewService.showLoading;

  private readonly loadFixtureEffect = effect(() => {
    const fixtureId = this.fixtureId();
    const preloadedFixture = window.history.state?.preloadedFixture;
    const navigationEntries =
      window.performance.getEntriesByType?.('navigation');
    const isPageReload = (navigationEntries ?? []).some(
      (entry) => (entry as PerformanceNavigationTiming).type === 'reload'
    );

    const preloadedFixtureId = preloadedFixture?.fixture?.id;
    const hasMatchingPreloadedFixture =
      preloadedFixtureId != null &&
      String(preloadedFixtureId) === String(fixtureId);

    if (!isPageReload && hasMatchingPreloadedFixture) {
      this.facade.loadFixtureFromList(preloadedFixture);
      return;
    }

    void this.facade.loadFixture(fixtureId);
  });

  private readonly liveUpdatesEffect = effect((onCleanup) => {
    const fixtureId = this.fixtureId();

    this.refreshService.init(fixtureId);

    const unregisterRealtime = this.matchRealtimeService.register(fixtureId);

    onCleanup(() => {
      this.refreshService.destroy();
      unregisterRealtime();
    });
  });

  private readonly invalidUrlEffect = effect(() => {
    this.facade.handleInvalidUrl(this.competitionUrl());
  });
}
