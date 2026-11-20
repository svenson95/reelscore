import express from 'express';

import { MatchLineupsService } from './fixture-lineups.service';

export const fixtureLineups = express.Router();
const service = new MatchLineupsService();

fixtureLineups.get('', async (req, res, next) => {
  const fixtureId = req.query.fixture;

  if (typeof fixtureId !== 'string' || !/^\d+$/.test(fixtureId)) {
    return res.status(400).json({ message: 'Invalid fixture ID' });
  }

  try {
    const result = await service.findByFixture(fixtureId);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});
