import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  AngularNodeAppEngine,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';

export const createServerApp = (serverEntryUrl: string): express.Express => {
  const serverDistFolder = dirname(fileURLToPath(serverEntryUrl));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const app = express();
  const angularApp = new AngularNodeAppEngine();

  app.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      redirect: false,
    })
  );

  app.use('/**', (request, response, next) =>
    angularApp
      .handle(request)
      .then((renderedResponse) =>
        renderedResponse
          ? writeResponseToNodeResponse(renderedResponse, response)
          : next()
      )
      .catch(next)
  );

  if (isMainModule(serverEntryUrl) || process.env['pm_id']) {
    const port = process.env['PORT'] || 4000;
    app.listen(port, () => {
      console.log(`Node Express server listening on http://localhost:${port}`);
    });
  }

  return app;
};
