import moment from 'moment';

export type DateString = string; // format YYYY-MM-DD
export type CalendarWeek = number;

export const APP_TIMEZONE = 'Europe/Berlin';

export const formatBerlinDateString = (value: string | Date): DateString => {
  const parts = new Intl.DateTimeFormat('de-DE', {
    timeZone: APP_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(value));

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('Could not format Berlin date');
  }

  return `${year}-${month}-${day}`;
};

export const getTodayDateString = (): DateString =>
  formatBerlinDateString(new Date());

export const formatCalendarWeekKey = (value: string | Date): string => {
  const date = moment.utc(value).tz(APP_TIMEZONE);
  const week = String(date.isoWeek()).padStart(2, '0');

  return `${date.isoWeekYear()}-W${week}`;
};

export const getWeekdayIndex = (dateString: string): number => {
  const [year, month, day] = dateString.split('-').map(Number);

  const date = new Date(year, month - 1, day);

  return (date.getDay() + 6) % 7;
};
