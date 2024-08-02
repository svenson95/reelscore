import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { BackButtonComponent } from '@app/components';
import { SELECT_COMPETITION_DATA_FLAT } from '@app/constants';
import { ROUTE_SERVICE_PROVIDER } from '@app/services';
import { CompetitionId, CompetitionUrl, FixtureId } from '@lib/models';
import { RouterView } from '../router-view';
import {
  MatchDetailsAfterComponent,
  MatchDetailsBaseComponent,
  MatchHeaderComponent,
} from './components';
import { FixtureService, SERVICE_PROVIDERS } from './services';

@Component({
  selector: 'reelscore-match',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    BackButtonComponent,
    MatchHeaderComponent,
    MatchDetailsBaseComponent,
    MatchDetailsAfterComponent,
  ],
  providers: [...SERVICE_PROVIDERS, ROUTE_SERVICE_PROVIDER],
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
      background: var(--fb-color-green-1-light);
      z-index: 100;
    }
    section.data { @apply max-w-fb-max-width w-full flex flex-col gap-5 mx-auto; }
    button { 
      --mdc-outlined-button-container-height: 40px;
      @apply fb-as-label; 
    }
  `,
  template: `
    @if (fixture(); as match) {
    <section class="header">
      <div>
        <reelscore-back-button [date]="match.fixture.date" />

        <div class="dates">
          <button mat-stroked-button disabled>
            {{ match.fixture.date | date : 'ccc' }}
          </button>
          <button mat-stroked-button disabled>
            {{ match.fixture.date | date : 'HH:mm' }}
          </button>
        </div>
      </div>
    </section>

    <section class="match-header">
      <reelscore-match-header [data]="match" />
    </section>

    <section class="data">
      @switch(isUpcoming()) { @case(true) {
      <!-- <reelscore-match-details-before /> -->
      } @case(false) { @if (fixture(); as f) {
      <reelscore-match-details-after [fixture]="f" />
      } }}

      <reelscore-match-details-base [data]="match" />
    </section>
    }
  `,
})
export class MatchComponent extends RouterView {
  fixtureId = input.required<FixtureId>();
  leagueUrl = input.required<CompetitionUrl>();
  fs = inject(FixtureService);
  router = inject(Router);
  fixture = this.fs.fixture;

  isUpcoming = signal<boolean>(false); // TODO derive value from fixture date

  setFixtureId = effect(() => this.fs.fixtureId.set(this.fixtureId()), {
    allowSignalWrites: true,
  });

  invalidUrlEffect = effect(() => {
    const fixture = this.fixture();
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

  redirectTo(leagueId: CompetitionId, fixtureId: FixtureId) {
    const validLeague = SELECT_COMPETITION_DATA_FLAT.find(
      (c) => c.id === leagueId
    );
    if (!validLeague) throw Error('League not found');
    this.router.navigate(['leagues', validLeague.url, 'match', fixtureId]);
  }
}
