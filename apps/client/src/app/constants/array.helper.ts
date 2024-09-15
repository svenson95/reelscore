type index = number;

export const moveItem = <T>(data: T[], from: index, to: index): T[] => {
  const item = data[from];
  data.splice(from, 1);
  data.splice(to, 0, item);
  return data;
};
