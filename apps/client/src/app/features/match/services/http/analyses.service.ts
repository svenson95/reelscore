import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable} from 'rxjs';
import { shareReplay } from 'rxjs';

import type { AnalysesDTO, FixtureId } from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureAnalysesService {
  abstract getFixtureAnalyses(id: FixtureId): Observable<AnalysesDTO>;
}

@Injectable()
export class AbstractedHttpFixtureAnalysesService extends HttpFixtureAnalysesService {
  BASE_URL = environment.api + 'fixture-analyses';
  http = inject(HttpClient);

  getFixtureAnalyses(id: FixtureId): Observable<AnalysesDTO> {
    const params = new HttpParams().set('fixture', String(id));
    return this.http
      .get<AnalysesDTO>(this.BASE_URL + '', {
        params,
      })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_FIXTURE_ANALYSES_SERVICE_PROVIDER = {
  provide: HttpFixtureAnalysesService,
  useClass: AbstractedHttpFixtureAnalysesService,
};
