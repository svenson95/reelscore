import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';

import {
  LeagueService,
  TabNavigationComponent,
  type TabNavigationItem,
  TabPanelDirective,
  TabViewComponent,
} from '@app/shared';

import {
  CompetitionStandingsComponent,
  LastFixturesComponent,
  NextFixturesComponent,
  PageHeaderComponent,
  PlayerStatsComponent,
} from './components';
import { SERVICE_PROVIDERS } from './data-access';
import {
  CompetitionRouteContext,
  CompetitionStandingsStore,
  LastFixturesStore,
  NextFixturesStore,
  STORE_PROVIDERS,
  TopAssistsStore,
  TopScorersStore,
} from './state';

@Component({
  selector: 'div[rs-competition-page]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TabNavigationComponent,
    TabPanelDirective,
    TabViewComponent,
    CompetitionStandingsComponent,
    LastFixturesComponent,
    NextFixturesComponent,
    PageHeaderComponent,
    PlayerStatsComponent,
  ],
  providers: [...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host {
      @apply min-h-[70vh];
    }

    .competition-tabs {
      @apply mb-[1.25rem];
    }
  `,
  template: `
    <div rs-page-header></div>

    <section class="competition-data" data-testid="competition-page">
      <rs-tab-navigation
        class="competition-tabs"
        [ariaLabel]="'Wettbewerbsnavigation'"
        [tabs]="tabNavigationItems"
        [selectedIndex]="selectedTabIndex()"
        (selectedIndexChange)="selectedTabIndex.set($event)"
      />

      <rs-tab-view
        [tabs]="tabNavigationItems"
        [(selectedIndex)]="selectedTabIndex"
      >
        <ng-template rsTabPanel>
          <rs-competition-last-fixtures />
        </ng-template>

        <ng-template rsTabPanel>
          <rs-competition-next-fixtures />
        </ng-template>

        <ng-template rsTabPanel>
          <rs-competition-standings />
        </ng-template>

        <ng-template rsTabPanel>
          <rs-competition-player-stats />
        </ng-template>
      </rs-tab-view>
    </section>
  `,
})
export class CompetitionPage extends CompetitionRouteContext {
  private readonly leagueService = inject(LeagueService);

  private readonly lastFixturesStore = inject(LastFixturesStore);
  private readonly nextFixturesStore = inject(NextFixturesStore);
  private readonly standingsStore = inject(CompetitionStandingsStore);
  private readonly topScorersStore = inject(TopScorersStore);
  private readonly topAssistsStore = inject(TopAssistsStore);

  protected readonly tabNavigationItems: readonly TabNavigationItem[] = [
    { label: 'Ergebnisse', icon: 'playlist_add_check' },
    { label: 'Spielplan', icon: 'playlist_play' },
    { label: 'Tabellen', icon: 'format_list_numbered' },
    { label: 'Spieler-Statistiken', icon: 'format_list_numbered_rtl' },
  ];

  protected readonly selectedTabIndex = signal<number>(0);

  private readonly leagueEffect = effect(() => {
    const competition = this.leagueService.selectedLeague();

    if (!competition) return;

    this.lastFixturesStore.loadLastFixtures(competition.id);
    this.nextFixturesStore.loadNextFixtures(competition.id);
    this.standingsStore.loadStandings(competition.id, new Date().toISOString());
    this.topScorersStore.loadTopScorers(competition.id);
    this.topAssistsStore.loadTopAssists(competition.id);
  });
}
