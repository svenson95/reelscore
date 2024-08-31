import mongoose from 'mongoose';

import { CronLogDTO } from '@lib/models';

const cronLogSchema = new mongoose.Schema<CronLogDTO>({
  requestCounter: Number,
  date: Date,
});

export const CronLogs = mongoose.model('cron-logs', cronLogSchema);
