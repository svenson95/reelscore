import type { OnDestroy, OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';

import { PageRefreshService } from '@app/shared';
import { type CompetitionUrl, type FixtureId } from '@lib/models';

import { RouterView } from '../router-view';

import {
  MatchDetailsComponent,
  MatchHeaderComponent,
  PageHeaderComponent,
} from './components';
import { MatchFacade } from './match.facade';
import { SERVICE_PROVIDERS, VisibilityObserverService } from './services';
import { STORE_PROVIDERS } from './store';

@Component({
  selector: 'rs-match-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, MatchHeaderComponent, MatchDetailsComponent],
  providers: [MatchFacade, ...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { @apply gap-5; }
    :host ::ng-deep h2 { text-align: center; }
  `,
  template: `
    @if (error()) {
    <section class="page-error">
      <p class="no-data">Es ist ein Fehler aufgetreten.</p>
    </section>
    } @else {
    <nav
      aria-label="Page-Header Navigation"
      rs-page-header
      class="animate-drop-from-top"
    ></nav>

    <section
      rs-match-header
      [data]="data()"
      [highlights]="fixture()?.highlights ?? null"
    ></section>

    <section rs-match-details></section>
    }
  `,
})
export class MatchComponent extends RouterView implements OnInit, OnDestroy {
  readonly fixtureId = input.required<FixtureId>();
  readonly competitionUrl = input.required<CompetitionUrl>();

  private readonly pageRefreshService = inject(PageRefreshService);
  private readonly visibilityObserverService = inject(
    VisibilityObserverService
  );

  private readonly facade = inject(MatchFacade);
  readonly fixture = this.facade.fixture;
  readonly data = this.facade.data;
  readonly error = this.facade.error;

  private isActive = false;

  private readonly hasPlayingFixtures = computed<boolean>(() => {
    const status = this.fixture()?.data.fixture.status.short;
    if (!status) return false;
    return this.pageRefreshService.hasPlayingState([status]);
  });

  pageRefreshEffect = effect(() => {
    this.hasPlayingFixtures()
      ? this.startPageRefreshService()
      : this.pageRefreshService.stop();
  });

  loadFixtureEffect = effect(() => {
    const fixtureId = this.fixtureId();
    this.facade.loadFixture(fixtureId);
  });

  invalidUrlEffect = effect(() =>
    this.facade.handleInvalidUrl(this.competitionUrl())
  );

  ngOnInit(): void {
    this.startPageServices();
  }

  ngOnDestroy(): void {
    this.stopPageServices();
  }

  private canRefresh(): boolean {
    return !this.facade.isLoading();
  }

  private refresh(): void {
    this.facade.reloadFixture();
  }

  private startPageRefreshService(): void {
    this.pageRefreshService.init({
      isPlaying: () => this.hasPlayingFixtures(),
      canRefresh: () => this.canRefresh(),
      refresh: () => this.refresh(),
    });
  }

  private startPageServices(): void {
    if (this.isActive) return;
    this.isActive = true;

    this.visibilityObserverService.init();
    this.startPageRefreshService();
  }

  private stopPageServices(): void {
    if (!this.isActive) return;
    this.isActive = false;

    this.visibilityObserverService.stop();
    this.pageRefreshService.stop();
  }
}
