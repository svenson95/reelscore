import {
  addDays,
  formatCalendarWeekKey,
  getWeekdayIndex,
  getWeekStartFromKey,
  type DateString,
} from '@lib/shared';

const EDGE_PREVIOUS_DAY_INDEX = 0;
const CURRENT_WEEK_START_INDEX = 1;
const EDGE_NEXT_DAY_INDEX = 8;

export function getSelectedDayData<T>(
  data: T[],
  cachedWeekKey: string | null,
  selectedDay: DateString
): T | undefined {
  if (cachedWeekKey === null) {
    return undefined;
  }

  const weekStart = getWeekStartFromKey(cachedWeekKey);

  if (selectedDay === addDays(weekStart, -1)) {
    return data[EDGE_PREVIOUS_DAY_INDEX];
  }

  if (selectedDay === addDays(weekStart, 7)) {
    return data[EDGE_NEXT_DAY_INDEX];
  }

  if (cachedWeekKey !== formatCalendarWeekKey(selectedDay)) {
    return undefined;
  }

  return data[CURRENT_WEEK_START_INDEX + getWeekdayIndex(selectedDay)];
}
