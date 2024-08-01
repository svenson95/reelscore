import { Injectable, WritableSignal, signal } from '@angular/core';
import { CompetitionData } from '@app/models';

export abstract class LeagueService {
  abstract selectedLeague: WritableSignal<CompetitionData | undefined>;
  abstract setSelectedLeague(data: CompetitionData | undefined): void;
}

@Injectable()
export class AbstractedLeagueService extends LeagueService {
  selectedLeague = signal<CompetitionData | undefined>(undefined);

  setSelectedLeague(data: CompetitionData): void {
    this.selectedLeague.set(data);
  }
}

export const LEAGUE_SERVICE_PROVIDER = {
  provide: LeagueService,
  useClass: AbstractedLeagueService,
};
