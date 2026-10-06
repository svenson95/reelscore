import type { FilterQuery } from 'mongoose';

import type { TopAssistsDTO } from '@reelscore-sdk/models';

import { TopAssists } from './top-assists.model';

export class TopAssistsService {
  findByFilter(
    filter: FilterQuery<TopAssistsDTO>
  ): Promise<TopAssistsDTO | null> {
    return TopAssists.findOne(filter).sort({ createdAt: -1 }).lean();
  }
}
