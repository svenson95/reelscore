import { computed, inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CompetitionData, SELECT_COMPETITION_DATA_FLAT } from '@app/shared';
import { FixtureId } from '@lib/models';

import { FixtureStore } from './store';

@Injectable()
export class MatchFacade {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  fixtureStore = inject(FixtureStore);
  fixture = this.fixtureStore.fixture;
  data = computed(() => this.fixtureStore.fixture()?.data);

  routerDate = computed(() => {
    const route = this.activatedRoute.snapshot;
    return route.params['date'];
  });

  handleInvalidUrl(activeRoute: string): void {
    const fixture = this.data();
    if (!fixture) return;
    const leagues = SELECT_COMPETITION_DATA_FLAT;
    const fixtureId = fixture.fixture.id;
    const fixtureDate = fixture.fixture.date.substring(0, 10);
    const leagueId = fixture.league.id;
    const leagueData = leagues.find((c) => c.url === activeRoute);

    const isLeagueParamCorrect = !!leagueData;
    const isDateParamCorrect = this.routerDate() === fixtureDate;
    if (isLeagueParamCorrect && isDateParamCorrect) return;

    const leagueDataFromFixture = leagues.find((d) => d.id === leagueId);
    if (!leagueDataFromFixture) return;
    this.redirectTo({
      fixtureDate,
      league: leagueDataFromFixture,
      fixtureId,
    });
  }

  private redirectTo({
    fixtureDate,
    league,
    fixtureId,
  }: {
    fixtureDate: string;
    league: CompetitionData;
    fixtureId: FixtureId;
  }) {
    if (!league) throw Error('Unexpected League not found');
    this.router.navigate([fixtureDate, league.url, fixtureId]);
  }
}
