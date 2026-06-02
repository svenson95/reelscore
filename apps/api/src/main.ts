import 'dotenv/config';
import express from 'express';

import cors, { type CorsOptions } from 'cors';
import helmet from 'helmet';

import { DBHelper } from './middleware';
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

const app = express();

const port = Number(process.env.PORT) || 3003;

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
};

app.use(cors(corsOptions));

app.use(helmet());

app.use(express.json({ limit: '2mb' }));

app.get('/', (req: express.Request, res: express.Response) => {
  return res.json({
    status: 'ok',
    service: 'reelscore API',
  });
});

app.use('/standings', standings);
app.use('/top-scorers', topScorers);
app.use('/fixtures', fixtures);
app.use('/fixture-statistics', fixturesStatistics);
// app.use('/players-statisticss', playersStatistics);
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

    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
);

DBHelper.init()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}`);
    });

    server.on('error', console.error);
  })
  .catch((error) => {
    console.error('[server]: Failed to connect to database', error);
    process.exit(1);
  });
