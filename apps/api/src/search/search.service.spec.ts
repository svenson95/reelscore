import { SearchService } from './search.service';

describe('SearchService', () => {
  it('escapes regular expression characters in search terms', () => {
    const service = new SearchService();

    expect(service.escapeRegex('Club (A+B)')).toBe('Club \\(A\\+B\\)');
  });
});
