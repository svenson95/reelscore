import { Injectable, WritableSignal, signal } from '@angular/core';

import { SelectLeagueData } from '@app/models';

export abstract class LeagueService {
  abstract selectedLeague: WritableSignal<SelectLeagueData | undefined>;
  abstract setSelectedLeague(data: SelectLeagueData | undefined): void;
}

@Injectable()
export class AbstractedLeagueService extends LeagueService {
  selectedLeague = signal<SelectLeagueData | undefined>(undefined);

  setSelectedLeague(data: SelectLeagueData): void {
    this.selectedLeague.set(data);
  }
}

export const LEAGUE_SERVICE_PROVIDER = {
  provide: LeagueService,
  useClass: AbstractedLeagueService,
};
