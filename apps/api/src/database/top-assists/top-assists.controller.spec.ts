import type { TopAssistsDTO } from '@reelscore-sdk/models';

import {
  TopAssistsController,
  type TopAssistsReader,
} from './top-assists.controller';

describe(TopAssistsController.name, () => {
  it('requests top assists for the selected competition', async () => {
    const topAssists = { response: [] } as unknown as TopAssistsDTO;
    const reader: TopAssistsReader = {
      findByLeague: jest.fn().mockResolvedValue(topAssists),
    };

    const result = await new TopAssistsController(reader).getById(78);

    expect(reader.findByLeague).toHaveBeenCalledWith(78);
    expect(result).toBe(topAssists);
  });

  it('passes a missing document through as null', async () => {
    const reader: TopAssistsReader = {
      findByLeague: jest.fn().mockResolvedValue(null),
    };

    await expect(new TopAssistsController(reader).getById(404)).resolves.toBeNull();
  });
});
