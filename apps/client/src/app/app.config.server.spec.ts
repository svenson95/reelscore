jest.mock('@angular/common/locales/de', () => ({ default: {} }));
jest.mock('@angular/common', () => ({
  ...jest.requireActual('@angular/common'),
  registerLocaleData: jest.fn(),
}));

jest.mock('@angular/ssr', () => ({
  RenderMode: { Client: 'client', Server: 'server' },
  provideServerRendering: jest.fn((routeProvider) => ({ routeProvider })),
  withRoutes: jest.fn((routes) => ({ routes })),
}));

import { RenderMode } from '@angular/ssr';

import { config } from './app.config.server';
import { serverRoutes } from './app.routes.server';

describe('server application configuration', () => {
  it('adds Angular server rendering providers to the shared app config', () => {
    expect(config.providers).toBeDefined();
    expect(config.providers?.length).toBeGreaterThan(0);
  });

  it('keeps match and competition pages client-rendered', () => {
    expect(serverRoutes).toEqual([
      {
        path: ':date/:competitionUrl/:fixtureId',
        renderMode: RenderMode.Client,
      },
      {
        path: 'competition/:competitionUrl',
        renderMode: RenderMode.Client,
      },
      {
        path: '**',
        renderMode: RenderMode.Server,
      },
    ]);
  });
});
