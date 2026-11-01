import { createNodeRequestHandler } from '@angular/ssr/node';

import { createServerApp } from './server-app';

const app = createServerApp(import.meta.url);

export const reqHandler = createNodeRequestHandler(app);
