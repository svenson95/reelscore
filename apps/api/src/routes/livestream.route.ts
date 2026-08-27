import { Router } from 'express';

import { handleRealtimeRequest } from '../infrastructure';

export const livestream = Router();

livestream.get('/', async (req, res, next) => {
  try {
    await handleRealtimeRequest(req, res);
  } catch (error) {
    next(error);
  }
});
