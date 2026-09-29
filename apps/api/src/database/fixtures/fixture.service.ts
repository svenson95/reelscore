import type { ExtendedFixtureDTO, FixtureId } from '@lib/models';

import { Fixtures } from './fixtures.model';

export class FixtureService {
  async findById(fixtureId: FixtureId): Promise<ExtendedFixtureDTO | null> {
    return Fixtures.findOne({ 'fixture.id': fixtureId }).lean();
  }
}
