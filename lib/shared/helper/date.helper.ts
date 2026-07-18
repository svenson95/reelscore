import moment from 'moment-timezone';

export const TIMEZONE = 'Europe/Berlin' as const;

export type DateString = string; // format YYYY-MM-DD
export type CalendarWeek = number;

export const getNow = () => moment().tz(TIMEZONE);
export const getDateInTimezone = (date: string) => moment.parseZone(date);

export const formatDateToYearMonthDay = (value: string | Date): DateString => {
  const parts = new Intl.DateTimeFormat('de-DE', {
    timeZone: TIMEZONE,
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
  formatDateToYearMonthDay(new Date());

export const formatCalendarWeekKey = (value: string | Date): string => {
  const date = moment.utc(value).tz(TIMEZONE);
  const week = String(date.isoWeek()).padStart(2, '0');

  return `${date.isoWeekYear()}-W${week}`;
};

export const getWeekdayIndex = (dateString: string): number => {
  const [year, month, day] = dateString.split('-').map(Number);

  const date = new Date(year, month - 1, day);

  return (date.getDay() + 6) % 7;
};

export const startOfWeek = (day: string) =>
  moment.tz(day, 'YYYY-MM-DD', TIMEZONE).startOf('isoWeek');

const FIXTURE_TIME_FORMATTER = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: TIMEZONE,
});

export const formatFixtureTime = (
  timestamp: number | null | undefined
): string => {
  if (timestamp == null) {
    return '';
  }

  const date = new Date(timestamp * 1000);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return FIXTURE_TIME_FORMATTER.format(date);
};
