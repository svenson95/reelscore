import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '@app/environment';

import { FixtureLineupsService } from './fixture-lineups.service';

describe('FixtureLineupsService', () => {
  it('requests lineups for the selected fixture', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(FixtureLineupsService);
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
