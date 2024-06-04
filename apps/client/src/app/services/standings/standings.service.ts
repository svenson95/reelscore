import { DestroyRef, Injectable, Signal, inject } from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';

import { StandingsDTO } from '@lib/models';

import { HttpStandingsService, LeagueService } from '../../services';

export abstract class StandingsService {
  abstract standing: Signal<StandingsDTO | undefined>;
  abstract topFiveStandings: Signal<StandingsDTO[] | undefined>;
}

@Injectable()
export class AbstractedStandingsService extends StandingsService {
  leagueService = inject(LeagueService);
  standingsService = inject(HttpStandingsService);
  destroyRef = inject(DestroyRef);

  standing = toSignal<StandingsDTO | undefined>(
    toObservable(this.leagueService.selectedLeague).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((league) =>
        league ? this.standingsService.getStandings(league.id) : of(undefined)
      )
    )
  );

  topFiveStandings = toSignal<StandingsDTO[] | undefined>(
    this.standingsService.getAllStandings()
  );
}

export const STANDINGS_SERVICE_PROVIDER = {
  provide: StandingsService,
  useClass: AbstractedStandingsService,
};
