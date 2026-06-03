import 'dotenv/config';

import { app } from './app';
import { DBHelper } from './middleware';

const port = Number(process.env.PORT) || 3003;

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
