import { computed, Injectable, signal } from '@angular/core';

import type { CompetitionId } from '@lib/models';

@Injectable()
export class FilterService {
  selectedCompetition = signal<CompetitionId | null>(null);

  isFiltering = computed<boolean>(() => this.selectedCompetition() !== null);
}
