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
  selector: 'reelscore-match-details',
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
    :host ::ng-deep {
      .mat-mdc-tab-body.mat-mdc-tab-body-active {
        @apply flex flex-col gap-2; 
      }

      .mat-mdc-tab-header { @apply mx-5; }
    }
    .tab-content { @apply px-5 pb-5; }
    mat-spinner { @apply mx-auto my-5; }
  `,
  template: `
    <mat-tab-group dynamicHeight>
      <mat-tab>
        <ng-template mat-tab-label>
          @if (isMobile()) {
          <mat-icon>info</mat-icon>
          } @else { Details }
        </ng-template>

        <div class="tab-content">
          <reelscore-match-fixture-data />
          @if (fixture()?.data) { @if (!hasNoStandings() && !isKoPhase()) {
          <reelscore-match-fixture-standings [standings]="standings()" />
          }
          <reelscore-match-evaluations [evaluations]="evaluations()" />
          <reelscore-match-latest-fixtures />
          } @else {
          <mat-spinner [diameter]="32"></mat-spinner>
          }
        </div>
      </mat-tab>

      <mat-tab [disabled]="!analyses()">
        <ng-template mat-tab-label>
          @if (isMobile()) {
          <mat-icon>pageview</mat-icon>
          } @else { Analysen }
        </ng-template>

        <div class="tab-content">
          @if (analyses()) {
          <reelscore-match-fixture-analyses />
          }
        </div>
      </mat-tab>

      <mat-tab [disabled]="!events()">
        <ng-template mat-tab-label>
          @if (isMobile()) {
          <mat-icon>article</mat-icon>
          } @else { Bericht }
        </ng-template>

        <div class="tab-content">
          @if (events()) {
          <reelscore-match-events [data]="events()!" />
          }
        </div>
      </mat-tab>

      <mat-tab [disabled]="!statistics()">
        <ng-template mat-tab-label>
          @if (isMobile()) {
          <mat-icon>assessment</mat-icon>
          } @else { Statistiken }
        </ng-template>

        <div class="tab-content">
          @if (statistics()) {
          <reelscore-match-statistics [data]="statistics()!" />
          }
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
})
export class MatchDetailsComponent {
  facade = inject(MatchDetailsFacade);
  isMobile = this.facade.isMobile;
  standings = this.facade.standings;
  analyses = this.facade.analyses;
  events = this.facade.events;
  statistics = this.facade.statistics;
  evaluations = this.facade.evaluations;
  fixture = this.facade.fixture;
  hasNoStandings = this.facade.hasNoStandings;
  isKoPhase = this.facade.isKoPhase;
}
