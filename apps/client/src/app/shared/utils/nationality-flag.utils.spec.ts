import { getNationalityFlagUrl } from './nationality-flag.utils';

describe('getNationalityFlagUrl', () => {
  it('returns the API-Football flag URL for a nationality', () => {
    expect(getNationalityFlagUrl('Norway')).toBe(
      'https://media.api-sports.io/flags/no.svg'
    );
  });

  it('normalizes whitespace and casing', () => {
    expect(getNationalityFlagUrl('  UNITED STATES ')).toBe(
      'https://media.api-sports.io/flags/us.svg'
    );
  });

  it('returns an empty URL for missing or unsupported nationalities', () => {
    expect(getNationalityFlagUrl('')).toBe('');
    expect(getNationalityFlagUrl(undefined)).toBe('');
    expect(getNationalityFlagUrl('Unknown country')).toBe('');
  });
});
