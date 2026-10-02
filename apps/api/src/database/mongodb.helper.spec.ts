import type mongoose from 'mongoose';

import type { FixtureIdParameter, RapidEventsDTO } from '@reelscore-sdk/models';

import { findDocument } from './mongodb.helper';

describe(findDocument.name, () => {
  it('returns the matching document', async () => {
    const document = { response: [{ type: 'Goal' }] } as RapidEventsDTO;
    const lean = jest.fn().mockResolvedValue(document);
    const model = {
      findOne: jest.fn().mockReturnValue({ lean }),
    } as unknown as mongoose.Model<RapidEventsDTO>;
    await expect(findDocument(model, '42')).resolves.toBe(document);
    expect(model.findOne).toHaveBeenCalledWith({ 'parameters.fixture': '42' });
    expect(lean).toHaveBeenCalledTimes(1);
  });

  it('rejects object selectors instead of using them as fixture ids', async () => {
    const lean = jest.fn().mockResolvedValue(null);
    const model = {
      findOne: jest.fn().mockReturnValue({ lean }),
    } as unknown as mongoose.Model<RapidEventsDTO>;
    const maliciousFixtureId = { $ne: null } as unknown as FixtureIdParameter;

    await expect(findDocument(model, maliciousFixtureId)).resolves.toBeNull();

    expect(model.findOne).not.toHaveBeenCalled();
  });

  it.each([
    ['no document', null],
    ['an empty response', { response: [] }],
  ])('returns null for %s', async (_, result) => {
    const lean = jest.fn().mockResolvedValue(result);
    const model = {
      findOne: jest.fn().mockReturnValue({ lean }),
    } as unknown as mongoose.Model<RapidEventsDTO>;

    await expect(findDocument(model, '42')).resolves.toBeNull();
    expect(model.findOne).toHaveBeenCalledWith({ 'parameters.fixture': '42' });
  });
});
