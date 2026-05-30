import { TEAM_NAME_SEARCH_VALUES } from './search-values.data';

export class SearchService {
  escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  createTeamSearchRegex(searchTerm: string): RegExp {
    const values = [searchTerm, ...this.getTeamNameSearchValues(searchTerm)];

    const regexValues = [...new Set(values)]
      .filter(Boolean)
      .map(this.escapeRegex);

    return new RegExp(regexValues.join('|'), 'i');
  }

  private getTeamNameSearchValues(searchTerm: string): string[] {
    const normalizedSearchTerm = this.normalizeSearchValue(searchTerm);

    if (!normalizedSearchTerm) {
      return [];
    }

    const TEAM_NAME_SEARCH_INDEX = Object.values(
      TEAM_NAME_SEARCH_VALUES
    ).reduce<Record<string, string[]>>((index, values) => {
      const uniqueValues = [...new Set(values)];

      for (const value of uniqueValues) {
        const key = this.normalizeSearchValue(value);

        index[key] = uniqueValues;
      }

      return index;
    }, {});

    const values = Object.entries(TEAM_NAME_SEARCH_INDEX)
      .filter(([key]) => key.includes(normalizedSearchTerm))
      .flatMap(([, values]) => values);

    return [...new Set(values)];
  }

  private normalizeSearchValue(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]/g, '');
  }
}
