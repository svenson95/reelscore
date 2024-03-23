/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cors from 'cors';
import express from 'express';
import { DBHelper } from './helper/db.helper';

const app = express();
// app.use(express.json());
app.use(cors());
app.use(
  cors({
    origin: 'https://futbet.vercel.app/',
  })
);

// app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.on('error', console.error);

DBHelper.init();
