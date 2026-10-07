import type { TeamCoachDTO } from '@reelscore-sdk/models';

import { TeamCoachesService } from './team-coaches.service';

export interface TeamCoachesReader {
  findByTeamIds(teamIds: string[]): Promise<TeamCoachDTO[]>;
}

export class TeamCoachesController {
  constructor(
    private readonly teamCoachesService: TeamCoachesReader = new TeamCoachesService()
  ) {}

  getByTeamIds(teamIds: string[]): Promise<TeamCoachDTO[]> {
    return this.teamCoachesService.findByTeamIds(teamIds);
  }
}
