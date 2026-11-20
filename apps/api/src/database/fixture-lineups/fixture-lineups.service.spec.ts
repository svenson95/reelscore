import { MatchLineupsService } from './fixture-lineups.service';

describe('MatchLineupsService', () => {
  it.each(['', '1.5', '1e3', '9007199254740992'])(
    'rejects invalid fixture ID %s',
    async (fixtureId) => {
      const service = new MatchLineupsService();

      await expect(service.findByFixture(fixtureId)).rejects.toThrow(
        'Invalid fixture ID'
      );
    }
  );
});
