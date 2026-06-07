import type { Signal, WritableSignal } from '@angular/core';
import { computed, Injectable, signal } from '@angular/core';

import type { CompetitionId } from '@lib/models';

export abstract class FilterService {
  abstract selectedCompetition: WritableSignal<CompetitionId | null>;
  abstract isFiltering: Signal<boolean>;
}

@Injectable()
export class AbstractedFilterService extends FilterService {
  selectedCompetition = signal<CompetitionId | null>(null);

  isFiltering = computed<boolean>(() => this.selectedCompetition() !== null);
}

export const FILTER_SERVICE_PROVIDER = {
  provide: FilterService,
  useClass: AbstractedFilterService,
};
