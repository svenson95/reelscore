import { Router } from 'express';

import { handleRealtimeRequest } from './livestream-express.helper';

export const livestream = Router();

livestream.get('/', async (req, res, next) => {
  try {
    await handleRealtimeRequest(req, res);
  } catch (error) {
    next(error);
  }
});
