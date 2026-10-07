import express from 'express';

import { TopAssistsController } from './top-assists.controller';

export const topAssists = express.Router();

topAssists.get('/', async (req, res) => {
  const competitionParameter = req.query.competition;
  if (
    typeof competitionParameter !== 'string' ||
    !/^\d+$/.test(competitionParameter)
  ) {
    return res.status(400).json({
      message: 'Invalid competition query parameter',
    });
  }

  const competitionId = Number(competitionParameter);
  if (!Number.isSafeInteger(competitionId) || competitionId <= 0) {
    return res.status(400).json({
      message: 'Invalid competition query parameter',
    });
  }

  const topAssistsController = new TopAssistsController();
  const doc = await topAssistsController.getById(competitionId);
  return res.json(doc);
});
