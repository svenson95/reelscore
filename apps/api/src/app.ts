import express from 'express';

import cors, { type CorsOptions } from 'cors';
import helmet from 'helmet';

import { databaseMiddleware } from './middleware';
import {
  fixtureAnalyses,
  fixtureEvaluations,
  fixtureEvents,
  fixtures,
  fixturesStatistics,
  search,
  standings,
  topScorers,
} from './routes';

export const app = express();

const allowedOrigins = [
  'http://localhost:4200',
  'https://reelscore.vercel.app',
].filter((origin): origin is string => Boolean(origin));

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
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
app.use('/fixtures', fixtures);
app.use('/fixture-statistics', fixturesStatistics);
app.use('/fixture-events', fixtureEvents);
app.use('/fixture-evaluations', fixtureEvaluations);
app.use('/fixture-analyses', fixtureAnalyses);
app.use('/search', search);

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
