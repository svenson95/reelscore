import type mongoose from 'mongoose';

import type { RapidEventsDTO } from '@reelscore-sdk/models';

import { findDocument } from './mongodb.helper';

describe(findDocument.name, () => {
  it('returns the matching document', async () => {
    const document = { response: [{ type: 'Goal' }] } as RapidEventsDTO;
    const lean = jest.fn().mockResolvedValue(document);
    const model = {
      findOne: jest.fn().mockReturnValue({ lean }),
    } as unknown as mongoose.Model<RapidEventsDTO>;
    const filter = { 'parameters.fixture': '42' };

    await expect(findDocument(model, filter)).resolves.toBe(document);
    expect(model.findOne).toHaveBeenCalledWith(filter);
    expect(lean).toHaveBeenCalledTimes(1);
  });

  it('wraps query operators in the filter to prevent selector injection', async () => {
    const lean = jest.fn().mockResolvedValue(null);
    const model = {
      findOne: jest.fn().mockReturnValue({ lean }),
    } as unknown as mongoose.Model<RapidEventsDTO>;
    const filter: mongoose.FilterQuery<RapidEventsDTO> = {
      'parameters.fixture': { $ne: null },
    };

    await findDocument(model, filter);

    expect(model.findOne).toHaveBeenCalledWith({
      'parameters.fixture': { $eq: { $ne: null } },
    });
  });

  it.each([
    ['no document', null],
    ['an empty response', { response: [] }],
  ])('returns null for %s', async (_, result) => {
    const lean = jest.fn().mockResolvedValue(result);
    const model = {
      findOne: jest.fn().mockReturnValue({ lean }),
    } as unknown as mongoose.Model<RapidEventsDTO>;

    await expect(findDocument(model, {})).resolves.toBeNull();
  });
});
