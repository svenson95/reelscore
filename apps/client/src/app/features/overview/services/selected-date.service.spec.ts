import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SELECT_COMPETITION_DATA, type CompetitionData } from '@app/shared';

import { FilterService } from './filter.service';
import {
  SELECTED_DATE_SERVICE_PROVIDER,
  SelectedDateService,
} from './selected-date.service';

describe('SelectedDateService', () => {
  let service: SelectedDateService;

  const selectedCompetition = signal<CompetitionData | null>(null);

  let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    jest.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [
        SELECTED_DATE_SERVICE_PROVIDER,
        {
          provide: FilterService,
          useValue: {
            selectedCompetition,
          },
        },
      ],
    });

    selectedCompetition.set(null);
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    jest.useRealTimers();
    window.history.pushState({}, '', '/');
  });

  const createService = (): SelectedDateService =>
    TestBed.inject(SelectedDateService);

  it('should initialize selectedDay from URL', () => {
    window.history.pushState({}, '', '/2026-08-10');

    service = createService();

    expect(service.selectedDay()).toBe('2026-08-10');
  });

  it('should initialize selectedDay with today if URL does not contain a date', () => {
    jest.setSystemTime(new Date('2026-08-14T08:00:00Z'));
    window.history.pushState({}, '', '/');

    service = createService();

    expect(service.selectedDay()).toBe('2026-08-14');
  });

  it('should initialize selectedDay with today if URL contains an invalid date', () => {
    jest.setSystemTime(new Date('2026-08-14T08:00:00Z'));
    window.history.pushState({}, '', '/invalid-date');

    service = createService();

    expect(service.selectedDay()).toBe('2026-08-14');
  });

  it('should update selectedDay', () => {
    window.history.pushState({}, '', '/2026-08-14');

    service = createService();

    service.setSelectedDay('2026-08-15');

    expect(service.selectedDay()).toBe('2026-08-15');
  });

  it('should reset competition filter when selected day changes', () => {
    window.history.pushState({}, '', '/2026-08-14');

    service = createService();

    selectedCompetition.set(SELECT_COMPETITION_DATA[0].competitions[0]);

    service.setSelectedDay('2026-08-15');

    expect(selectedCompetition()).toBeNull();
  });

  it('should use the next calendar day in Europe/Berlin when UTC time is still the previous day', () => {
    jest.setSystemTime(new Date('2026-08-14T23:30:00Z'));
    window.history.pushState({}, '', '/');

    service = createService();

    expect(service.selectedDay()).toBe('2026-08-15');
  });
});
