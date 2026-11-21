import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '@app/environment';

import {
  HTTP_FIXTURE_LINEUPS_SERVICE_PROVIDER,
  HttpFixtureLineupsService,
} from './fixture-lineups.service';

describe('HttpFixtureLineupsService', () => {
  it('requests lineups for the selected fixture', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HTTP_FIXTURE_LINEUPS_SERVICE_PROVIDER,
      ],
    });
    const service = TestBed.inject(HttpFixtureLineupsService);
    const http = TestBed.inject(HttpTestingController);
    const result = { lineups: [], playerStatistics: [] };
    let response: unknown;

    service.getLineups(123).subscribe((data) => {
      response = data;
    });
    const request = http.expectOne(
      (item) =>
        item.url === environment.api + 'fixture-lineups' &&
        item.params.get('fixture') === '123'
    );
    expect(request.request.method).toBe('GET');
    request.flush(result);

    expect(response).toEqual(result);
    http.verify();
  });
});
