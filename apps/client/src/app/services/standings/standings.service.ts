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

type StandingsState = 'init' | StandingsDTO | StandingsDTO[] | undefined;

export abstract class StandingsService {
  abstract standings: WritableSignal<StandingsState>;
  abstract isLoading: WritableSignal<boolean>;
}

@Injectable()
export class AbstractedStandingsService extends StandingsService {
  leagueService = inject(LeagueService);
  standingsService = inject(HttpStandingsService);
  destroyRef = inject(DestroyRef);

  standings = signal<StandingsState>('init');

  isLoading = signal<boolean>(true);

  onSelectedLeagueChange = effect(() => this.setStandings(), {
    allowSignalWrites: true,
  });

  setStandings(): void {
    const league = this.leagueService.selectedLeague();

    this.isLoading.set(true);
    this.standingsService
      .getStandings(league?.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.isLoading.set(false);
        this.standings.set(data);
      });
  }
}

export const STANDINGS_SERVICE_PROVIDER = {
  provide: StandingsService,
  useClass: AbstractedStandingsService,
};
