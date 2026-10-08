import mongoose, { type FilterQuery } from 'mongoose';

import type { TopScorersDTO } from '@reelscore-sdk/models';

import { TopScorers } from './top-scorers.model';

export class TopScorersService {
  findByFilter(
    filter: FilterQuery<TopScorersDTO>
  ): Promise<TopScorersDTO | null> {
    const sanitizedFilter = mongoose.sanitizeFilter(filter);

    return TopScorers.findOne(sanitizedFilter).sort({ createdAt: -1 }).lean();
  }
}
