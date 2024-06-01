import { Injectable, Signal, computed, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { FixtureId, MatchDTO } from '@lib/models';

import { DateService, HttpFixturesService } from '../../services';
export abstract class FixturesService {
  abstract fixtures$: Signal<Observable<MatchDTO[]>>;
  abstract requestFixtureDetails(id: FixtureId): Observable<MatchDTO>;
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

  requestFixtureDetails(id: FixtureId): Observable<MatchDTO> {
    return this.http.getFixtureDetails(id);
  }
}

export const FIXTURES_SERVICE_PROVIDER = {
  provide: FixturesService,
  useClass: AbstractedFixturesService,
};
