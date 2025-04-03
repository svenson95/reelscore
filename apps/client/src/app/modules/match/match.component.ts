import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnChanges,
  untracked,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';

import {
  BackButtonComponent,
  BreakpointObserverService,
  CompetitionData,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';
import { CompetitionUrl, FixtureId } from '@lib/models';
import {
  isCompetitionWithMultipleGroups,
  isCompetitionWithoutStandings,
  isKoPhase,
} from '@lib/shared';

import { RouterView } from '../router-view';

import {
  MatchEvaluationsComponent,
  MatchEventsComponent,
  MatchFixtureAnalysesComponent,
  MatchFixtureDataComponent,
  MatchFixtureStandingsComponent,
  MatchHeaderComponent,
  MatchLatestFixturesComponent,
  MatchStatisticsComponent,
} from './components';
import { SERVICE_PROVIDERS } from './services';
import {
  AnalysesStore,
  EvaluationsStore,
  EventsStore,
  FixtureStandingsStore,
  FixtureStore,
  StatisticsStore,
  STORE_PROVIDERS,
} from './store';

@Component({
  selector: 'reelscore-match-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    BackButtonComponent,
    MatchHeaderComponent,
    MatchFixtureDataComponent,
    MatchLatestFixturesComponent,
    MatchEventsComponent,
    MatchEvaluationsComponent,
    MatchStatisticsComponent,
    MatchFixtureAnalysesComponent,
    MatchFixtureStandingsComponent,
  ],
  providers: [...SERVICE_PROVIDERS, ...STORE_PROVIDERS],
  styles: `
    :host { 
      @apply w-full flex flex-col gap-5; 

      ::ng-deep {
        .mat-mdc-tab-body.mat-mdc-tab-body-active {
          @apply flex flex-col gap-2; 
        }

        .mat-mdc-tab-header { @apply mx-5; }
      }
    }
    section.header {
      @apply p-5;
      div { @apply flex gap-5; }
    }
    section.match-header {
      @apply px-5 sticky top-0 rs-bg-color z-10;
      margin-top: -1.25rem;
    }
    section.data { @apply max-w-rs-max-width w-full flex flex-col gap-5 mx-auto; }
    .tab-content { @apply px-5 pb-5; }
    button { 
      --mdc-outlined-button-container-height: 36px;
      @apply rs-as-label; 
    }
    .spacer { @apply flex-1; }
  `,
  template: `
    @if (fixtureStore.isLoading()) {
    <p class="no-data">Spiel wird geladen ...</p>
    } @else if (fixtureStore.error()) {
    <p class="no-data">Es ist ein Fehler aufgetreten.</p>
    } @else if (fixtureStore.fixture() !== null){
    <section class="header">
      <div>
        <reelscore-back-button />
        <button mat-stroked-button disabled>
          {{ data()!.fixture.date | date : 'dd.MM.yy' }}
        </button>

        <div class="spacer"></div>

        <button mat-stroked-button disabled>
          {{ data()!.fixture.date | date : 'ccc' }}
        </button>
        <button mat-stroked-button disabled>
          {{ data()!.fixture.date | date : 'HH:mm' }}
        </button>
      </div>
    </section>

    <section class="match-header">
      <reelscore-match-header
        [data]="fixture()!.data"
        [highlights]="fixture()?.highlights"
      />
    </section>

    <section class="data">
      <mat-tab-group dynamicHeight>
        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>info</mat-icon>
            } @else { Details }
          </ng-template>

          <div class="tab-content">
            @if (fixture()) {
            <reelscore-match-fixture-data />
            } @if (!hasNoStandings(fixture()!.data.league.id) &&
            !isKoPhase(fixture()!.data.league.round)) {
            <reelscore-match-fixture-standings
              [standings]="standingsStore.standings()"
            />
            } @if (evaluations()) {
            <reelscore-match-evaluations [evaluations]="evaluations()" />
            }

            <reelscore-match-latest-fixtures />
          </div>
        </mat-tab>

        <mat-tab [disabled]="!analysesStore.analyses()">
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>pageview</mat-icon>
            } @else { Analysen }
          </ng-template>

          <div class="tab-content">
            @if (analysesStore.analyses()) {
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
    </section>
    }
  `,
})
export class MatchComponent extends RouterView implements OnChanges {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  fixtureStore = inject(FixtureStore);
  fixture = this.fixtureStore.fixture;
  data = computed(() => this.fixtureStore.fixture()?.data);

  standingsStore = inject(FixtureStandingsStore);
  analysesStore = inject(AnalysesStore);

  eventsStore = inject(EventsStore);
  events = this.eventsStore.events;

  statisticsStore = inject(StatisticsStore);
  statistics = this.statisticsStore.statistics;

  evaluationsStore = inject(EvaluationsStore);
  evaluations = this.evaluationsStore.evaluations;

  breakpointObserverService = inject(BreakpointObserverService);
  isMobile = this.breakpointObserverService.isMobile;

  fixtureId = input.required<FixtureId>();
  competitionUrl = input.required<CompetitionUrl>();

  hasNoStandings = isCompetitionWithoutStandings;
  hasMultipleGroups = isCompetitionWithMultipleGroups;
  isKoPhase = isKoPhase;

  invalidUrlEffect = effect(() => {
    const fixture = this.data();
    const activeRoute = untracked(this.competitionUrl);
    const leagueData = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.url === activeRoute
    );
    if (!fixture || !leagueData) return;

    const fixtureLeagueId = fixture.league.id;
    const invalidUrl = fixtureLeagueId !== leagueData.id;
    if (invalidUrl) {
      const fixtureId = fixture.fixture.id;
      const league = SELECT_COMPETITION_DATA_FLAT.find(
        (d) => d.id === fixture.league.id
      );
      if (!league) return;
      this.redirectTo({ league, fixtureId });
    }
  });

  async ngOnChanges(): Promise<void> {
    await this.fixtureStore.loadFixture(this.fixtureId());
  }

  private redirectTo({
    league,
    fixtureId,
  }: {
    league: CompetitionData;
    fixtureId: FixtureId;
  }) {
    if (!league) throw Error('Unexpected League not found');
    this.router.navigate(['../..', league.url, fixtureId], {
      relativeTo: this.activatedRoute,
    });
  }
}
