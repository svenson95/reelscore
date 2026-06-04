import type { FilterQuery } from 'mongoose';

import type { TopScorersDTO } from '@lib/models';

import { TopScorers } from '../models';

export class TopScorersService {
  async findByFilter(filter: FilterQuery<unknown>): Promise<TopScorersDTO> {
    return TopScorers.findOne(filter).sort({ createdAt: -1 }).lean();
  }
}
