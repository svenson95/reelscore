import type { TopScorersDTO } from '@reelscore-sdk/models';

import {
  TopScorersController,
  type TopScorersReader,
} from './top-scorers.controller';

describe(TopScorersController.name, () => {
  it('requests top scorers for the selected competition', async () => {
    const topScorers = { response: [] } as unknown as TopScorersDTO;
    const reader: TopScorersReader = {
      findByFilter: jest.fn().mockResolvedValue(topScorers),
    };

    const result = await new TopScorersController(reader).getById('78');

    expect(reader.findByFilter).toHaveBeenCalledWith({
      'parameters.league': '78',
    });
    expect(result).toBe(topScorers);
  });

  it('passes a missing document through as null', async () => {
    const reader: TopScorersReader = {
      findByFilter: jest.fn().mockResolvedValue(null),
    };

    await expect(
      new TopScorersController(reader).getById('404')
    ).resolves.toBeNull();
  });
});
