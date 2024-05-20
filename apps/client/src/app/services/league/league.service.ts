import { Injectable, WritableSignal, signal } from '@angular/core';

import { LEAGUES_METADATA } from '../../constants';
import { LeagueSelectData } from '../../models';

export const mockLeague: LeagueSelectData = LEAGUES_METADATA[2];

export abstract class LeagueService {
  abstract readonly SELECTED_LEAGUE_DEFAULT: string;
  abstract selectedLeague: WritableSignal<LeagueSelectData | undefined>;
  abstract setSelectedLeague(data: LeagueSelectData | undefined): void;
}

@Injectable()
export class AbstractedLeagueService extends LeagueService {
  readonly SELECTED_LEAGUE_DEFAULT = 'start';

  selectedLeague = signal<LeagueSelectData | undefined>(undefined);

  setSelectedLeague(data: LeagueSelectData | undefined): void {
    this.selectedLeague.set(data);
  }
}

export const LEAGUE_SERVICE_PROVIDER = {
  provide: LeagueService,
  useClass: AbstractedLeagueService,
};
