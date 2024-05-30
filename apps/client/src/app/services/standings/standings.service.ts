import {
  DestroyRef,
  Injectable,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { StandingsDTO } from '@lib/models';

import { HttpStandingsService, LeagueService } from '../../services';

type StandingsState = StandingsDTO | 'loading' | undefined;

export abstract class StandingsService {
  abstract standings: WritableSignal<StandingsState>;
}

@Injectable()
export class AbstractedStandingsService extends StandingsService {
  leagueService = inject(LeagueService);
  standingsService = inject(HttpStandingsService);
  destroyRef = inject(DestroyRef);

  standings = signal<StandingsState>(undefined);

  onSelectedLeagueChange = effect(() => this.setStandings(), {
    allowSignalWrites: true,
  });

  setStandings(): void {
    this.standings.set(undefined);

    const league = this.leagueService.selectedLeague();
    if (!league?.id) return;

    this.standings.set('loading');
    this.standingsService
      .getStandings(league.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => this.standings.set(data));
  }
}

export const STANDINGS_SERVICE_PROVIDER = {
  provide: StandingsService,
  useClass: AbstractedStandingsService,
};
