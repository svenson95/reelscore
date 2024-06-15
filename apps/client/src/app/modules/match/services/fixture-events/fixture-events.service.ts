import { Injectable, Signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';

import {
  EventDTO,
  EventResult,
  EventWithResult,
  RapidEventsDTO,
  timeTotal,
} from '@lib/models';
import { FixtureService } from '../../services';
import { HttpFixtureEventsService } from './http.service';

export abstract class FixtureEventsService {
  abstract events: Signal<EventWithResult[] | undefined>;
}

@Injectable()
export class AbstractedFixtureEventsService extends FixtureEventsService {
  http = inject(HttpFixtureEventsService);
  fs = inject(FixtureService);

  events = toSignal(
    toObservable(this.fs.fixtureId).pipe(
      switchMap((id) => (id ? this.http.getFixtureEvents(id) : of(undefined))),
      map((d) => (d ? this.mappedEvents(d) : undefined))
    )
  );

  mappedEvents = (events: RapidEventsDTO): EventWithResult[] =>
    events.response.map((e) => ({
      ...e,
      result: this.getTeamGoals(events.response, e),
    }));

  getTeamGoals = (events: EventDTO[], event: EventDTO): EventResult => {
    const teams = this.fs.fixture()?.teams;
    if (teams === undefined) throw new Error('Teams not found in fixture');
    const goals = events.filter((e) => e.type === 'Goal');
    const elapsed = goals.filter((e) => timeTotal(e) <= timeTotal(event));
    const home = elapsed.filter((e) => e.team.id === teams.home.id).length;
    const away = elapsed.filter((e) => e.team.id === teams.away.id).length;
    return { home, away };
  };
}

export const FIXTURE_EVENTS_SERVICE_PROVIDER = {
  provide: FixtureEventsService,
  useClass: AbstractedFixtureEventsService,
};
