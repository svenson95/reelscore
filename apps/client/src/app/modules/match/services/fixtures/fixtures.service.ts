import {
  Injectable,
  Signal,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { LatestFixturesDTO } from '@lib/models';
import { FixtureService } from '../../services';
import { HttpFixturesService } from './http.service';

export abstract class FixturesService {
  abstract latestFixtures: Signal<LatestFixturesDTO | undefined>;
  abstract isLoading: WritableSignal<boolean>;
}

@Injectable()
export class AbstractedFixturesService extends FixturesService {
  http = inject(HttpFixturesService);
  fs = inject(FixtureService);

  isLoading = signal<boolean>(false);

  latestFixtures = toSignal<LatestFixturesDTO | undefined>(
    toObservable(this.fs.fixtureId).pipe(
      switchMap((id) => (id ? this.http.getLatestFixtures(id) : of(undefined)))
    )
  );
}

export const FIXTURES_SERVICE_PROVIDER = {
  provide: FixturesService,
  useClass: AbstractedFixturesService,
};
