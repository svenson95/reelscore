import { TestBed } from '@angular/core/testing';

import type { CompetitionId } from '@lib/models';
import type { DateString } from '@lib/shared';
import { getTodayDateString } from '@lib/shared';

import { AbstractedFilterService, FilterService } from './filter.service';
import {
  AbstractedSelectedDateService,
  SelectedDateService,
} from './selected-date.service';

describe('SelectedDateService', () => {
  let service: SelectedDateService;
  let filterService: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SelectedDateService,
          useClass: AbstractedSelectedDateService,
        },
        {
          provide: FilterService,
          useClass: AbstractedFilterService,
        },
      ],
    });
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
    jest.restoreAllMocks();
  });

  it('should initialize selected day from the URL', () => {
    window.history.replaceState({}, '', '/2026-08-15');

    service = TestBed.inject(SelectedDateService);

    expect(service.selectedDay()).toBe('2026-08-15');
  });

  it('should use today when the URL does not contain a valid date', () => {
    jest.spyOn(console, 'warn').mockImplementation();

    window.history.replaceState({}, '', '/overview');

    service = TestBed.inject(SelectedDateService);

    expect(service.selectedDay()).toBe(getTodayDateString());
  });

  it('should update selected day and reset selected competition', () => {
    window.history.replaceState({}, '', '/2026-08-15');

    service = TestBed.inject(SelectedDateService);
    filterService = TestBed.inject(FilterService);

    filterService.selectedCompetition.set(78 as CompetitionId);

    service.setSelectedDay('2026-08-16' as DateString);

    expect(service.selectedDay()).toBe('2026-08-16');
    expect(filterService.selectedCompetition()).toBeNull();
  });
});
