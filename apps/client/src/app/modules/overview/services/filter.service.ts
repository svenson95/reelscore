import type { WritableSignal } from '@angular/core';
import { Injectable, signal } from '@angular/core';

import type { CompetitionId } from '@lib/models';

export abstract class FilterService {
  abstract selectedCompetition: WritableSignal<CompetitionId | null>;
}

@Injectable()
export class AbstractedFilterService extends FilterService {
  selectedCompetition = signal<CompetitionId | null>(null);
}

export const FILTER_SERVICE_PROVIDER = {
  provide: FilterService,
  useClass: AbstractedFilterService,
};
