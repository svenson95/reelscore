import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FixtureId, MatchDTO } from '@lib/models';
import { of, switchMap } from 'rxjs';

import { HttpFixtureService } from './http.service';

export abstract class FixtureService {
  abstract fixtureId: WritableSignal<FixtureId | undefined>;
  abstract fixture: Signal<MatchDTO | undefined>;
}

@Injectable()
export class AbstractedFixtureService extends FixtureService {
  http = inject(HttpFixtureService);

  fixtureId = signal<FixtureId | undefined>(undefined);

  fixture = toSignal(
    toObservable(this.fixtureId).pipe(
      switchMap((id) => (id ? this.http.getFixture(id) : of(undefined)))
    )
  );
}

export const FIXTURE_SERVICE_PROVIDER = {
  provide: FixtureService,
  useClass: AbstractedFixtureService,
};
