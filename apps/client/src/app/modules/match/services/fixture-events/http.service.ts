import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  EventDTO,
  EventResult,
  EventWithResult,
  FixtureId,
  RapidEventsDTO,
} from '@lib/models';
import { environment } from '../../../../../environments/environment';

export abstract class HttpFixtureEventsService {
  abstract getFixtureEvents(
    id: FixtureId
  ): Observable<EventWithResult[] | undefined>;
}

@Injectable()
export class AbstractedHttpFixtureEventsService extends HttpFixtureEventsService {
  BASE_URL = environment.api + 'fixture-events';
  http = inject(HttpClient);

  getFixtureEvents(id: FixtureId): Observable<EventWithResult[] | undefined> {
    const params = new HttpParams().set('fixtureId', String(id));
    return this.http
      .get<RapidEventsDTO | null>(this.BASE_URL + '/get', {
        params,
      })
      .pipe(map((d) => (d ? this.mappedEvents(d) : undefined)));
  }

  mappedEvents = (events: RapidEventsDTO): EventWithResult[] =>
    events.response.map((e) => ({
      ...e,
      result: this.getTeamGoals(events.response, e),
    }));

  getTeamGoals = (events: EventDTO[], event: EventDTO): EventResult => {
    const goals = events.filter((e) => e.type === 'Goal');
    const timeTotal = (e: EventDTO) => e.time.elapsed + e.time.extra;
    const byTime = goals.filter((e) => timeTotal(e) <= timeTotal(event));
    const home = byTime.filter((e) => e.team.id === event.team.id).length;
    const away = byTime.length - home;
    return { home, away };
  };
}

export const HTTP_FIXTURE_EVENTS_SERVICE_PROVIDER = {
  provide: HttpFixtureEventsService,
  useClass: AbstractedHttpFixtureEventsService,
};
