import { FilterQuery } from 'mongoose';

import { StandingsDTO } from '@lib/models';

import { Standings } from '../models';

export class StandingsService {
  async findByFilter(filter: FilterQuery<unknown>): Promise<StandingsDTO> {
    return Standings.findOne(filter).sort({ createdAt: -1 }).lean();
  }
}
