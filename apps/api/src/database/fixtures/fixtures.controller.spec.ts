import { STATUS_VALUES_PLAYING } from '@reelscore-sdk/constants';
import type { CompetitionId } from '@reelscore-sdk/models';

import { FixturesController } from './fixtures.controller';
import { Fixtures } from './fixtures.model';

describe('FixturesController competition fixtures', () => {
  afterEach(() => jest.restoreAllMocks());

  it('includes live matches in the recent results query', async () => {
    const lean = jest.fn().mockResolvedValue([]);
    const sort = jest.fn().mockReturnValue({ lean });
    const find = jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort } as never);

    await new FixturesController().competitionFixtures(
      'last',
      10 as CompetitionId,
      false
    );

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.arrayContaining([
          expect.objectContaining({
            'fixture.status.short': { $in: STATUS_VALUES_PLAYING },
          }),
        ]),
      })
    );
  });

  it('excludes live matches from the upcoming fixtures query', async () => {
    const lean = jest.fn().mockResolvedValue([]);
    const sort = jest.fn().mockReturnValue({ lean });
    const find = jest
      .spyOn(Fixtures, 'find')
      .mockReturnValue({ sort } as never);

    await new FixturesController().competitionFixtures(
      'next',
      10 as CompetitionId,
      false
    );

    expect(find).toHaveBeenCalledWith(
      expect.objectContaining({
        $and: expect.arrayContaining([
          expect.objectContaining({
            'fixture.status.short': {
              $nin: expect.arrayContaining(STATUS_VALUES_PLAYING),
            },
          }),
        ]),
      })
    );
  });
});
