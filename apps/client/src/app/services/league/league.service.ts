import { Injectable, signal } from '@angular/core';

import { LEAGUES_METADATA } from '../../constants';
import { LeagueSelectData } from '../../models';

export const mockLeague: LeagueSelectData = LEAGUES_METADATA[2];

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  readonly selectedLeague = signal<LeagueSelectData | undefined>(undefined);

  setSelectedLeague(data: LeagueSelectData | undefined): void {
    this.selectedLeague.set(data);
  }
}
