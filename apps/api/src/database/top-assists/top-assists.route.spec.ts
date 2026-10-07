import express from 'express';
import request from 'supertest';

import { TopAssistsController } from './top-assists.controller';
import { topAssists } from './top-assists.route';

jest.mock('./top-assists.controller', () => ({
  TopAssistsController: jest.fn().mockImplementation(() => ({
    getById: jest.fn().mockResolvedValue(null),
  })),
}));

const app = express();
app.use(topAssists);

describe('GET / top assists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects requests without a numeric competition ID', async () => {
    await request(app)
      .get('/')
      .query({ competition: '78abc' })
      .expect(400)
      .expect({ message: 'Invalid competition query parameter' });

    expect(TopAssistsController).not.toHaveBeenCalled();
  });

  it('rejects NoSQL operators in the competition parameter', async () => {
    await request(app)
      .get('/')
      .query({ 'competition[$ne]': '0' })
      .expect(400)
      .expect({ message: 'Invalid competition query parameter' });

    expect(TopAssistsController).not.toHaveBeenCalled();
  });

  it('rejects competition IDs outside the safe integer range', async () => {
    await request(app)
      .get('/')
      .query({ competition: '9007199254740992' })
      .expect(400)
      .expect({ message: 'Invalid competition query parameter' });

    expect(TopAssistsController).not.toHaveBeenCalled();
  });

  it('loads top assists for a valid competition ID', async () => {
    await request(app)
      .get('/')
      .query({ competition: '78' })
      .expect(200)
      .expect('null');

    expect(TopAssistsController).toHaveBeenCalledTimes(1);
  });
});
