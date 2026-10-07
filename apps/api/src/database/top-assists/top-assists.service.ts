import type { CompetitionId, TopAssistsDTO } from '@reelscore-sdk/models';

import { TopAssists } from './top-assists.model';

export class TopAssistsService {
  findByLeague(competitionId: CompetitionId): Promise<TopAssistsDTO | null> {
    const leagueId = String(competitionId);

    return TopAssists.findOne({ 'parameters.league': leagueId })
      .sort({ createdAt: -1 })
      .lean();
  }
}
