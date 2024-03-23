import { Injectable, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { LEAGUES_METADATA } from '../../constants';
import { LeagueSelectData } from '../../models';

export const mockLeague: LeagueSelectData = LEAGUES_METADATA[2];

export class MockLeagueService {
  selectedLeague = signal<LeagueSelectData | undefined>(undefined);
}

@Injectable({
  providedIn: 'root',
})
export class LeagueService {
  private readonly router = inject(Router);

  readonly selectedLeague = signal<LeagueSelectData | undefined>(undefined);

  constructor() {
    effect(() => {
      const selectedLeague = this.selectedLeague();
      if (selectedLeague) this.navigateToLeague(selectedLeague.id);
    });
  }

  navigateToLeague(id: string): void {
    this.router.navigate(['league'], { queryParams: { id } });
  }
}
