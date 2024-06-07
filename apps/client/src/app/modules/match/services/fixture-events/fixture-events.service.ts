import { Injectable, Signal, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { FixtureEventsDTO } from '@lib/models';
import { FixtureService } from '../../services';
import { HttpFixtureEventsService } from './http.service';

export abstract class FixtureEventsService {
  abstract events: Signal<FixtureEventsDTO | undefined>;
}

@Injectable()
export class AbstractedFixtureEventsService extends FixtureEventsService {
  http = inject(HttpFixtureEventsService);
  fs = inject(FixtureService);

  events = toSignal(
    toObservable(this.fs.fixtureId).pipe(
      switchMap((id) => (id ? this.http.getFixtureEvents(id) : of(undefined)))
    )
  );
}

export const FIXTURE_EVENTS_SERVICE_PROVIDER = {
  provide: FixtureEventsService,
  useClass: AbstractedFixtureEventsService,
};
