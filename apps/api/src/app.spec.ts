import request from 'supertest';

import { DBHelper } from './database/database.helper';

import { app } from './app';

jest.mock('./livestream/livestream-express.helper', () => ({
  handleRealtimeRequest: jest.fn(),
}));

jest.mock('./livestream/livestream.helper', () => ({
  getRealtime: jest.fn(),
}));

describe('crawler policy', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('serves the Meta crawler policy as plain text without accessing the database', async () => {
    const connectToDatabase = jest
      .spyOn(DBHelper, 'init')
      .mockRejectedValue(new Error('Database is unavailable'));

    await request(app)
      .get('/robots.txt')
      .expect(200)
      .expect('Content-Type', /text\/plain/)
      .expect('User-agent: meta-externalagent\nDisallow: /\n');

    expect(connectToDatabase).not.toHaveBeenCalled();
  });
});
