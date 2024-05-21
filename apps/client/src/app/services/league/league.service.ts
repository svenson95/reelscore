import { Injectable, WritableSignal, signal } from '@angular/core';

import { LEAGUES_METADATA } from '../../constants';
import { SelectLeagueData, SelectLeagueState } from '../../models';

export const mockLeague: SelectLeagueData = LEAGUES_METADATA[2];

export abstract class LeagueService {
  abstract readonly SELECTED_LEAGUE_DEFAULT: string;
  abstract selectedLeague: WritableSignal<SelectLeagueState>;
  abstract setSelectedLeague(data: SelectLeagueState): void;
}

@Injectable()
export class AbstractedLeagueService extends LeagueService {
  readonly SELECTED_LEAGUE_DEFAULT = 'start';

  selectedLeague = signal<SelectLeagueState>(undefined);

  setSelectedLeague(data: SelectLeagueState): void {
    this.selectedLeague.set(data);
  }
}

export const LEAGUE_SERVICE_PROVIDER = {
  provide: LeagueService,
  useClass: AbstractedLeagueService,
};
