import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { getWeekdayIndex, PageRefreshService } from '@app/shared';

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
export class OverviewComponent extends RouterView implements OnInit, OnDestroy {
  private readonly weekFixturesStore = inject(WeekdayFixturesStore);
  private readonly weekStandingsStore = inject(WeekdayStandingsStore);

  private readonly selectedDateService = inject(SelectedDateService);
  private readonly pageRefreshService = inject(PageRefreshService);
  private readonly visibilityObserverService = inject(
    VisibilityObserverService
  );

  private readonly hasPlayingFixtures = computed<boolean>(() => {
    const weekIndex = getWeekdayIndex(this.selectedDateService.selectedDay());
    const fixtures = this.weekFixturesStore.weekFixtures()[weekIndex];
    const states = fixtures.map((f) => f.fixture.status.short);
    return this.pageRefreshService.hasPlayingState(states);
  });

  ngOnInit(): void {
    this.visibilityObserverService.init();

    if (this.hasPlayingFixtures()) {
      this.pageRefreshService.init({
        isPlaying: this.hasPlayingFixtures(),
        canRefresh: () => this.canRefresh(),
        refresh: () => this.refresh(),
      });
    }
  }

  ngOnDestroy(): void {
    this.visibilityObserverService.stop();
    this.pageRefreshService.stop();
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
}
