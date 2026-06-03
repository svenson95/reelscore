import 'dotenv/config';

import { app } from './app';
import { DBHelper } from './middleware';

let dbReady: Promise<unknown> | null = null;

const ensureDatabase = (): Promise<unknown> => {
  dbReady ??= DBHelper.init();
  return dbReady;
};

export default async function handler(
  req: Parameters<typeof app>[0],
  res: Parameters<typeof app>[1]
) {
  try {
    await ensureDatabase();
    return app(req, res);
  } catch (error) {
    console.error('[server]: Failed to handle request', error);

    return res.status(500).json({
      message: '[server]: Internal server error while DB init',
    });
  }
}
