import { CronLogs } from '../models';

export const cron = async () => {
  await createLog();

  const second = 1000;
  const minute = 60 * second;
  setTimeout(() => createLog(), minute);
  setTimeout(() => createLog(), minute * 2);
};

const createLog = async () => {
  const log = await CronLogs.findOne().sort({ _id: -1 }).lean();
  const requestCounter = log === null ? 1 : log.requestCounter + 1;
  await CronLogs.create({ requestCounter, date: Date.now() });
};
