import type { FilterQuery } from 'mongoose';

import type { StandingsDTO } from '@lib/models';

import { Standings } from './standings.model';

export class StandingsService {
  findByFilter(
    filter: FilterQuery<StandingsDTO>,
    options?: {
      sort?: Record<string, 1 | -1>;
    }
  ): Promise<StandingsDTO | null> {
    return Standings.findOne(filter)
      .sort(options?.sort ?? {})
      .lean();
  }
}
