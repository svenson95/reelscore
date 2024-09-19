import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { EvaluationDTO, FixtureId } from '@lib/models';
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
    return this.http.get<EvaluationDTO>(this.BASE_URL + '', {
      params,
    });
  }
}

export const HTTP_EVALUATIONS_SERVICE_PROVIDER = {
  provide: HttpEvaluationsService,
  useClass: AbstractedHttpEvaluationsService,
};
