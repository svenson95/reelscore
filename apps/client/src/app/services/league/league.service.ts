import { Injectable, WritableSignal, signal } from '@angular/core';

import { LEAGUES_METADATA } from '../../constants';
import { SelectLeagueData } from '../../models';

export const mockLeague: SelectLeagueData = LEAGUES_METADATA[2];

export abstract class LeagueService {
  abstract readonly SELECTED_LEAGUE_DEFAULT: string;
  abstract selectedLeague: WritableSignal<SelectLeagueData | undefined>;
  abstract setSelectedLeague(data: SelectLeagueData | undefined): void;
}

@Injectable()
export class AbstractedLeagueService extends LeagueService {
  readonly SELECTED_LEAGUE_DEFAULT = 'start';

  selectedLeague = signal<SelectLeagueData | undefined>(undefined);

  setSelectedLeague(data: SelectLeagueData | undefined): void {
    this.selectedLeague.set(data);
  }
}

export const LEAGUE_SERVICE_PROVIDER = {
  provide: LeagueService,
  useClass: AbstractedLeagueService,
};
