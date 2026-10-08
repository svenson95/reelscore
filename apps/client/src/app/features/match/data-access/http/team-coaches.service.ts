import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Observable } from 'rxjs';
import { shareReplay } from 'rxjs';

import type { GetAllTeamCoachesDTO } from '@reelscore-sdk/models';

import { environment } from '@app/environment';

export abstract class HttpTeamCoachesService {
  abstract getTeamCoaches(teamIds: string): Observable<GetAllTeamCoachesDTO>;
}

@Injectable()
export class AbstractedHttpTeamCoachesService extends HttpTeamCoachesService {
  private readonly baseUrl = environment.api + 'team-coaches';
  private readonly http = inject(HttpClient);

  getTeamCoaches(teamIds: string): Observable<GetAllTeamCoachesDTO> {
    const params = new HttpParams().set('teams', teamIds);

    return this.http
      .get<GetAllTeamCoachesDTO>(this.baseUrl, { params })
      .pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }
}

export const HTTP_TEAM_COACHES_SERVICE_PROVIDER = {
  provide: HttpTeamCoachesService,
  useClass: AbstractedHttpTeamCoachesService,
};
