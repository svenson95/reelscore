export const getWeekDatesArray = (date: string): string[] => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const correctedDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Handle Sunday as the last day of the week
  startOfWeek.setDate(startOfWeek.getDate() - correctedDayOfWeek + 1); // Start of the week (Monday)
  const weekFixtures = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day.toISOString().split('T')[0];
  });

  return weekFixtures;
};
