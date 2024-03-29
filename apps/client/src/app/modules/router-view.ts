import { Injectable, effect, inject } from '@angular/core';
import { LEAGUES_METADATA } from '../constants';
import { LeagueUrl } from '../constants/leagues-urls';
import { LeagueSelectData } from '../models';
import { LeagueService, RouteService } from '../services';

@Injectable()
export class RouterView {
  protected readonly routeService = inject(RouteService);
  readonly service = inject(LeagueService);
  readonly selectedLeague = this.service.selectedLeague;

  protected readonly routeEvent = effect(
    () => this.updateLeague(this.routeService.activeRoute()),
    { allowSignalWrites: true }
  );

  getLeagueByUrl(url: LeagueUrl): LeagueSelectData | undefined {
    return LEAGUES_METADATA.find((l) => l.url === url);
  }

  updateLeague(url: LeagueUrl): void {
    if (url === undefined) throw new Error('route is undefined');
    const league = this.getLeagueByUrl(url);
    this.service.setSelectedLeague(league);
  }

  isInvalid(routeArr: unknown | undefined): boolean {
    return routeArr === undefined;
  }
}
