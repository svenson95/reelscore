import express from 'express';

import { TeamCoachesController } from './team-coaches.controller';

export const teamCoaches = express.Router();

teamCoaches.get('/', async (req, res, next) => {
  const teamIdsParameter = req.query.teams;
  if (typeof teamIdsParameter !== 'string') {
    return res.status(400).json({
      message: 'Invalid teams query parameter',
    });
  }

  const teamIds = teamIdsParameter.split(',');
  if (teamIds.length !== 2 || teamIds.some((teamId) => !/^\d+$/.test(teamId))) {
    return res.status(400).json({
      message: 'Invalid teams query parameter',
    });
  }

  try {
    const controller = new TeamCoachesController();
    const coaches = await controller.getByTeamIds(teamIds);

    return res.json({
      data: coaches,
      length: coaches.length,
    });
  } catch (error) {
    return next(error);
  }
});
