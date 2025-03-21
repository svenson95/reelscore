import mongoose from 'mongoose';

import { ExtendedFixtureDTO, FixtureId } from '@lib/models';

import { Fixtures } from '../../models';

export class FixtureService {
  async findById(
    fixtureId: FixtureId
  ): Promise<mongoose.FlattenMaps<ExtendedFixtureDTO>> {
    const fixture = await Fixtures.findOne({ 'fixture.id': fixtureId }).lean();
    return fixture;
  }
}
