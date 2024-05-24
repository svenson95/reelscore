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
import { fixtures, standings } from './routes';

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:4200', 'https://futbet.vercel.app'],
  })
);
app.use(helmet());

// app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  return res.send(Buffer.from('<h1>Futbet API working...</h1>'));
});

app.use('/standings', standings);
app.use('/fixtures', fixtures);
// app.use('/fixtures-statistics', fixturesStatistics);

DBHelper.init();

const port = process.env.PORT;
const server = app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.on('error', console.error);
