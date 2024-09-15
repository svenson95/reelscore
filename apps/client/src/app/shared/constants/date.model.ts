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
  const day = date.getDay();
  const newDate = new Date(date);
  const difference = day === 0 ? 6 : day - 1;
  newDate.setDate(newDate.getDate() - difference);
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
