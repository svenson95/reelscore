import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CompetitionUrl, FixtureId } from '@lib/models';

import {
  DateString,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
} from '../../shared';
import { FixtureStore } from './store';

@Injectable()
export class MatchFacade {
  private router = inject(Router);
  private routerService = inject(RouteService);

  private fixtureStore = inject(FixtureStore);
  fixture = this.fixtureStore.fixture;
  error = this.fixtureStore.error;
  loadFixture = this.fixtureStore.loadFixture;

  data = computed(() => this.fixtureStore.fixture()?.data);

  routerDate = computed(() => {
    const url = this.routerService.url();
    if (!url) return null;
    return url.split('/')[1];
  });

  handleInvalidUrl(url: string): void {
    const fixture = this.data();
    if (!fixture) return;
    const data = SELECT_COMPETITION_DATA_FLAT.find((c) => c.url === url);
    const isCompetitionParamCorrect = !!data;

    const fixtureDate = fixture.fixture.date.substring(0, 10);
    const isDateParamCorrect = this.routerDate() === fixtureDate;

    if (isCompetitionParamCorrect && isDateParamCorrect) return;
    const id = fixture.league.id;
    const competition = SELECT_COMPETITION_DATA_FLAT.find((d) => d.id === id);

    if (!competition) return;
    this.redirectTo({
      fixtureDate,
      competitionUrl: competition.url,
      fixtureId: fixture.fixture.id,
    });
  }

  private redirectTo({
    fixtureDate,
    competitionUrl,
    fixtureId,
  }: {
    fixtureDate: DateString;
    competitionUrl: CompetitionUrl;
    fixtureId: FixtureId;
  }) {
    this.router.navigate([fixtureDate, competitionUrl, fixtureId]);
  }
}
