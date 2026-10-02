import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { COMPETITION_ID } from '@reelscore-sdk/constants';

import { AbstractedHttpTopScorersService } from './top-scorers.service';

describe('Top scorers service', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AbstractedHttpTopScorersService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('requests top scorers for the selected competition', () => {
    const service = TestBed.inject(AbstractedHttpTopScorersService);

    service
      .getTopScorersForCompetition(COMPETITION_ID.GERMANY_BUNDESLIGA)
      .subscribe();

    const request = httpTestingController.expectOne(
      (candidate) =>
        candidate.url.endsWith('/top-scorers/') &&
        candidate.params.get('competition') ===
          String(COMPETITION_ID.GERMANY_BUNDESLIGA)
    );

    request.flush(null);
  });
});
