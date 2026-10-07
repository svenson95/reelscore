import type { TopAssistsDTO } from '@reelscore-sdk/models';

import { TopAssists } from './top-assists.model';
import { TopAssistsService } from './top-assists.service';

describe(TopAssistsService.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the newest document for the selected competition', async () => {
    const topAssists = { response: [] } as unknown as TopAssistsDTO;
    const lean = jest.fn().mockResolvedValue(topAssists);
    const sort = jest.fn().mockReturnValue({ lean });
    jest.spyOn(TopAssists, 'findOne').mockReturnValue({ sort } as never);

    const result = await new TopAssistsService().findByLeague(78);

    expect(TopAssists.findOne).toHaveBeenCalledWith({
      'parameters.league': '78',
    });
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(lean).toHaveBeenCalledTimes(1);
    expect(result).toBe(topAssists);
  });

  it('returns null when no document matches the competition', async () => {
    const lean = jest.fn().mockResolvedValue(null);
    const sort = jest.fn().mockReturnValue({ lean });
    jest.spyOn(TopAssists, 'findOne').mockReturnValue({ sort } as never);

    await expect(new TopAssistsService().findByLeague(404)).resolves.toBeNull();
  });
});
