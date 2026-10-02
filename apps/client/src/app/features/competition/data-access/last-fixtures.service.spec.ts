import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { COMPETITION_ID } from '@reelscore-sdk/constants';

import { AbstractedHttpLastFixturesService } from './last-fixtures.service';

describe('Last fixtures service', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AbstractedHttpLastFixturesService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('requests recent fixtures and passes the show-all option when requested', () => {
    const service = TestBed.inject(AbstractedHttpLastFixturesService);

    service
      .getLastFixturesForCompetition(COMPETITION_ID.GERMANY_BUNDESLIGA, true)
      .subscribe();

    const request = httpTestingController.expectOne(
      (candidate) =>
        candidate.url.endsWith('/fixtures/competition-fixtures') &&
        candidate.params.get('competition') ===
          String(COMPETITION_ID.GERMANY_BUNDESLIGA) &&
        candidate.params.get('type') === 'last' &&
        candidate.params.get('showAll') === 'true'
    );

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });
});
