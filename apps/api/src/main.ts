import 'dotenv/config';

import { app } from './app';

const port = Number(process.env.PORT) || 3003;

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.on('error', console.error);
