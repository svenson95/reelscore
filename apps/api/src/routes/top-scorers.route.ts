import express from 'express';

import { TopScorersController } from '../controllers';

export const topScorers = express.Router();

topScorers.get('/', async (req, res) => {
  const topScorersController = new TopScorersController();
  const competitionId = String(req.query.competition);
  const doc = await topScorersController.getById(competitionId);
  return res.json(doc);
});
