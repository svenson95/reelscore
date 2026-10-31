import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';

import type { TabNavigationItem } from '@app/shared';
import {
  PageTitleComponent,
  ReplayAnimationOnNavigationDirective,
  TabNavigationComponent,
  TabPanelDirective,
  TabViewComponent,
} from '@app/shared';

import {
  MatchEventsComponent,
  MatchStatisticsComponent,
} from './after/components';
import {
  MatchFixtureAnalysesComponent,
  MatchFixtureDataComponent,
  MatchFixtureStandingsComponent,
  MatchHeadToHeadComponent,
  MatchLatestFixturesComponent,
  MatchTeamCoachesComponent,
} from './base/components';

import { MatchDetailsFacade } from './details.facade';

@Component({
  selector: 'section[rs-match-details]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TabNavigationComponent,
    TabPanelDirective,
    TabViewComponent,
    PageTitleComponent,
    ReplayAnimationOnNavigationDirective,
    MatchFixtureDataComponent,
    MatchFixtureStandingsComponent,
    MatchLatestFixturesComponent,
    MatchHeadToHeadComponent,
    MatchTeamCoachesComponent,
    MatchFixtureAnalysesComponent,
    MatchEventsComponent,
    MatchStatisticsComponent,
  ],
  providers: [MatchDetailsFacade],
  styles: `
    :host {
      @apply max-w-rs-max-width w-full flex flex-col gap-5 mx-auto;

      .detail-sections {
        @apply flex flex-col gap-6 sm:gap-8;
      }

      .state-skeleton {
        @apply mx-3 mt-rs1 mb-3 rounded-border2 bg-rs-button-bg p-rs2 shadow-rs;
      }

      .state-skeleton-row {
        @apply flex min-h-9 items-center justify-between gap-4 border-b py-2 last:border-b-0;
      }
    }
  `,
  template: `
    <rs-tab-navigation
      class="animate-fade-in"
      rsReplayAnimationOnNavigation
      [ariaLabel]="'Spielnavigation'"
      [tabs]="tabNavigationItems()"
      [selectedIndex]="selectedTabIndex()"
      (selectedIndexChange)="selectedTabIndex.set($event)"
    />

    <rs-tab-view
      [tabs]="tabNavigationItems()"
      [(selectedIndex)]="selectedTabIndex"
    >
      <ng-template rsTabPanel
        ><div class="detail-sections">
          <rs-match-fixture-data
            [fixture]="fixtureData()"
            [isLoading]="detailsLoading()"
          />
          <rs-match-team-coaches
            [fixture]="fixtureData()"
            [coaches]="teamCoaches()"
            [isLoading]="teamCoachesLoading()"
            [error]="teamCoachesError()"
          />

          @if (showStandings()) {
          <rs-match-fixture-standings
            [standings]="standings()"
            [isLoading]="isLoadingStandings()"
            [homeTeamId]="fixtureData()?.teams?.home?.id ?? null"
            [awayTeamId]="fixtureData()?.teams?.away?.id ?? null"
            [error]="standingsError()"
            [groupCompetition]="hasMultipleGroups()"
            [competitionName]="fixtureData()?.league?.name ?? null"
            [competitionId]="fixtureData()?.league?.id ?? null"
          />
          }

          <rs-match-latest-fixtures
            data-testid="match-latest-fixtures"
            [data]="fixtureData()"
            [latestFixtures]="latestFixtures()"
            [isLoading]="latestFixturesLoading()"
            [error]="latestFixturesError()"
          />

          <rs-match-head-to-head
            [fixture]="fixtureData()"
            [fixtures]="headToHeadFixtures()"
            [isLoading]="headToHeadFixturesLoading()"
            [error]="headToHeadFixturesError()"
          /></div
      ></ng-template>

      <ng-template rsTabPanel>
        <rs-match-fixture-analyses
          [isLoading]="analysesLoading()"
          [error]="analysesError() ?? latestFixturesError()"
        />
      </ng-template>

      <ng-template rsTabPanel>
        <rs-page-title title="Spielbericht" />

        @if (events(); as matchEvents) { @if (!eventsLoading()) {
        <rs-match-events [data]="matchEvents" />
        } } @else if (eventsLoading()) {
        <div
          class="state-skeleton"
          aria-label="Spielbericht wird geladen"
          aria-busy="true"
        >
          @for (row of [0, 1, 2, 3, 4, 5]; track row) {
          <div class="state-skeleton-row" aria-hidden="true">
            <span class="rs-skeleton h-3 w-1/4"></span>
            <span class="rs-skeleton h-3 w-8"></span>
            <span class="rs-skeleton h-3 w-1/4"></span>
          </div>
          }
        </div>
        } @else if (eventsError()) {
        <p class="no-data" role="status">Fehler beim Laden des Spielberichts</p>
        } @else {
        <p class="no-data">Kein Spielbericht verfügbar</p>
        }
      </ng-template>

      <ng-template rsTabPanel>
        <rs-page-title title="Statistiken" />

        @if (statistics(); as matchStatistics) { @if (!statisticsLoading()) {
        <rs-match-statistics [data]="matchStatistics" />
        } } @else if (statisticsLoading()) {
        <div
          class="state-skeleton"
          aria-label="Statistiken werden geladen"
          aria-busy="true"
        >
          @for (row of [0, 1, 2, 3, 4]; track row) {
          <div class="state-skeleton-row" aria-hidden="true">
            <span class="rs-skeleton h-3 w-1/3"></span>
            <span class="rs-skeleton h-3 w-1/4"></span>
            <span class="rs-skeleton h-3 w-1/4"></span>
          </div>
          }
        </div>
        } @else if (statisticsError()) {
        <p class="no-data" role="status">Fehler beim Laden der Statistiken</p>
        } @else {
        <p class="no-data">Keine Statistiken verfügbar</p>
        }
      </ng-template>
    </rs-tab-view>
  `,
})
export class MatchDetailsComponent {
  readonly forceLoading = input<boolean>(false);

