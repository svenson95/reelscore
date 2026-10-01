import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import type { DateString } from '@reelscore-sdk/helpers';
import { formatDateToYearMonthDay } from '@reelscore-sdk/helpers';
import type { ExtendedFixtureDTO, FixtureId } from '@reelscore-sdk/models';

import type { CompetitionUrl } from '@lib/models';

import {
  type CompetitionData,
  RouteService,
  SELECT_COMPETITION_DATA_FLAT,
} from '@app/shared';

import { FixtureStore } from './stores';

@Injectable()
export class MatchFacade {
  private readonly router = inject(Router);
  private readonly routeService = inject(RouteService);

  private readonly fixtureStore = inject(FixtureStore);
  readonly fixture = this.fixtureStore.fixture;
  readonly isLoading = this.fixtureStore.isLoading;
  readonly error = this.fixtureStore.error;
  readonly isRefreshing = this.fixtureStore.isRefreshing;

  readonly loadFixture = (fixtureId: FixtureId): Promise<void> =>
    this.fixtureStore.loadFixture(fixtureId);

  readonly reloadFixture = (): Promise<void> =>
    this.fixtureStore.reloadFixture();

  readonly data = computed<ExtendedFixtureDTO | null>(
    () => this.fixtureStore.fixture()?.data ?? null
  );

  readonly routerDate = computed<DateString | null>(() => {
    const url = this.routeService.url();

    return url?.split('/')[1] || null;
  });

  handleInvalidUrl(url: CompetitionUrl): void {
    const fixture = this.data();

    if (!fixture) return;

    const fixtureDate = formatDateToYearMonthDay(fixture.fixture.date);

    if (this.isRouteValid(url, fixtureDate)) return;

    const competition = this.findFixtureCompetition(fixture);

    if (!competition) return;

    this.redirectTo({
      fixtureDate,
      competitionUrl: competition.url,
      fixtureId: fixture.fixture.id,
    });
  }

  private isRouteValid(
    competitionUrl: CompetitionUrl,
    fixtureDate: DateString
  ): boolean {
    const isCompetitionParamValid = SELECT_COMPETITION_DATA_FLAT.some(
      ({ url }) => url === competitionUrl
    );

    return isCompetitionParamValid && this.routerDate() === fixtureDate;
  }

  private findFixtureCompetition(
    fixture: ExtendedFixtureDTO
  ): CompetitionData | undefined {
    return SELECT_COMPETITION_DATA_FLAT.find(
      ({ id }) => id === fixture.league.id
    );
  }

  private redirectTo({
    fixtureDate,
    competitionUrl,
    fixtureId,
  }: {
    fixtureDate: DateString;
    competitionUrl: CompetitionUrl;
    fixtureId: FixtureId;
  }): void {
    void this.router.navigate([fixtureDate, competitionUrl, fixtureId]);
  }
}
