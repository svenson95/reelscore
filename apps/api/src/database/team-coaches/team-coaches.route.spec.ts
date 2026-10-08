import express from 'express';
import request from 'supertest';

import { TeamCoachesController } from './team-coaches.controller';
import { teamCoaches } from './team-coaches.route';

jest.mock('./team-coaches.controller', () => ({
  TeamCoachesController: jest.fn().mockImplementation(() => ({
    getByTeamIds: jest.fn().mockResolvedValue([]),
  })),
}));

const app = express();
app.use(teamCoaches);

describe('GET / team coaches', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects missing, repeated, and nonnumeric team IDs', async () => {
    const invalidQueries = [
      {},
      { teams: '85' },
      { teams: '85,42,7' },
      { teams: '85,abc' },
    ];

    for (const query of invalidQueries) {
      await request(app)
        .get('/')
        .query(query)
        .expect(400)
        .expect({ message: 'Invalid teams query parameter' });
    }

    expect(TeamCoachesController).not.toHaveBeenCalled();
  });

  it('returns coaches for two valid team IDs', async () => {
    const response = await request(app)
      .get('/')
      .query({ teams: '85,42' })
      .expect(200);

    expect(response.body).toEqual({ data: [], length: 0 });
    expect(TeamCoachesController).toHaveBeenCalledTimes(1);
    const controller = jest.mocked(TeamCoachesController).mock.results[0].value;

    expect(controller.getByTeamIds).toHaveBeenCalledWith(['85', '42']);
  });

  it('delegates controller failures to Express error handling', async () => {
    jest.mocked(TeamCoachesController).mockImplementationOnce(
      () =>
        ({
          getByTeamIds: jest
            .fn()
            .mockRejectedValue(new Error('Database error')),
        } as never)
    );
    app.use(
      (
        error: Error,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ) => {
        void _next;
        res.status(500).json({ message: error.message });
      }
    );

    await request(app)
      .get('/')
      .query({ teams: '85,42' })
      .expect(500)
      .expect({ message: 'Database error' });
  });
});
