import { Injectable, Signal, computed, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { MatchDTO } from '../../models';
import { DateService, HttpFixturesService } from '../../services';

type FixturesState = MatchDTO[] | 'loading' | undefined;

export abstract class FixturesService {
  abstract fixtures$: Signal<Observable<MatchDTO[]>>;
}

@Injectable()
export class AbstractedFixturesService extends FixturesService {
  http = inject(HttpFixturesService);
  date = inject(DateService);

  fixtures$ = computed(() => {
    const d = new Date(this.date.selectedDay());
    const date = new Date(d.setDate(d.getDate() + 1)).toISOString();
    const dateString = date.split('T')[0];

    return this.http.getFixtures(dateString);
  });
}

export const FIXTURES_SERVICE_PROVIDER = {
  provide: FixturesService,
  useClass: AbstractedFixturesService,
};
