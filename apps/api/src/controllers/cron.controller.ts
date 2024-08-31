import { CronLogs } from '../models';

export const cron = async () => {
  const log = await CronLogs.findOne().sort({ _id: -1 }).lean();
  const requestCounter = log.requestCounter + 1;
  await CronLogs.create({ requestCounter, date: Date.now() });
};
