import { findDocument } from '../mongodb.helper';

import { FixtureStatisticsController } from './fixture-statistics.controller';
import { FixturesStatistics } from './fixture-statistics.model';
import { FixtureStatisticsService } from './fixture-statistics.service';

jest.mock('../mongodb.helper', () => ({
  ...jest.requireActual('../mongodb.helper'),
  findDocument: jest.fn(),
}));

describe('Fixture statistics lookup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(findDocument).mockResolvedValue(null);
  });

  it('looks up service data by the fixture ID', async () => {
    const fixtureId = '42';

    await expect(
      new FixtureStatisticsService().findById(fixtureId)
    ).resolves.toBeNull();

    expect(findDocument).toHaveBeenCalledWith(FixturesStatistics, fixtureId);
  });

  it('looks up controller data by the fixture ID', async () => {
    const fixtureId = '42';

    await expect(
      new FixtureStatisticsController().getById(fixtureId)
    ).resolves.toBeNull();

    expect(findDocument).toHaveBeenCalledWith(FixturesStatistics, fixtureId);
  });
});
