import request from 'supertest';
import { API_E2E_URL } from '../support/test-environment';

describe('Fixtures API', () => {
  describe('GET /fixtures/by-date', () => {
    it('should return fixture groups for the requested week', async () => {
      const response = await request(API_E2E_URL)
        .get('/fixtures/by-date')
        .query({
          date: '2026-08-11',
        });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(7);

      for (const fixtures of response.body) {
        expect(fixtures).toBeInstanceOf(Array);
      }

      const fixtures = response.body.flat();

      for (const fixture of fixtures) {
        expect(fixture).toHaveProperty('fixture.id');
        expect(fixture).toHaveProperty('fixture.timestamp');
        expect(fixture).toHaveProperty('league.id');
        expect(fixture).toHaveProperty('teams.home');
        expect(fixture).toHaveProperty('teams.away');
      }
    });
  });
});
