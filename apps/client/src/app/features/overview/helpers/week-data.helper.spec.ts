import { formatCalendarWeekKey, type DateString } from '@lib/shared';

import { getSelectedDayData } from './week-data.helper';

describe('getSelectedDayData', () => {
  const cachedWeekDate: DateString = '2026-08-10';

  const weekData = [
    'previous-sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'next-monday',
  ];

  const cachedWeekKey = formatCalendarWeekKey(cachedWeekDate);

  it('should return data for a day within the cached week', () => {
    expect(getSelectedDayData(weekData, cachedWeekKey, '2026-08-13')).toBe(
      'thursday'
    );
  });

  it('should return the previous sunday edge data', () => {
    expect(getSelectedDayData(weekData, cachedWeekKey, '2026-08-09')).toBe(
      'previous-sunday'
    );
  });

  it('should return the next monday edge data', () => {
    expect(getSelectedDayData(weekData, cachedWeekKey, '2026-08-17')).toBe(
      'next-monday'
    );
  });

  it('should return undefined when no week is cached', () => {
    expect(getSelectedDayData(weekData, null, cachedWeekDate)).toBeUndefined();
  });

  it('should return undefined outside the cached edge-day range', () => {
    expect(
      getSelectedDayData(weekData, cachedWeekKey, '2026-08-18')
    ).toBeUndefined();
  });
});
