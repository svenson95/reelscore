import { SortOrder } from 'mongoose';

import { StandingsDTO } from '@lib/models';

import { Standings } from '../models';

export class StandingsService {
  async findByQuery(query: { [key: string]: unknown }): Promise<StandingsDTO> {
    const sortOptions: { [key: string]: SortOrder } = { _id: -1 };
    const standings = await Standings.findOne(query).sort(sortOptions).lean();
    return standings;
  }
}
