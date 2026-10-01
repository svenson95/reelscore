import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Observable } from 'rxjs';
import { shareReplay } from 'rxjs';

import type { FixtureId } from '@reelscore-sdk/models';

import type { EvaluationDTO } from '@lib/models';

import { environment } from '../../../../../environments/environment';

export abstract class HttpEvaluationsService {
  abstract getEvaluations(fixtureId: FixtureId): Observable<EvaluationDTO>;
}

@Injectable()
export class AbstractedHttpEvaluationsService extends HttpEvaluationsService {
  BASE_URL = environment.api + 'fixture-evaluations';

  http = inject(HttpClient);

  getEvaluations(fixtureId: FixtureId): Observable<EvaluationDTO> {
    const params = new HttpParams().set('fixture', fixtureId);
    return this.http
      .get<EvaluationDTO>(this.BASE_URL + '', {
        params,
      })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_EVALUATIONS_SERVICE_PROVIDER = {
  provide: HttpEvaluationsService,
  useClass: AbstractedHttpEvaluationsService,
};
