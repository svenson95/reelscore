import { DatePipe, NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

import { BackButtonComponent } from '@app/components';
import { SELECT_COMPETITION_DATA_FLAT } from '@app/constants';
import { ROUTE_SERVICE_PROVIDER } from '@app/services';
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
    ROUTE_SERVICE_PROVIDER,
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
    :host ::ng-deep .foobar > div {
      @apply flex flex-col gap-5;
    }
    .spacer {
      flex: 1;
    }
  `,
  template: `
    <ng-container *ngIf="data as match">
      @if (match.isLoading()) {
      <p class="no-data">Spiel wird geladen ...</p>
      } @else if (match.error()) {
      <p class="no-data">Es ist ein Fehler aufgetreten.</p>
      } @else if (match.fixture() !== null){
      <section class="header">
        <div>
          <reelscore-back-button [date]="match.fixture()!.fixture.date" />
          <button mat-button disabled>
            {{ match.fixture()!.fixture.date | date : 'dd.MM.yy' }}
          </button>

          <div class="spacer"></div>

          <button mat-button disabled>
            {{ match.fixture()!.fixture.date | date : 'ccc' }}
          </button>
          <button mat-button disabled>
            {{ match.fixture()!.fixture.date | date : 'HH:mm' }}
          </button>
        </div>
      </section>

      <section class="match-header">
        <reelscore-match-header [data]="match.fixture()!" />
      </section>

      <section class="data">
        <mat-tab-group>
          <mat-tab label="Details" bodyClass="foobar">
            <reelscore-match-fixture-data />
            <reelscore-match-evaluations [evaluations]="evs.evaluations()" />
            <reelscore-match-latest-fixtures />
          </mat-tab>
          <mat-tab label="Bericht" [disabled]="!hasEvents()">
            <ng-template matTabContent>
              <reelscore-match-events />
            </ng-template>
          </mat-tab>
          <mat-tab label="Statistiken" [disabled]="!hasStatistics()">
            <ng-template matTabContent>
              @if (!!ss.statistics()) {
              <reelscore-match-statistics [data]="ss.statistics()!" />
              }
            </ng-template>
          </mat-tab>
        </mat-tab-group>
      </section>
      }
    </ng-container>
  `,
})
export class MatchComponent extends RouterView implements OnInit {
  router = inject(Router);
  fs = inject(FixtureStore);
  es = inject(EventsStore);
  ss = inject(StatisticsStore);
  evs = inject(EvaluationsStore);

  fixtureId = input.required<FixtureId>();
  leagueUrl = input.required<CompetitionUrl>();
  data = this.fs;

  hasEvents = computed<boolean>(() => !!this.es.events());
  hasStatistics = computed<boolean>(() => !!this.ss.statistics());

  invalidUrlEffect = effect(() => {
    const fixture = this.data.fixture();
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
    await this.fs.loadFixture(this.fixtureId());
    await this.evs.loadEvaluations(this.fixtureId());
    await this.ss.loadStatistics(this.fixtureId());
    await this.es.loadEvents(this.fixtureId());
  }

  redirectTo(leagueId: CompetitionId, fixtureId: FixtureId) {
    const validLeague = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.id === leagueId
    );
    if (!validLeague) throw Error('League not found');
    this.router.navigate(['leagues', validLeague.url, 'match', fixtureId]);
  }
}
