import type { CompetitionId, TopAssistsDTO } from '@reelscore-sdk/models';

import { TopAssistsService } from './top-assists.service';

export interface TopAssistsReader {
  findByLeague(competitionId: CompetitionId): Promise<TopAssistsDTO | null>;
}

export class TopAssistsController {
  constructor(
    private readonly topAssistsService: TopAssistsReader = new TopAssistsService()
  ) {}

  getById(competitionId: CompetitionId): Promise<TopAssistsDTO | null> {
    return this.topAssistsService.findByLeague(competitionId);
  }
}
