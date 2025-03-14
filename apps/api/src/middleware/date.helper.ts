export const getWeekDatesArray = (date: string): string[] => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Start of the week (Monday)
  const weekFixtures = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day.toISOString().split('T')[0];
  });

  return weekFixtures;
};
