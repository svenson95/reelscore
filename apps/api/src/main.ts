/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
dotenv.config();

import { DBHelper } from './middleware';
import { standings } from './routes';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: 'https://futbet.vercel.app',
  })
);

// app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use('/standings', standings);
// app.use('/fixtures', fixtures);
// app.use('/fixtures-statistics', fixturesStatistics);

const port = process.env.PORT;
const server = app.listen(port, async () => {
  DBHelper.init();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.on('error', console.error);
