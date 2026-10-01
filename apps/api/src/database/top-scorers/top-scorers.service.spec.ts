import type { TopScorersDTO } from '@reelscore-sdk/models';

import { TopScorers } from './top-scorers.model';
import { TopScorersService } from './top-scorers.service';

describe(TopScorersService.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the newest document matching the filter', async () => {
    const topScorers = { response: [] } as unknown as TopScorersDTO;
    const lean = jest.fn().mockResolvedValue(topScorers);
    const sort = jest.fn().mockReturnValue({ lean });
    jest.spyOn(TopScorers, 'findOne').mockReturnValue({ sort } as never);
    const filter = { 'parameters.league': '78' };

    const result = await new TopScorersService().findByFilter(filter);

    expect(TopScorers.findOne).toHaveBeenCalledWith(filter);
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(lean).toHaveBeenCalledTimes(1);
    expect(result).toBe(topScorers);
  });

  it('returns null when no document matches the filter', async () => {
    const lean = jest.fn().mockResolvedValue(null);
    const sort = jest.fn().mockReturnValue({ lean });
    jest.spyOn(TopScorers, 'findOne').mockReturnValue({ sort } as never);

    await expect(
      new TopScorersService().findByFilter({ 'parameters.league': '404' })
    ).resolves.toBeNull();
  });
});
