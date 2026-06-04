import type { FlattenMaps } from 'mongoose';

import type { TopScorersDTO } from '@lib/models';

import { TopScorersService } from '../services';

export class TopScorersController {
  private topScorersService = new TopScorersService();

  async getById(competitionId: string): Promise<FlattenMaps<TopScorersDTO>> {
    const topScorers = await this.topScorersService.findByFilter({
      'parameters.league': competitionId,
    });

    return topScorers;
  }
}
