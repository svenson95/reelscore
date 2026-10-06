import cors, { type CorsOptions } from 'cors';
import express from 'express';
import helmet from 'helmet';

import {
  databaseMiddleware,
  fixtureEvents,
  fixtures,
  fixturesStatistics,
  standings,
  topAssists,
  topScorers,
} from './database';
import { fixtureAnalyses } from './fixture-analyses';
import { fixtureEvaluations } from './fixture-evaluations';
import { livestream } from './livestream';
import { search } from './search';

export const app = express();

const allowedOrigins = new Set([
  'http://localhost:4200',
  'https://reelscore.vercel.app',
]);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(helmet());
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => {
  return res.json({
    status: 'ok',
    service: 'reelscore API',
  });
});

app.use(databaseMiddleware);

app.use('/standings', standings);
app.use('/top-scorers', topScorers);
app.use('/top-assists', topAssists);
app.use('/fixtures', fixtures);
app.use('/fixture-statistics', fixturesStatistics);
app.use('/fixture-events', fixtureEvents);
app.use('/fixture-evaluations', fixtureEvaluations);
app.use('/fixture-analyses', fixtureAnalyses);
app.use('/search', search);
app.use('/livestream', livestream);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use(
  (
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('[server]: Unhandled error', error);

    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({
      message: 'Internal server error',
    });
  }
);
