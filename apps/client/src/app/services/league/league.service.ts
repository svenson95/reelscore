import { Injectable, WritableSignal, signal } from '@angular/core';

import { SelectLeagueState } from '../../models';

export abstract class LeagueService {
  abstract selectedLeague: WritableSignal<SelectLeagueState>;
  abstract setSelectedLeague(data: SelectLeagueState): void;
}

@Injectable()
export class AbstractedLeagueService extends LeagueService {
  selectedLeague = signal<SelectLeagueState>(undefined);

  setSelectedLeague(data: SelectLeagueState): void {
    this.selectedLeague.set(data);
  }
}

export const LEAGUE_SERVICE_PROVIDER = {
  provide: LeagueService,
  useClass: AbstractedLeagueService,
};
