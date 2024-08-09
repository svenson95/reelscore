import { DatePipe, NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnChanges,
  SimpleChanges,
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
    .header {
      @apply flex flex-col justify-between gap-5;
    }
    .header > div { @apply flex justify-between items-center; }
    .dates { @apply flex gap-5; }
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
      --mdc-text-button-disabled-label-text-color: var(--fb-color-text-1);
      @apply fb-as-label; 
    }
    mat-tab-group {
      --mat-tab-header-inactive-label-text-color: var(--fb-color-text-2);
      --mat-tab-header-active-label-text-color: #fff;
      --mat-tab-header-inactive-ripple-color: var(--fb-color-text-2);
      --mat-tab-header-active-ripple-color: var(--fb-color-text-2);
      --mat-tab-header-active-focus-label-text-color: white;
      --mat-tab-header-inactive-hover-label-text-color: white;
      --mat-tab-header-active-hover-label-text-color: white;
      --mat-tab-header-active-focus-indicator-color: white;
    }
    :host ::ng-deep .foobar > div {
      @apply flex flex-col gap-5;
    }
  `,
  template: `
    <ng-container *ngIf="data as match">
      @if (match.isLoading()) {
      <p class="no-data">Spiel werden geladen ...</p>
      } @else if (match.error()) {
      <p class="no-data">Es ist ein Fehler aufgetreten.</p>
      } @else if (match.fixture() !== null){
      <section class="header">
        <div>
          <reelscore-back-button [date]="match.fixture()!.fixture.date" />

          <div class="dates">
            <button mat-button disabled>
              {{ match.fixture()!.fixture.date | date : 'ccc' }}
            </button>
            <button mat-button disabled>
              {{ match.fixture()!.fixture.date | date : 'HH:mm' }}
            </button>
          </div>
        </div>
      </section>

      <section class="match-header">
        <reelscore-match-header [data]="match.fixture()!" />
      </section>

      <section class="data">
        <mat-tab-group>
          <mat-tab label="Details" bodyClass="foobar">
            <reelscore-match-fixture-data />
            @if (!!evs.evaluations()) {
            <reelscore-match-evaluations [evaluations]="evs.evaluations()!" />
            }
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
export class MatchComponent extends RouterView implements OnChanges {
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

    const fixtureLeagueId = String(fixture.league.id);
    const invalidUrl = fixtureLeagueId !== league.id;
    if (invalidUrl) {
      this.redirectTo(fixtureLeagueId, fixture.fixture.id);
    }
  });

  async ngOnChanges(_: SimpleChanges) {
    await this.fs.loadFixture(this.fixtureId());
    await this.es.loadEvents(this.fixtureId());
    await this.ss.loadStatistics(this.fixtureId());
    await this.evs.loadEvaluations(this.fixtureId());
  }

  redirectTo(leagueId: CompetitionId, fixtureId: FixtureId) {
    const validLeague = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.id === leagueId
    );
    if (!validLeague) throw Error('League not found');
    this.router.navigate(['leagues', validLeague.url, 'match', fixtureId]);
  }
}
