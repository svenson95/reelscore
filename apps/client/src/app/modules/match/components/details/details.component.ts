import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

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

const ANGULAR_MODULES = [
  MatTabsModule,
  MatIconModule,
  MatProgressSpinnerModule,
];

@Component({
  selector: 'section[rs-match-details]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ...ANGULAR_MODULES,
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
      mat-spinner { @apply mx-auto my-5; }
      .tab-content { @apply flex flex-col gap-rs2; }

      ::ng-deep {
        .mat-mdc-tab-body.mat-mdc-tab-body-active {
          @apply flex flex-col gap-2;
        }

        .mat-mdc-tab-header { @apply mx-3; }
      }
    }
  `,
  template: `
    <mat-tab-group animationDuration="150ms">
      <mat-tab>
        <ng-template mat-tab-label>
          <div class="tab-label-content">
            <mat-icon>info</mat-icon>
            <span class="tab-label-span">Details</span>
          </div>
        </ng-template>

        <div class="tab-content">
          <rs-match-fixture-data />
          @if (fixture()?.data) { @if (!hasNoStandings() && !isKoPhase()) {
          <rs-match-fixture-standings
            [standings]="standings()"
            [isLoading]="isLoadingStandings()"
          />
          }
          <rs-match-evaluations [evaluations]="evaluations()" />
          <rs-match-latest-fixtures />
          } @else {
          <mat-spinner [diameter]="32"></mat-spinner>
          }
        </div>
      </mat-tab>

      <mat-tab [disabled]="!analyses()">
        <ng-template mat-tab-label>
          <div class="tab-label-content">
            <mat-icon>pageview</mat-icon>
            <span class="tab-label-span">Analysen</span>
          </div>
        </ng-template>

        <div class="tab-content">
          @if (analyses()) {
          <rs-match-fixture-analyses />
          }
        </div>
      </mat-tab>

      <mat-tab [disabled]="!events()">
        <ng-template mat-tab-label>
          <div class="tab-label-content">
            <mat-icon>article</mat-icon>
            <span class="tab-label-span">Bericht</span>
          </div>
        </ng-template>

        <div class="tab-content">
          @if (events()) {
          <rs-match-events [data]="events()!" />
          }
        </div>
      </mat-tab>

      <mat-tab [disabled]="!statistics()">
        <ng-template mat-tab-label>
          <div class="tab-label-content">
            <mat-icon>assessment</mat-icon>
            <span class="tab-label-span">Statistiken</span>
          </div>
        </ng-template>

        <div class="tab-content">
          @if (statistics()) {
          <rs-match-statistics [data]="statistics()!" />
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
  readonly fixture = this.facade.fixture;
  readonly hasNoStandings = this.facade.hasNoStandings;
  readonly isLoadingStandings = this.facade.standingsStore.isLoading;
  readonly isKoPhase = this.facade.isKoPhase;
}
