import request from 'supertest';

import { API_E2E_URL } from '../support/test-environment';

describe('API startup', () => {
  describe('GET /', () => {
    it('returns the API status and security headers', async () => {
      await request(API_E2E_URL)
        .get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect('X-Content-Type-Options', 'nosniff')
        .expect({
          status: 'ok',
          service: 'reelscore API',
        });
    });
  });
});
