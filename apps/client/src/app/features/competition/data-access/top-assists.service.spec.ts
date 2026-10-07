import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { COMPETITION_ID } from '@reelscore-sdk/constants';

import { AbstractedHttpTopAssistsService } from './top-assists.service';

describe('Top assists service', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AbstractedHttpTopAssistsService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('requests top assists for the selected competition', () => {
    const service = TestBed.inject(AbstractedHttpTopAssistsService);

    service
      .getTopAssistsForCompetition(COMPETITION_ID.GERMANY_BUNDESLIGA)
      .subscribe();

    const request = httpTestingController.expectOne(
      (candidate) =>
        candidate.url.endsWith('/top-assists/') &&
        candidate.params.get('competition') ===
          String(COMPETITION_ID.GERMANY_BUNDESLIGA)
    );

    expect(request.request.method).toBe('GET');

    request.flush(null);
  });
});
