import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { FixtureId, MatchLineupsResult } from '@reelscore-sdk/models';

import { environment } from '@app/environment';

@Injectable({ providedIn: 'root' })
export class FixtureLineupsService {
  private readonly http = inject(HttpClient);

  getLineups(fixtureId: FixtureId) {
    const params = new HttpParams().set('fixture', fixtureId);
    return this.http.get<MatchLineupsResult>(
      environment.api + 'fixture-lineups',
      {
        params,
      }
    );
  }
}
