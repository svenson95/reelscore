export const toIsoString = (date: Date): DateString => {
  const tzo = -date.getTimezoneOffset();
  const dif = tzo >= 0 ? '+' : '-';
  const pad = (num: number) => (num < 10 ? '0' : '') + num;

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' +
    pad(Math.abs(tzo) % 60)
  );
};

export const getMondayFromDate = (date: Date): Date => {
  const newDate = new Date(date);
  const dayOfWeek = newDate.getDay();
  const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  newDate.setDate(newDate.getDate() + difference);
  return newDate;
};

export const createWeekDaysArray = (date: Date): DateString[] => {
  return Array(7)
    .fill(date)
    .map((d, i) => {
      const day = new Date(d.setDate(d.getDate() - d.getDay() + i));
      const isSunday = d.getDay() === 0;
      if (isSunday) {
        day.setDate(day.getDate() + 7);
      }
      return toIsoString(day);
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
export type CalenderWeek = number;

export const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
export const TODAY_ISO_STRING = toIsoString(TODAY);
export const TODAY_DATE_STRING = toIsoString(TODAY).slice(0, 10);

export const LAST_YEAR_START = new Date(TODAY.getFullYear() - 1, 0, 1);
export const NEXT_YEAR_END = new Date(TODAY.getFullYear() + 1, 11, 31);

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
  return dayData.reduce(
    (acc: T[][], standings: T) => {
      const idx = getWeekDayIndex(date);
      acc[idx] = acc[idx] ? [...acc[idx], standings] : [];
      return acc;
    },
    Array.from({ length: 7 }, () => [])
  );
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
