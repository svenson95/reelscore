import { FilterQuery, SortOrder } from 'mongoose';

import { StandingsDTO } from '@lib/models';

import { Standings } from '../models';

export class StandingsService {
  async findByFilter(filter: FilterQuery<unknown>): Promise<StandingsDTO> {
    const sortOptions: { [key: string]: SortOrder } = { _id: -1 };
    const standings = await Standings.findOne(filter).sort(sortOptions).lean();
    return standings;
  }

  async findManyByFilter({
    filter,
    limit,
  }: {
    filter: FilterQuery<unknown>;
    limit: number;
  }): Promise<StandingsDTO[]> {
    const sortOptions: { [key: string]: SortOrder } = { _id: -1 };
    const standings = await Standings.find(filter)
      .sort(sortOptions)
      .limit(limit)
      .lean();
    return standings;
  }
}
