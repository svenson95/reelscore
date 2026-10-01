import { COMPETITION_ID } from '../constants/competition';

import { getSeason } from './season.helper';

describe('getSeason', () => {
  it('changes the regular season at midnight in Berlin on July 1', () => {
    const competitionId = COMPETITION_ID.GERMANY_BUNDESLIGA;

    const previousSeason = getSeason(competitionId, '2026-06-30T21:59:59Z');
    const nextSeason = getSeason(competitionId, '2026-06-30T22:00:00Z');

    expect(previousSeason).toBe(2025);
    expect(nextSeason).toBe(2026);
  });

  it('uses the configured tournament season instead of the regular cutoff', () => {
    const season = getSeason(
      COMPETITION_ID.INTERNATIONAL_WORLD_CUP,
      '2026-06-01T12:00:00Z'
    );

    expect(season).toBe(2026);
  });

  it('rejects regular seasons outside the supported range', () => {
    expect(() =>
      getSeason(COMPETITION_ID.GERMANY_BUNDESLIGA, '2022-08-01T12:00:00Z')
    ).toThrow('Unsupported competition season: 2022');
  });
});
