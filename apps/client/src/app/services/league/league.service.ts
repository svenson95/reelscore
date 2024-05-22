import {
  DestroyRef,
  Injectable,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SELECT_LEAGUE } from '../../constants';
import {
  SelectLeagueData,
  SelectLeagueState,
  StandingsDTO,
} from '../../models';
import { DatabaseStandingsService } from '../../services';

export const mockLeague: SelectLeagueData = SELECT_LEAGUE[2];

type StandingsState = StandingsDTO | 'loading' | undefined;

export abstract class LeagueService {
  abstract selectedLeague: WritableSignal<SelectLeagueState>;
  abstract standings: WritableSignal<StandingsState>;
  abstract setSelectedLeague(data: SelectLeagueState): void;
}

@Injectable()
export class AbstractedLeagueService extends LeagueService {
  standingsService = inject(DatabaseStandingsService);
  destroyRef = inject(DestroyRef);

  selectedLeague = signal<SelectLeagueState>(undefined);

  selectedLeagueEffect = effect(
    () => {
      this.standings.set(undefined);

      const league = this.selectedLeague();
      if (!league?.id) return;
      this.standings.set('loading');
      this.standingsService
        .getStandings(league.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => this.standings.set(data));
    },
    { allowSignalWrites: true }
  );

  setSelectedLeague(data: SelectLeagueState): void {
    this.selectedLeague.set(data);
  }

  standings = signal<StandingsState>(undefined);
}

export const LEAGUE_SERVICE_PROVIDER = {
  provide: LeagueService,
  useClass: AbstractedLeagueService,
};
