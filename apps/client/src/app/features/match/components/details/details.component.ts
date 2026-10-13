import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { MAT_TAB_ANIMATION_DURATION, PageTitleComponent } from '@app/shared';

import {
  MatchEventsComponent,
  MatchStatisticsComponent,
} from './after/components';
import {
  MatchFixtureAnalysesComponent,
  MatchFixtureDataComponent,
  MatchFixtureStandingsComponent,
  MatchLatestFixturesComponent,
  MatchTeamCoachesComponent,
} from './base/components';

import { MatchDetailsFacade } from './details.facade';

const MAT_MODULES = [MatTabsModule, MatIconModule];

@Component({
  selector: 'section[rs-match-details]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...MAT_MODULES,
    PageTitleComponent,
    MatchFixtureDataComponent,
    MatchFixtureStandingsComponent,
    MatchLatestFixturesComponent,
    MatchTeamCoachesComponent,
    MatchFixtureAnalysesComponent,
    MatchEventsComponent,
    MatchStatisticsComponent,
  ],
  providers: [MatchDetailsFacade],
  styles: `
    :host {
      @apply max-w-rs-max-width w-full flex flex-col gap-5 mx-auto;

      .tab-content {
        @apply flex flex-col;
      }

      .detail-sections {
        @apply gap-6 sm:gap-8;
      }

      .state-skeleton {
        @apply mx-3 mt-rs1 mb-3 rounded-border2 bg-rs-button-bg p-rs2 shadow-rs;
      }

      .state-skeleton-row {
        @apply flex min-h-9 items-center justify-between gap-4 border-b py-2 last:border-b-0;
      }

      ::ng-deep {
        .mat-mdc-tab-body.mat-mdc-tab-body-active {
          @apply flex flex-col gap-2;
        }

        .mat-mdc-tab-header {
          @apply mx-3;
        }
      }
    }
  `,
  template: `
    <mat-tab-group
      [animationDuration]="animationDuration"
      [selectedIndex]="selectedTabIndex()"
      (selectedIndexChange)="selectedTabIndex.set($event)"
      [style.--tab-count]="tabCount"
      [style.--active-tab-index]="selectedTabIndex()"
    >
      <mat-tab aria-label="Details">
        <ng-template mat-tab-label>
          <div class="tab-label-content">
            <mat-icon>info</mat-icon>
          </div>
        </ng-template>

        <div class="tab-content detail-sections animate-fade-in">
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
        </div>
      </mat-tab>

      <mat-tab aria-label="Analysen" [disabled]="!availableTabs()[1]">
        <ng-template mat-tab-label>
          <div class="tab-label-content">
            <mat-icon>pageview</mat-icon>
          </div>
        </ng-template>

        <div class="tab-content">
          <rs-match-fixture-analyses
            [isLoading]="analysesLoading()"
            [error]="analysesError() ?? latestFixturesError()"
          />
        </div>
      </mat-tab>

      <mat-tab aria-label="Spielbericht" [disabled]="!availableTabs()[2]">
        <ng-template mat-tab-label>
          <div class="tab-label-content">
            <mat-icon>article</mat-icon>
          </div>
        </ng-template>

        <div class="tab-content">
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
          <p class="no-data" role="status">
            Fehler beim Laden des Spielberichts
          </p>
          } @else {
          <p class="no-data">Kein Spielbericht verfügbar</p>
          }
        </div>
      </mat-tab>

      <mat-tab aria-label="Statistiken" [disabled]="!availableTabs()[3]">
        <ng-template mat-tab-label>
          <div class="tab-label-content">
            <mat-icon>assessment</mat-icon>
          </div>
        </ng-template>

        <div class="tab-content">
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
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class MatchDetailsComponent {
  readonly forceLoading = input<boolean>(false);

  private readonly facade = inject(MatchDetailsFacade);

  protected readonly animationDuration = MAT_TAB_ANIMATION_DURATION;

  readonly standings = this.facade.standings;
  readonly analyses = this.facade.analyses;
  readonly events = this.facade.events;
  readonly statistics = this.facade.statistics;
  readonly teamCoaches = this.facade.teamCoaches;
  readonly teamCoachesError = this.facade.teamCoachesError;
  readonly latestFixtures = this.facade.latestFixtures;
  readonly standingsError = this.facade.standingsError;
  readonly latestFixturesError = this.facade.latestFixturesError;
  readonly analysesError = this.facade.analysesError;
  readonly eventsError = this.facade.eventsError;
  readonly statisticsError = this.facade.statisticsError;
  readonly hasMultipleGroups = this.facade.hasMultipleGroups;

  readonly selectedTabIndex = signal<number>(0);

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

  protected readonly tabCount = this.availableTabs().length;

  private readonly selectedTabEffect = effect(() => {
    if (!this.availableTabs()[this.selectedTabIndex()]) {
      this.selectedTabIndex.set(0);
    }
  });
}
