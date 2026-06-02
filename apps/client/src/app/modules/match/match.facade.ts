import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  type DateString,
  formatBerlinDateString,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';
import type {
  CompetitionUrl,
  ExtendedFixtureDTO,
  FixtureId,
} from '@lib/models';

import { FixtureStore } from './store';

@Injectable()
export class MatchFacade {
  private readonly router = inject(Router);
  private readonly routerService = inject(RouteService);

  private readonly fixtureStore = inject(FixtureStore);
  readonly fixture = this.fixtureStore.fixture;
  readonly isLoading = this.fixtureStore.isLoading;
  readonly error = this.fixtureStore.error;
  loadFixture = this.fixtureStore.loadFixture;
  reloadFixture = this.fixtureStore.reloadFixture;

  readonly data = computed<ExtendedFixtureDTO | null>(
    () => this.fixtureStore.fixture()?.data ?? null
  );

  readonly routerDate = computed<DateString | null>(() => {
    const url = this.routerService.url();
    if (!url) return null;
    return url.split('/')[1];
  });

  handleInvalidUrl(url: string): void {
    const fixture = this.data();
    if (!fixture) return;
    const data = SELECT_COMPETITION_DATA_FLAT.find((c) => c.url === url);
    const isCompetitionParamCorrect = !!data;

    const fixtureDate = formatBerlinDateString(fixture.fixture.date);
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
