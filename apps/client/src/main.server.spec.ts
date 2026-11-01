import type { ApplicationRef, BootstrapContext } from '@angular/core';

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

jest.mock('@angular/platform-browser', () => ({
  ...jest.requireActual('@angular/platform-browser'),
  bootstrapApplication: jest.fn(),
}));

import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

import bootstrap from './main.server';

describe('server bootstrap', () => {
  it('bootstraps the app with the server config and request context', async () => {
    const context = {} as BootstrapContext;
    const application = {} as ApplicationRef;
    const bootstrapApplicationMock = jest.mocked(bootstrapApplication);

    bootstrapApplicationMock.mockResolvedValue(application);

    await expect(bootstrap(context)).resolves.toBe(application);

    expect(bootstrapApplicationMock).toHaveBeenCalledWith(
      AppComponent,
      config,
      context
    );
  });
});
