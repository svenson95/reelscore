import express from 'express';
import request from 'supertest';

import { FixtureController } from './fixture.controller';
import { FixturesController } from './fixtures.controller';
import { fixtures } from './fixtures.route';

jest.mock('./fixture.controller', () => ({
  FixtureController: jest.fn().mockImplementation(() => ({
    getByIdWithHighlights: jest.fn().mockResolvedValue(null),
    getLatest: jest.fn().mockResolvedValue(null),
    getHeadToHead: jest.fn().mockResolvedValue([]),
  })),
}));

jest.mock('./fixtures.controller', () => ({
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

describe('GET /head-to-head', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects an invalid fixture id', async () => {
    await request(app)
      .get('/head-to-head')
      .query({ fixture: 'not-a-number' })
      .expect(400)
      .expect({ message: 'Invalid fixture query parameter' });

    expect(FixtureController).not.toHaveBeenCalled();

    await request(app)
      .get('/head-to-head')
      .expect(400)
      .expect({ message: 'Invalid fixture query parameter' });

    await request(app)
      .get('/head-to-head')
      .query({ fixture: '-42' })
      .expect(400)
      .expect({ message: 'Invalid fixture query parameter' });
  });

  it('returns previous direct encounters for a valid fixture id', async () => {
    await request(app)
      .get('/head-to-head')
      .query({ fixture: '42' })
      .expect(200)
      .expect([]);

    expect(FixtureController).toHaveBeenCalledTimes(1);
  });

  it('delegates controller errors to Express error handling', async () => {
    const error = new Error('Head-to-head lookup failed');
    jest.mocked(FixtureController).mockImplementationOnce(
      () =>
        ({
          getHeadToHead: jest.fn().mockRejectedValue(error),
        } as never)
    );

    await request(app)
      .get('/head-to-head')
      .query({ fixture: '42' })
      .expect(500);
  });
});
