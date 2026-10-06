import express from 'express';

import { TopAssistsController } from './top-assists.controller';

export const topAssists = express.Router();

topAssists.get('/', async (req, res) => {
  const competitionId = req.query.competition;
  if (typeof competitionId !== 'string') {
    return res.status(400).json({
      message: 'Invalid competition query parameter',
    });
  }

  const topAssistsController = new TopAssistsController();
  const doc = await topAssistsController.getById(competitionId);
  return res.json(doc);
});
