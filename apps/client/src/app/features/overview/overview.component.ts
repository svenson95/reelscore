import {
  type OnDestroy,
  type OnInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { PAGE_REFRESH_SERVICE_PROVIDER, PageRefreshService } from '@app/shared';

import type { RouteReuseLifecycle } from '../../config';

import { DateBarComponent, OverviewContentComponent } from './components';
import { getSelectedDayData } from './helpers';
import {
  SelectedDateService,
  SERVICE_PROVIDERS,
  VisibilityObserverService,
} from './services';
import { WeekFixturesStore, WeekStandingsStore } from './stores';

@Component({
  selector: 'rs-overview-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DateBarComponent, OverviewContentComponent],
  providers: [...SERVICE_PROVIDERS, PAGE_REFRESH_SERVICE_PROVIDER],
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
  implements OnInit, OnDestroy, RouteReuseLifecycle
{
  private readonly weekFixturesStore = inject(WeekFixturesStore);
  private readonly weekStandingsStore = inject(WeekStandingsStore);

  private readonly selectedDateService = inject(SelectedDateService);
  private readonly pageRefreshService = inject(PageRefreshService);
  private readonly visibilityObserverService = inject(
    VisibilityObserverService
  );

  private readonly hasPlayingFixtures = computed(() => {
    const fixtures =
      getSelectedDayData(
        this.weekFixturesStore.weekFixtures(),
        this.weekFixturesStore.weekKey(),
        this.selectedDateService.selectedDay()
      ) ?? [];

    return this.pageRefreshService.hasPlayingState(
      fixtures.map((fixture) => fixture.fixture.status.short)
    );
  });

  private readonly canRefresh = computed(() => {
    return (
      !this.weekFixturesStore.isPending() &&
      !this.weekStandingsStore.isPending()
    );
  });

  ngOnInit(): void {
    this.startServices();
  }

  ngOnDestroy(): void {
    this.stopServices();
  }

  onRouteDetach(): void {
    this.pauseServices();
  }

  onRouteAttach(): void {
    this.startServices();
  }

  private startServices(): void {
    this.visibilityObserverService.init();

    this.pageRefreshService.init({
      isPlaying: this.hasPlayingFixtures,
      canRefresh: this.canRefresh,
      refresh: () => this.refresh(),
    });
  }

  private pauseServices(): void {
    this.visibilityObserverService.stop();
    this.pageRefreshService.pause();
  }

  private stopServices(): void {
    this.visibilityObserverService.stop();
    this.pageRefreshService.stop();
  }

  private refresh(): void {
    const date = this.selectedDateService.selectedDay();

    this.weekFixturesStore.loadWeekFixtures(date, true);
    this.weekStandingsStore.loadWeekStandings(date, true);
  }
}
