import type { OnDestroy, OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';

import { PageRefreshService } from '@app/shared';
import { getWeekdayIndex } from '@lib/shared';

import type { RouteReuseLifecycle } from '../../config';
import { RouteCompetitionContext } from '../route-competition-context';

import { DateBarComponent, OverviewContentComponent } from './components';
import {
  SelectedDateService,
  SERVICE_PROVIDERS,
  VisibilityObserverService,
} from './services';
import {
  STORE_PROVIDERS,
  WeekdayFixturesStore,
  WeekdayStandingsStore,
} from './store';

@Component({
  selector: 'rs-overview-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateBarComponent, OverviewContentComponent],
  providers: [...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host ::ng-deep h2 { margin-left: 1rem; }
    :host { @apply min-h-[70vh]; }
  `,
  template: `
    <nav
      aria-label="Date-Bar Navigation"
      rs-date-bar
      class="animate-drop-from-top"
    ></nav>
    <section rs-overview-content data-testid="overview-page"></section>
  `,
})
export class OverviewComponent
  extends RouteCompetitionContext
  implements OnInit, OnDestroy, RouteReuseLifecycle
{
  private readonly weekFixturesStore = inject(WeekdayFixturesStore);
  private readonly weekStandingsStore = inject(WeekdayStandingsStore);

  private readonly selectedDateService = inject(SelectedDateService);
  private readonly pageRefreshService = inject(PageRefreshService);
  private readonly visibilityObserverService = inject(
    VisibilityObserverService
  );

  private readonly isActive = signal<boolean>(false);

  private readonly hasPlayingFixtures = computed(() => {
    const weekIndex = getWeekdayIndex(this.selectedDateService.selectedDay());

    const fixtures = this.weekFixturesStore.weekFixtures()[weekIndex] ?? [];

    return this.pageRefreshService.hasPlayingState(
      fixtures.map((fixture) => fixture.fixture.status.short)
    );
  });

  private readonly pageRefreshEffect = effect(() => {
    if (!this.isActive() || !this.hasPlayingFixtures()) {
      this.pageRefreshService.stop();
      return;
    }

    this.startPageRefreshService();
  });

  ngOnInit(): void {
    this.startServices();
  }

  ngOnDestroy(): void {
    this.stopServices();
  }

  onRouteDetach(): void {
    this.stopServices();
  }

  onRouteAttach(): void {
    this.startServices();
  }

  private async refresh(): Promise<void> {
    const date = this.selectedDateService.selectedDay();

    this.weekFixturesStore.loadWeekdayFixtures(date, true);
    this.weekStandingsStore.loadWeekdayStandings(date, true);
  }

  private canRefresh(): boolean {
    return (
      !this.weekFixturesStore.isLoading() &&
      !this.weekStandingsStore.isLoading()
    );
  }

  private startPageRefreshService(): void {
    this.pageRefreshService.init({
      isPlaying: () => this.hasPlayingFixtures(),
      canRefresh: () => this.canRefresh(),
      refresh: () => this.refresh(),
    });
  }

  private startServices(): void {
    if (this.isActive()) return;

    this.isActive.set(true);
    this.visibilityObserverService.init();
  }

  private stopServices(): void {
    if (!this.isActive()) return;

    this.isActive.set(false);
    this.visibilityObserverService.stop();
    this.pageRefreshService.stop();
  }
}
