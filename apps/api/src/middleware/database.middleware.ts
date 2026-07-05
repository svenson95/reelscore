import type { NextFunction, Request, Response } from 'express';

import { DBHelper } from '../helper/db.helper';

export const databaseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await DBHelper.init();
    next();
  } catch (error) {
    console.error('[server]: Failed to connect to database', error);

    res.status(503).json({
      message: 'Database temporarily unavailable',
    });
  }
};
