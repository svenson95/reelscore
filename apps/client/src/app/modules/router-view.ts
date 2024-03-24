import { Injectable, effect, inject } from '@angular/core';
import { LEAGUES_METADATA } from '../constants';
import { LeagueUrl } from '../constants/leagues-urls';
import { LeagueSelectData } from '../models';
import { LeagueService, RouteService } from '../services';

@Injectable()
export class RouterView {
  protected readonly routeService = inject(RouteService);
  protected readonly service = inject(LeagueService);
  protected readonly selectedLeague = this.service.selectedLeague;

  protected readonly routeEvent = effect(
    () => {
      const route = this.routeService.activeRoute() as LeagueUrl;
      const league = this.getLeagueByName(route);
      this.service.setSelectedLeague(league);
    },
    { allowSignalWrites: true }
  );

  private getLeagueByName(url: LeagueUrl): LeagueSelectData | undefined {
    return LEAGUES_METADATA.find((l) => l.url === url);
  }
}
