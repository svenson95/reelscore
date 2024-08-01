import { DestroyRef, Injectable, Signal, inject } from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { DateService, LeagueService } from '@app/services';
import { StandingsDTO } from '@lib/models';
import { HttpStandingsService } from './http.service';

export abstract class StandingsService {
  abstract standing: Signal<StandingsDTO | undefined>;
  abstract topFiveStandings: Signal<StandingsDTO[] | undefined>;
}

@Injectable()
export class AbstractedStandingsService extends StandingsService {
  ls = inject(LeagueService);
  hss = inject(HttpStandingsService);
  ds = inject(DateService);
  destroyRef = inject(DestroyRef);

  standing = toSignal<StandingsDTO | undefined>(
    toObservable(this.ls.selectedLeague).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((league) =>
        league ? this.hss.getStandings(league.id) : of(undefined)
      )
    )
  );

  topFiveStandings = toSignal<StandingsDTO[] | undefined>(
    this.hss.getAllStandings(this.ds.selectedDay())
  );
}

export const STANDINGS_SERVICE_PROVIDER = {
  provide: StandingsService,
  useClass: AbstractedStandingsService,
};
