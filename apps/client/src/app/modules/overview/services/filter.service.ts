import { Injectable, signal, WritableSignal } from '@angular/core';

import { CompetitionId } from '@lib/models';

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
