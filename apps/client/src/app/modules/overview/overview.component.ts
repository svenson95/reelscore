import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  untracked,
} from '@angular/core';

import { PageRefreshService } from '@app/shared';

import { RouterView } from '../router-view';
import {
  STORE_PROVIDERS,
  WeekdayFixturesStore,
  WeekdayStandingsStore,
} from './store';

import { DateBarComponent, OverviewContentComponent } from './components';
import {
  SelectedDateService,
  SERVICE_PROVIDERS,
  VisibilityObserverService,
} from './services';

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
export class OverviewComponent extends RouterView implements OnInit {
  private readonly weekFixturesStore = inject(WeekdayFixturesStore);
  private readonly weekStandingsStore = inject(WeekdayStandingsStore);

  private readonly selectedDateService = inject(SelectedDateService);
  private readonly pageRefreshService = inject(PageRefreshService);
  private readonly visibilityObserverService = inject(
    VisibilityObserverService
  );

  ngOnInit(): void {
    this.visibilityObserverService.init();
    this.pageRefreshService.init({
      canRefresh: () => this.isNotLoading(),
      refresh: () => this.reloadData(),
    });
  }

  private reloadData(): void {
    const date = untracked(this.selectedDateService.selectedDay);
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
