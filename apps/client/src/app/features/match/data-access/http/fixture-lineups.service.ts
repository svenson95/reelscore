import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Observable } from 'rxjs';

import type { FixtureId, MatchLineupsResult } from '@reelscore-sdk/models';

import { environment } from '@app/environment';

export abstract class HttpFixtureLineupsService {
  abstract getLineups(fixtureId: FixtureId): Observable<MatchLineupsResult>;
}

@Injectable()
export class AbstractedHttpFixtureLineupsService extends HttpFixtureLineupsService {
  private readonly http = inject(HttpClient);

  getLineups(fixtureId: FixtureId): Observable<MatchLineupsResult> {
    const params = new HttpParams().set('fixture', fixtureId);
    return this.http.get<MatchLineupsResult>(
      environment.api + 'fixture-lineups',
      {
        params,
      }
    );
  }
}

export const HTTP_FIXTURE_LINEUPS_SERVICE_PROVIDER = {
  provide: HttpFixtureLineupsService,
  useClass: AbstractedHttpFixtureLineupsService,
};
