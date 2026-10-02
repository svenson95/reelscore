import express from 'express';
import request from 'supertest';

import { FixturesController } from './fixtures.controller';
import { fixtures } from './fixtures.route';

jest.mock('./fixtures.controller', () => ({
  FixtureController: jest.fn().mockImplementation(() => ({
    getByIdWithHighlights: jest.fn().mockResolvedValue(null),
    getLatest: jest.fn().mockResolvedValue(null),
  })),
  FixturesController: jest.fn().mockImplementation(() => ({
    getByDate: jest.fn().mockResolvedValue([]),
    competitionFixtures: jest.fn().mockResolvedValue([]),
  })),
}));

const app = express();
app.use(fixtures);

describe('GET /by-date', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects requests without a string date', async () => {
    await request(app)
      .get('/by-date')
      .expect(400)
      .expect({ message: 'Invalid date query parameter' });

    expect(FixturesController).not.toHaveBeenCalled();
  });

  it('loads fixtures for each day when given a valid date', async () => {
    const response = await request(app)
      .get('/by-date')
      .query({ date: '2026-10-03' })
      .expect(200);

    expect(response.body).toHaveLength(7);
    expect(FixturesController).toHaveBeenCalledTimes(1);
  });
});
