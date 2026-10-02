import express from 'express';
import request from 'supertest';

import { StandingsController } from './standings.controller';
import { standings } from './standings.route';

jest.mock('./standings.controller', () => ({
  StandingsController: jest.fn().mockImplementation(() => ({
    getByCompetitionAndDate: jest.fn().mockResolvedValue(null),
    getTopFive: jest.fn().mockResolvedValue(null),
    getFixtureStandings: jest.fn().mockResolvedValue(null),
  })),
}));

const app = express();
app.use(standings);

describe('Standings routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects standings-by-id requests without a date', async () => {
    await request(app)
      .get('/standings-by-id')
      .query({ competition: '39' })
      .expect(400)
      .expect({ message: 'Invalid date query parameter' });

    expect(StandingsController).not.toHaveBeenCalled();
  });

  it('loads standings-by-id when the date is valid', async () => {
    await request(app)
      .get('/standings-by-id')
      .query({ competition: '39', date: '2026-10-03' })
      .expect(200)
      .expect('null');

    expect(StandingsController).toHaveBeenCalledTimes(1);
  });

  it('rejects start-top-five requests without a date', async () => {
    await request(app)
      .get('/start-top-five')
      .expect(400)
      .expect({ message: 'Invalid date query parameter' });

    expect(StandingsController).not.toHaveBeenCalled();
  });

  it('loads the weekly top five when the date is valid', async () => {
    const response = await request(app)
      .get('/start-top-five')
      .query({ date: '2026-10-03' })
      .expect(200);

    expect(response.body).toHaveLength(7);
    expect(StandingsController).toHaveBeenCalledTimes(1);
  });

  it.each([{ date: '2026-10-03' }, { teamIds: '1,2' }])(
    'rejects match-standings requests with missing query fields',
    async (query) => {
      await request(app)
        .get('/match-standings')
        .query(query)
        .expect(400)
        .expect({ message: 'Invalid query parameters' });

      expect(StandingsController).not.toHaveBeenCalled();
    }
  );

  it('loads match standings when team IDs and date are valid', async () => {
    await request(app)
      .get('/match-standings')
      .query({ teamIds: '1,2', competition: '39', date: '2026-10-03' })
      .expect(200)
      .expect('null');

    expect(StandingsController).toHaveBeenCalledTimes(1);
  });
});
