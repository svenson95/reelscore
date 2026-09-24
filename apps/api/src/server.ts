import 'dotenv/config';

import { app } from './app';

const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3000);

const server = app.listen(port, () => {
  console.log(`[server]: Server is running on port ${port}`);
});

server.on('error', console.error);
