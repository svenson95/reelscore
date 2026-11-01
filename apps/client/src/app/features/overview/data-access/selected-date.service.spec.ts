import { DOCUMENT, Location } from '@angular/common';
import { REQUEST } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import type { DateString } from '@reelscore-sdk/helpers';
import { getTodayDateString } from '@reelscore-sdk/helpers';
import type { CompetitionId } from '@reelscore-sdk/models';

import { FilterService } from './filter.service';
import { SelectedDateService } from './selected-date.service';

describe('SelectedDateService', () => {
  let service: SelectedDateService;
  let filterService: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectedDateService, FilterService],
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

  it('should initialize selected day from the server request URL', () => {
    TestBed.overrideProvider(REQUEST, {
      useValue: { url: 'https://reelscore.test/2026-08-15' },
    });

    service = TestBed.inject(SelectedDateService);

    expect(service.selectedDay()).toBe('2026-08-15');
  });

  it('should use Angular Location when no server request or document window exists', () => {
    const locationService = { path: jest.fn(() => '/2026-08-17') };
    TestBed.overrideProvider(DOCUMENT, {
      useValue: { defaultView: null },
    });
    TestBed.overrideProvider(Location, { useValue: locationService });

    service = TestBed.inject(SelectedDateService);

    expect(service.selectedDay()).toBe('2026-08-17');
    expect(locationService.path).toHaveBeenCalledTimes(1);
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
