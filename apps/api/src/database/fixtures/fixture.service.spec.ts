import type { ExtendedFixtureDTO } from '@lib/models';

import { Fixtures } from './fixtures.model';
import { FixtureService } from './fixture.service';

describe(FixtureService.name, () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('finds a fixture by its API fixture id', async () => {
    const fixture = { fixture: { id: 42 } } as ExtendedFixtureDTO;
    const lean = jest.fn().mockResolvedValue(fixture);
    jest.spyOn(Fixtures, 'findOne').mockReturnValue({ lean } as never);

    const result = await new FixtureService().findById(42);

    expect(Fixtures.findOne).toHaveBeenCalledWith({ 'fixture.id': 42 });
    expect(lean).toHaveBeenCalledTimes(1);
    expect(result).toBe(fixture);
  });

  it('returns null when the fixture does not exist', async () => {
    const lean = jest.fn().mockResolvedValue(null);
    jest.spyOn(Fixtures, 'findOne').mockReturnValue({ lean } as never);

    await expect(new FixtureService().findById(404)).resolves.toBeNull();
  });
});