  private readonly facade = inject(MatchDetailsFacade);

  readonly standings = this.facade.standings;
  readonly analyses = this.facade.analyses;
  readonly events = this.facade.events;
  readonly statistics = this.facade.statistics;
  readonly teamCoaches = this.facade.teamCoaches;
  readonly teamCoachesError = this.facade.teamCoachesError;
  readonly latestFixtures = this.facade.latestFixtures;
  readonly headToHeadFixtures = this.facade.headToHeadFixtures;
  readonly headToHeadFixturesError = this.facade.headToHeadFixturesError;
  readonly standingsError = this.facade.standingsError;
  readonly latestFixturesError = this.facade.latestFixturesError;
  readonly analysesError = this.facade.analysesError;
  readonly eventsError = this.facade.eventsError;
  readonly statisticsError = this.facade.statisticsError;
  readonly hasMultipleGroups = this.facade.hasMultipleGroups;

  protected readonly selectedTabIndex = signal<number>(0);
  protected readonly tabNavigationItems = computed<TabNavigationItem[]>(() => [
    { label: 'Details', icon: 'info' },
    {
      label: 'Analysen',
      icon: 'pageview',
      disabled: !this.availableTabs()[1],
    },
    {
      label: 'Spielbericht',
      icon: 'article',
      disabled: !this.availableTabs()[2],
    },
    {
      label: 'Statistiken',
      icon: 'assessment',
      disabled: !this.availableTabs()[3],
    },
  ]);

  readonly teamCoachesLoading = computed<boolean>(
    () => this.detailsLoading() || this.facade.teamCoachesLoading()
  );

  protected readonly fixtureData = computed(
    () => this.facade.fixture()?.data ?? null
  );

  readonly detailsLoading = computed<boolean>(
    () => this.forceLoading() || this.facade.detailsLoading()
  );

  readonly isLoadingStandings = computed<boolean>(
    () => this.forceLoading() || this.facade.standingsLoading()
  );

  readonly latestFixturesLoading = computed<boolean>(
    () => this.forceLoading() || this.facade.latestFixturesLoading()
  );

  readonly headToHeadFixturesLoading = computed<boolean>(
    () => this.forceLoading() || this.facade.headToHeadFixturesLoading()
  );

  readonly analysesLoading = computed<boolean>(
    () => this.forceLoading() || this.facade.analysesLoading()
  );

  readonly eventsLoading = computed<boolean>(
    () => this.forceLoading() || this.facade.eventsLoading()
  );

  readonly statisticsLoading = computed<boolean>(
    () => this.forceLoading() || this.facade.statisticsLoading()
  );

  protected readonly showStandings = computed<boolean>(
    () =>
      !this.facade.hasNoStandings() &&
      !this.facade.isKoPhase() &&
      !this.facade.isQualifyPhase()
  );

  protected readonly availableTabs = computed<boolean[]>(() => [
    true,
    this.isOptionalTabAvailable(this.analyses()),
    this.isOptionalTabAvailable(this.events()),
    this.isOptionalTabAvailable(this.statistics()),
  ]);

  private isOptionalTabAvailable(data: unknown): boolean {
    return this.forceLoading() || data != null;
  }
}
