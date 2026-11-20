import express from 'express';
import request from 'supertest';

import { fixtureLineups } from './fixture-lineups.route';
import { MatchLineupsService } from './fixture-lineups.service';

jest.mock('./fixture-lineups.service', () => ({
  MatchLineupsService: jest.fn().mockImplementation(() => ({
    findByFixture: jest.fn(),
  })),
}));

const app = express();
app.use(fixtureLineups);
app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    res.status(500).json({ message: error.message });
  }
);
const service = jest.mocked(MatchLineupsService).mock.results[0]
  .value as jest.Mocked<MatchLineupsService>;

describe('match lineups route', () => {
  beforeEach(() => jest.clearAllMocks());

  it.each(['', 'abc', '1.5'])(
    'rejects invalid fixture ID %s',
    async (fixture) => {
      await request(app).get('/').query({ fixture }).expect(400);
      expect(service.findByFixture).not.toHaveBeenCalled();
    }
  );

  it('returns the lineups and player statistics for the fixture', async () => {
    const result = { lineups: [], playerStatistics: [] };
    service.findByFixture.mockResolvedValue(result);

    await request(app).get('/').query({ fixture: '123' }).expect(200, result);
    expect(service.findByFixture).toHaveBeenCalledWith('123');
  });

  it('passes database failures to the error handler', async () => {
    service.findByFixture.mockRejectedValue(new Error('Database unavailable'));

    await request(app).get('/').query({ fixture: '123' }).expect(500);
  });
});
