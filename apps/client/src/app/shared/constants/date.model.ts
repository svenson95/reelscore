import moment from 'moment-timezone';

export const createWeekDaysArray = (date: Date): DateString[] => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const correctedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() - correctedDayOfWeek + 1);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return moment(day).tz('Europe/Berlin').format('YYYY-MM-DD');
  });
};

export const isSameDay = (a: Date, b: Date): boolean => {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
};

export type DateString = string;
export type CalendarWeek = number;

export const TODAY_ISO_STRING = moment().tz('Europe/Berlin').toISOString();
export const TODAY_DATE_STRING = moment(TODAY_ISO_STRING)
  .clone()
  .format('YYYY-MM-DD');

export const LAST_YEAR_START = new Date(
  moment().toDate().getFullYear() - 1,
  0,
  1
);
export const NEXT_YEAR_END = new Date(
  moment().toDate().getFullYear() + 1,
  11,
  31
);

export const getWeekDayIndex = (date: DateString): number => {
  const index = new Date(date).getDay() - 1;
  const fixedSundayValue = index === -1 ? 6 : index;
  return fixedSundayValue;
};

export const initWeekDataArray = <T>({
  dayData,
  date,
}: {
  dayData: T[];
  date: DateString;
}): T[][] => {
  const weekData: T[][] = Array.from({ length: 7 }, () => []);
  const idx = getWeekDayIndex(date);
  weekData[idx] = dayData;
  return weekData;
};

export const getMissingDays = ({
  date,
}: {
  date: DateString;
}): DateString[] => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const correctedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() - correctedDayOfWeek + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day.toISOString().split('T')[0];
  });
};
