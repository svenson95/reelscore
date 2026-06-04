import type { OnDestroy, OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';

import { PageRefreshService } from '@app/shared';
import { getWeekdayIndex } from '@lib/shared';

import type { RouteReuseLifecycle } from '../../config';
import { RouterView } from '../router-view';

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
  `,
  template: `
    <nav
      aria-label="Date-Bar Navigation"
      rs-date-bar
      class="animate-drop-from-top"
    ></nav>
    <section class="overview-content" rs-overview-content></section>
  `,
})
export class OverviewComponent
  extends RouterView
  implements OnInit, OnDestroy, RouteReuseLifecycle
{
  private readonly weekFixturesStore = inject(WeekdayFixturesStore);
  private readonly weekStandingsStore = inject(WeekdayStandingsStore);

  private readonly selectedDateService = inject(SelectedDateService);
  private readonly pageRefreshService = inject(PageRefreshService);
  private readonly visibilityObserverService = inject(
    VisibilityObserverService
  );

  private isActive = false;

  private readonly hasPlayingFixtures = computed<boolean>(() => {
    const weekIndex = getWeekdayIndex(this.selectedDateService.selectedDay());
    const fixtures = this.weekFixturesStore.weekFixtures()[weekIndex] ?? [];
    const states = fixtures.map((fixture) => fixture.fixture.status.short);
    return this.pageRefreshService.hasPlayingState(states);
  });

  pageRefreshEffect = effect(() => {
    this.hasPlayingFixtures()
      ? this.startPageRefreshService()
      : this.pageRefreshService.stop();
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

  private canRefresh(): boolean {
    return this.isNotLoading();
  }

  private refresh(): void {
    const date = this.selectedDateService.selectedDay();
    this.weekFixturesStore.loadWeekdayFixtures(date, true);
    this.weekStandingsStore.loadWeekdayStandings(date, true);
  }

  private isNotLoading(): boolean {
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
    if (this.isActive) return;
    this.isActive = true;

    this.visibilityObserverService.init();
    this.startPageRefreshService();
  }

  private stopServices(): void {
    if (!this.isActive) return;
    this.isActive = false;

    this.visibilityObserverService.stop();
    this.pageRefreshService.stop();
  }
}
