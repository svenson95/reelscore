/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
dotenv.config();

import { cron } from './controllers/cron';
import { DBHelper } from './middleware';
import {
  fixtureAnalyses,
  fixtureEvaluations,
  fixtureEvents,
  fixtures,
  fixturesStatistics,
  standings,
} from './routes';

const app = express();
app.use('/cron', cron);
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:4200', 'https://reelscore.vercel.app'],
  })
);
app.use(helmet());

app.use('/standings', standings);
app.use('/fixtures', fixtures);
app.use('/fixture-statistics', fixturesStatistics);
// app.use('/players-statisticss', playersStatistics);
app.use('/fixture-events', fixtureEvents);
app.use('/fixture-evaluations', fixtureEvaluations);
app.use('/fixture-analyses', fixtureAnalyses);

DBHelper.init();

const port = process.env.PORT;
const server = app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.on('error', console.error);
