import type { FilterQuery } from 'mongoose';

import type { TopScorersDTO } from '@lib/models';

import { TopScorers } from './top-scorers.model';

export class TopScorersService {
  findByFilter(
    filter: FilterQuery<TopScorersDTO>
  ): Promise<TopScorersDTO | null> {
    return TopScorers.findOne(filter).sort({ createdAt: -1 }).lean();
  }
}
