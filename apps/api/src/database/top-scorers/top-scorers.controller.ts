import type { TopScorersDTO } from '@reelscore-sdk/models';

import { TopScorersService } from './top-scorers.service';

export interface TopScorersReader {
  findByFilter(
    filter: Parameters<TopScorersService['findByFilter']>[0]
  ): Promise<TopScorersDTO | null>;
}

export class TopScorersController {
  constructor(
    private readonly topScorersService: TopScorersReader = new TopScorersService()
  ) {}

  getById(competitionId: string): Promise<TopScorersDTO | null> {
    return this.topScorersService.findByFilter({
      'parameters.league': competitionId,
    });
  }
}
