import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
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
  MatchEvaluationsComponent,
  MatchFixtureAnalysesComponent,
  MatchFixtureDataComponent,
  MatchFixtureStandingsComponent,
  MatchLatestFixturesComponent,
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
    MatchEvaluationsComponent,
    MatchLatestFixturesComponent,
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

        <div class="tab-content">
          <rs-match-fixture-data
            [fixture]="fixtureData()"
            [isLoading]="detailsLoading()"
          />

          @if (showStandings()) {
          <rs-match-fixture-standings
            [standings]="standings()"
            [isLoading]="isLoadingStandings()"
            [error]="standingsError()"
            [groupCompetition]="hasMultipleGroups()"
            [competitionName]="fixtureData()?.league?.name ?? null"
          />
          }

          <rs-match-evaluations
            [evaluations]="evaluations()"
            [isLoading]="evaluationsLoading()"
            [error]="evaluationsError()"
          />
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
          @if (analyses()) {
          <rs-match-fixture-analyses />
          }
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

          @if (events(); as matchEvents) {
          <rs-match-events [data]="matchEvents" />
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

          @if (statistics(); as matchStatistics) {
          <rs-match-statistics [data]="matchStatistics" />
          }
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class MatchDetailsComponent {
  private readonly facade = inject(MatchDetailsFacade);

  readonly standings = this.facade.standings;
  readonly analyses = this.facade.analyses;
  readonly events = this.facade.events;
  readonly statistics = this.facade.statistics;
  readonly evaluations = this.facade.evaluations;
  protected readonly fixtureData = computed(
    () => this.facade.fixture()?.data ?? null
  );

  readonly isLoadingStandings = this.facade.standingsLoading;
  readonly detailsLoading = this.facade.detailsLoading;
  readonly evaluationsLoading = this.facade.evaluationsLoading;
  readonly latestFixturesLoading = this.facade.latestFixturesLoading;
  readonly latestFixtures = this.facade.latestFixtures;
  readonly standingsError = this.facade.standingsError;
  readonly evaluationsError = this.facade.evaluationsError;
  readonly latestFixturesError = this.facade.latestFixturesError;
  readonly hasMultipleGroups = this.facade.hasMultipleGroups;

  protected readonly showStandings = computed<boolean>(
    () =>
      !this.facade.hasNoStandings() &&
      !this.facade.isKoPhase() &&
      !this.facade.isQualifyPhase()
  );

  protected readonly availableTabs = computed<boolean[]>(() => [
    true,
    !!this.analyses(),
    !!this.events(),
    !!this.statistics(),
  ]);

  protected readonly animationDuration = MAT_TAB_ANIMATION_DURATION;
  protected readonly tabCount = this.availableTabs().length;
  readonly selectedTabIndex = signal(0);

  private readonly selectedTabEffect = effect(() => {
    if (!this.availableTabs()[this.selectedTabIndex()]) {
      this.selectedTabIndex.set(0);
    }
  });
}
