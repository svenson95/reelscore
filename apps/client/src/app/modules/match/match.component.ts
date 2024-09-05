import { DatePipe, NgIf } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

import { BackButtonComponent } from '@app/components';
import { SELECT_COMPETITION_DATA_FLAT } from '@app/constants';
import { BreakpointObserverService } from '@app/services';
import { CompetitionId, CompetitionUrl, FixtureId } from '@lib/models';
import { FixtureStore } from '../../store/fixture.store';
import { RouterView } from '../router-view';
import { MatchHeaderComponent } from './components';
import {
  MatchEventsComponent,
  MatchStatisticsComponent,
} from './components/details/after/components';
import {
  MatchEvaluationsComponent,
  MatchFixtureDataComponent,
  MatchLatestFixturesComponent,
} from './components/details/base/components';
import { SERVICE_PROVIDERS } from './services';
import { EvaluationsStore } from './store';
import { EventsStore } from './store/events.store';
import { LatestFixturesStore } from './store/latest-fixtures.store';
import { StatisticsStore } from './store/statistics.store';

@Component({
  selector: 'reelscore-match',
  standalone: true,
  imports: [
    NgIf,
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
  ],
  providers: [
    ...SERVICE_PROVIDERS,
    FixtureStore,
    LatestFixturesStore,
    EventsStore,
    StatisticsStore,
    EvaluationsStore,
  ],
  styles: `
    :host { @apply w-full flex flex-col gap-5; }
    .header > div { @apply flex gap-5; }
    .match-header {
      margin-top: -1.25rem;
      padding-top: 1.25rem;
      position: sticky;
      top: 0;
      background: var(--fb-color-bg-black);
      z-index: 100;
    }
    section.data { @apply max-w-fb-max-width w-full flex flex-col gap-5 mx-auto; }
    button { 
      --mdc-outlined-button-container-height: 40px;
      @apply fb-as-label; 
    }
    :host ::ng-deep .mat-mdc-tab-body.mat-mdc-tab-body-active {
      @apply flex flex-col gap-2 bg-white; 
    }
    .spacer {
      flex: 1;
    }
  `,
  template: `
    @if (fixtureStore.isLoading()) {
    <p class="no-data">Spiel wird geladen ...</p>
    } @else if (fixtureStore.error()) {
    <p class="no-data">Es ist ein Fehler aufgetreten.</p>
    } @else if (fixtureStore.fixture() !== null){
    <section class="header">
      <div>
        <reelscore-back-button [date]="fixtureStore.fixture()!.fixture.date" />
        <button mat-button disabled>
          {{ fixtureStore.fixture()!.fixture.date | date : 'dd.MM.yy' }}
        </button>

        <div class="spacer"></div>

        <button mat-button disabled>
          {{ fixtureStore.fixture()!.fixture.date | date : 'ccc' }}
        </button>
        <button mat-button disabled>
          {{ fixtureStore.fixture()!.fixture.date | date : 'HH:mm' }}
        </button>
      </div>
    </section>

    <section class="match-header">
      <reelscore-match-header [data]="fixtureStore.fixture()!" />
    </section>

    <section class="data">
      <mat-tab-group>
        <mat-tab>
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>info</mat-icon>
            } @else { Details }
          </ng-template>

          <reelscore-match-fixture-data />
          <reelscore-match-evaluations
            [evaluations]="evaluationsStore.evaluations()"
          />
          <reelscore-match-latest-fixtures />
        </mat-tab>
        <mat-tab [disabled]="eventsStore.events() === null">
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>article</mat-icon>
            } @else { Bericht }
          </ng-template>

          <ng-template matTabContent>
            <reelscore-match-events />
          </ng-template>
        </mat-tab>
        <mat-tab [disabled]="statisticsStore.statistics() === null">
          <ng-template mat-tab-label>
            @if (isMobile()) {
            <mat-icon>assessment</mat-icon>
            } @else { Statistiken }
          </ng-template>
          <ng-template matTabContent>
            <reelscore-match-statistics
              [data]="statisticsStore.statistics()!"
            />
          </ng-template>
        </mat-tab>
      </mat-tab-group>
    </section>
    }
  `,
})
export class MatchComponent extends RouterView implements OnInit {
  router = inject(Router);

  fixtureStore = inject(FixtureStore);
  fixture = this.fixtureStore.fixture;

  eventsStore = inject(EventsStore);
  events = this.eventsStore.events;

  statisticsStore = inject(StatisticsStore);
  statistics = this.statisticsStore.statistics;

  evaluationsStore = inject(EvaluationsStore);
  evaluations = this.evaluationsStore.evaluations;

  breakpointObserverService = inject(BreakpointObserverService);
  isMobile = this.breakpointObserverService.isMobile;

  fixtureId = input.required<FixtureId>();
  leagueUrl = input.required<CompetitionUrl>();

  invalidUrlEffect = effect(() => {
    const fixture = this.fixture();
    const leagueUrl = this.leagueUrl();
    const league = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.url === leagueUrl
    );
    if (!fixture || !league) return;

    const fixtureLeagueId = fixture.league.id;
    const invalidUrl = fixtureLeagueId !== league.id;
    if (invalidUrl) {
      this.redirectTo(fixtureLeagueId, fixture.fixture.id);
    }
  });

  async ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    await this.fixtureStore.loadFixture(this.fixtureId()).then(async () => {
      await this.evaluationsStore.loadEvaluations(this.fixtureId());
      await this.eventsStore.loadEvents(this.fixtureId());
      await this.statisticsStore.loadStatistics(this.fixtureId());
    });
  }

  redirectTo(leagueId: CompetitionId, fixtureId: FixtureId) {
    const validLeague = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.id === leagueId
    );
    if (!validLeague) throw Error('League not found');
    this.router.navigate(['leagues', validLeague.url, 'match', fixtureId]);
  }
}
