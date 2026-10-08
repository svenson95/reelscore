import type { TeamCoachDTO } from '@reelscore-sdk/models';

import { TeamCoaches } from './team-coaches.model';

export class TeamCoachesService {
  async findByTeamIds(teamIds: string[]): Promise<TeamCoachDTO[]> {
    const documents = await TeamCoaches.find({
      'parameters.team': { $in: teamIds },
    }).lean();

    return documents.flatMap(({ response }) => response);
  }
}
