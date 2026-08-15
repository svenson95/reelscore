import { TestBed } from '@angular/core/testing';

import type { CompetitionId } from '@lib/models';

import { AbstractedFilterService, FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FilterService,
          useClass: AbstractedFilterService,
        },
      ],
    });

    service = TestBed.inject(FilterService);
  });

  it('should not be filtering initially', () => {
    expect(service.selectedCompetition()).toBeNull();
    expect(service.isFiltering()).toBe(false);
  });

  it('should be filtering when a competition is selected', () => {
    service.selectedCompetition.set(78 as CompetitionId);

    expect(service.isFiltering()).toBe(true);
  });

  it('should stop filtering when the competition is cleared', () => {
    service.selectedCompetition.set(78 as CompetitionId);

    service.selectedCompetition.set(null);

    expect(service.isFiltering()).toBe(false);
  });
});
