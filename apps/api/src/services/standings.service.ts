import { FilterQuery, SortOrder } from 'mongoose';

import { StandingsDTO } from '@lib/models';

import { Standings } from '../models';

export class StandingsService {
  async findByFilter(filter: FilterQuery<unknown>): Promise<StandingsDTO> {
    const sortOptions: { [key: string]: SortOrder } = { _id: -1 };
    const standings = await Standings.findOne(filter).sort(sortOptions).lean();
    return standings;
  }
}
