import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { getTodayDateString, type DateString } from '@lib/shared';

import { DateNavigationService } from './date-navigation.service';
import { SelectedDateService } from './selected-date.service';

describe('DateNavigationService', () => {
  const initialDate: DateString = '2026-08-10';
  const sameWeekDate: DateString = '2026-08-12';
  const nextWeekDate: DateString = '2026-08-17';

  const selectedDay = signal<DateString>(initialDate);

  const selectedDateServiceMock = {
    selectedDay: selectedDay.asReadonly(),
    setSelectedDay: jest.fn(),
  };

  const routerMock = {
    url: `/${initialDate}`,
    navigate: jest.fn(),
  };

  let service: DateNavigationService;

  beforeEach(() => {
    selectedDay.set(initialDate);

    selectedDateServiceMock.setSelectedDay.mockClear();
    routerMock.navigate.mockClear();
    routerMock.url = `/${initialDate}`;

    TestBed.configureTestingModule({
      providers: [
        DateNavigationService,
        {
          provide: SelectedDateService,
          useValue: selectedDateServiceMock,
        },
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });

    service = TestBed.inject(DateNavigationService);
    TestBed.tick();
  });

  describe('weekdays', () => {
    it('should expose all seven days of the selected week', () => {
      expect(service.weekdays()).toEqual([
        '2026-08-10',
        '2026-08-11',
        '2026-08-12',
        '2026-08-13',
        '2026-08-14',
        '2026-08-15',
        '2026-08-16',
      ]);
    });

    it('should keep the weekdays reference when selected day changes within the same week', () => {
      const weekdays = service.weekdays();

      selectedDay.set(sameWeekDate);

      expect(service.weekdays()).toBe(weekdays);
    });

    it('should create new weekdays when selected day changes to another week', () => {
      const weekdays = service.weekdays();

      selectedDay.set(nextWeekDate);

      const nextWeekdays = service.weekdays();

      expect(nextWeekdays).not.toBe(weekdays);
      expect(nextWeekdays).toEqual([
        '2026-08-17',
        '2026-08-18',
        '2026-08-19',
        '2026-08-20',
        '2026-08-21',
        '2026-08-22',
        '2026-08-23',
      ]);
    });
  });

  describe('selected tab', () => {
    it('should expose the selected weekday index', () => {
      expect(service.selectedTabIndex()).toBe(0);

      selectedDay.set('2026-08-13');

      expect(service.selectedTabIndex()).toBe(3);

      selectedDay.set('2026-08-16');

      expect(service.selectedTabIndex()).toBe(6);
    });

    it('should update the selected tab without recreating the week', () => {
      const weekdays = service.weekdays();

      selectedDay.set(sameWeekDate);

      expect(service.selectedTabIndex()).toBe(2);
      expect(service.weekdays()).toBe(weekdays);
    });
  });

  describe('calendar week', () => {
    it('should keep the calendar week key stable within the same week', () => {
      const weekKey = service.calendarWeekKey();

      selectedDay.set(sameWeekDate);

      expect(service.calendarWeekKey()).toBe(weekKey);
    });

    it('should change the calendar week key when another week is selected', () => {
      const weekKey = service.calendarWeekKey();

      selectedDay.set(nextWeekDate);

      expect(service.calendarWeekKey()).not.toBe(weekKey);
    });
  });

  describe('today', () => {
    it('should expose today', () => {
      expect(service.today()).toBe(getTodayDateString());
    });

    it('should report whether the selected day is today', () => {
      selectedDay.set(service.today());

      expect(service.isToday()).toBe(true);

      selectedDay.set(initialDate);

      expect(service.isToday()).toBe(initialDate === service.today());
    });

    it('should reset the selected day to today', () => {
      service.resetToday();

      expect(selectedDateServiceMock.setSelectedDay).toHaveBeenCalledTimes(1);
      expect(selectedDateServiceMock.setSelectedDay).toHaveBeenCalledWith(
        service.today()
      );
    });
  });

  describe('route synchronization', () => {
    it('should not navigate when the route already matches the selected day', () => {
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('should navigate when selected day changes', () => {
      selectedDay.set(sameWeekDate);
      TestBed.tick();

      expect(routerMock.navigate).toHaveBeenCalledTimes(1);
      expect(routerMock.navigate).toHaveBeenCalledWith([sameWeekDate]);
    });

    it('should not navigate when the route already matches a newly selected day', () => {
      routerMock.url = `/${sameWeekDate}`;

      selectedDay.set(sameWeekDate);
      TestBed.tick();

      expect(routerMock.navigate).not.toHaveBeenCalled();
    });
  });
});
