const toDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getWeekDatesArray = (
  date: string,
  withEdgeDays = false
): string[] => {
  const selectedDate = new Date(date);

  const dayOfWeek = selectedDate.getDay();
  const SUNDAY = 0;
  const LAST_DAY_OF_WEEK = 7;
  const correctedDayOfWeek =
    dayOfWeek === SUNDAY ? LAST_DAY_OF_WEEK : dayOfWeek;

  const monday = addDays(selectedDate, -correctedDayOfWeek + 1);

  const startOffset = withEdgeDays ? -1 : 0;
  const numberOfDays = withEdgeDays ? 9 : 7;

  return Array.from({ length: numberOfDays }, (_, index) => {
    return toDateString(addDays(monday, startOffset + index));
  });
};
