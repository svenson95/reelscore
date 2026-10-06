import type { TopAssistsDTO } from '@reelscore-sdk/models';

import { TopAssistsService } from './top-assists.service';

export interface TopAssistsReader {
  findByFilter(
    filter: Parameters<TopAssistsService['findByFilter']>[0]
  ): Promise<TopAssistsDTO | null>;
}

export class TopAssistsController {
  constructor(
    private readonly topAssistsService: TopAssistsReader = new TopAssistsService()
  ) {}

  getById(competitionId: string): Promise<TopAssistsDTO | null> {
    return this.topAssistsService.findByFilter({
      'parameters.league': competitionId,
    });
  }
}
