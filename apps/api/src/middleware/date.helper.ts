export const getWeekDatesArray = (
  date: string,
  withEdgeDays = false
): string[] => {
  const startOfWeek = new Date(date);
  const day = startOfWeek.getDay();
  const SUNDAY = 0;
  const LAST_DAY_OF_WEEK = 7;
  const correctedDayOfWeek = day === SUNDAY ? LAST_DAY_OF_WEEK : day;

  startOfWeek.setDate(startOfWeek.getDate() - correctedDayOfWeek + 1);

  const startOffset = withEdgeDays ? -1 : 0;
  const length = withEdgeDays ? 9 : 7;

  return Array.from({ length }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + startOffset + i);

    return day.toISOString().split('T')[0];
  });
};
