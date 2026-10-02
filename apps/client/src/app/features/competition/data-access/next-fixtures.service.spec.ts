import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { COMPETITION_ID } from '@reelscore-sdk/constants';

import { AbstractedHttpNextFixturesService } from './next-fixtures.service';

describe('Next fixtures service', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AbstractedHttpNextFixturesService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('requests upcoming fixtures without enabling show-all by default', () => {
    const service = TestBed.inject(AbstractedHttpNextFixturesService);

    service
      .getNextFixturesForCompetition(COMPETITION_ID.GERMANY_BUNDESLIGA)
      .subscribe();

    const request = httpTestingController.expectOne(
      (candidate) =>
        candidate.url.endsWith('/fixtures/competition-fixtures') &&
        candidate.params.get('competition') ===
          String(COMPETITION_ID.GERMANY_BUNDESLIGA) &&
        candidate.params.get('type') === 'next' &&
        !candidate.params.has('showAll')
    );

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });
});
