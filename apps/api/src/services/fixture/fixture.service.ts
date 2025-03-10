import mongoose from 'mongoose';

import { FixtureDTO, FixtureId } from '@lib/models';

import { Fixtures } from '../../models';

export class FixtureService {
  async findById(
    fixtureId: FixtureId
  ): Promise<mongoose.FlattenMaps<FixtureDTO>> {
    const fixture = await Fixtures.findOne({ 'fixture.id': fixtureId }).lean();
    return fixture;
  }
}
