import { CronLogs } from '../models';

export async function GET(request: Request) {
  const log = await CronLogs.findOne().sort({ _id: -1 }).lean();
  const requestCounter = log === null ? 1 : log.requestCounter + 1;
  await CronLogs.create({ requestCounter, date: Date.now() });

  return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}
