import express from 'express';

import { TopScorersController } from './top-scorers.controller';

export const topScorers = express.Router();

topScorers.get('/', async (req, res) => {
  const competitionId = req.query.competition;
  if (typeof competitionId !== 'string') {
    return res.status(400).json({
      message: 'Invalid competition query parameter',
    });
  }

  const topScorersController = new TopScorersController();
  const doc = await topScorersController.getById(competitionId);
  return res.json(doc);
});
