import express from 'express';
import request from 'supertest';

import { TopScorersController } from './top-scorers.controller';
import { topScorers } from './top-scorers.route';

jest.mock('./top-scorers.controller', () => ({
  TopScorersController: jest.fn().mockImplementation(() => ({
    getById: jest.fn().mockResolvedValue(null),
  })),
}));

const app = express();
app.use(topScorers);

describe('GET / top scorers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects requests without a string competition ID', async () => {
    await request(app)
      .get('/')
      .expect(400)
      .expect({ message: 'Invalid competition query parameter' });

    expect(TopScorersController).not.toHaveBeenCalled();
  });

  it('loads top scorers for a valid competition ID', async () => {
    await request(app)
      .get('/')
      .query({ competition: '39' })
      .expect(200)
      .expect('null');

    expect(TopScorersController).toHaveBeenCalledTimes(1);
  });
});
