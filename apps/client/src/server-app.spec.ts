jest.mock('express', () => {
  const mockExpress = jest.fn(() => ({
    use: jest.fn(),
    listen: jest.fn((_port: string | number, onListening: () => void) =>
      onListening()
    ),
  }));

  return {
    __esModule: true,
    default: Object.assign(mockExpress, { static: jest.fn(() => jest.fn()) }),
  };
});

jest.mock('@angular/ssr/node', () => ({
  AngularNodeAppEngine: jest.fn().mockImplementation(() => ({
    handle: jest.fn(),
  })),
  isMainModule: jest.fn(),
  writeResponseToNodeResponse: jest.fn(),
}));

import {
  AngularNodeAppEngine,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';

import express from 'express';

import { createServerApp } from './server-app';

type MockApplication = {
  use: jest.Mock;
  listen: jest.Mock;
};

type RequestMiddleware = (
  request: unknown,
  response: unknown,
  next: jest.Mock
) => Promise<void>;

describe('createServerApp', () => {
  const expressMock = jest.mocked(express) as jest.Mock & {
    static: jest.Mock;
  };
  const angularAppEngineMock = jest.mocked(
    AngularNodeAppEngine
  ) as jest.Mock & {
    mock: { results: Array<{ value: { handle: jest.Mock } }> };
  };
  const isMainModuleMock = jest.mocked(isMainModule);
  const angularApp = (): { handle: jest.Mock } =>
    angularAppEngineMock.mock.results[
      angularAppEngineMock.mock.results.length - 1
    ].value;
  const getRequestMiddleware = (app: MockApplication): RequestMiddleware =>
    app.use.mock.calls[1][1] as RequestMiddleware;

  const originalPort = process.env['PORT'];
  const originalPmId = process.env['pm_id'];

  beforeEach(() => {
    expressMock.mockClear();
    expressMock.static.mockClear();
    angularAppEngineMock.mockClear();
    isMainModuleMock.mockReset();
    jest.mocked(writeResponseToNodeResponse).mockReset();

    delete process.env['PORT'];
    delete process.env['pm_id'];
  });

  afterAll(() => {
    if (originalPort === undefined) {
      delete process.env['PORT'];
    } else {
      process.env['PORT'] = originalPort;
    }

    if (originalPmId === undefined) {
      delete process.env['pm_id'];
    } else {
      process.env['pm_id'] = originalPmId;
    }
  });

  it('serves browser assets and does not start a listener when imported', () => {
    isMainModuleMock.mockReturnValue(false);

    const app = createServerApp('file:///workspace/dist/server/server.mjs');

    expect(expressMock.static).toHaveBeenCalledWith('/workspace/dist/browser', {
      maxAge: '1y',
      index: false,
      redirect: false,
    });
    expect(app.use).toHaveBeenNthCalledWith(
      1,
      expressMock.static.mock.results[0].value
    );
    expect(app.listen).not.toHaveBeenCalled();
  });

  it('starts on the configured port when it is the main module', () => {
    process.env['PORT'] = '4321';
    isMainModuleMock.mockReturnValue(true);

    const app = createServerApp('file:///workspace/dist/server/server.mjs');

    expect(app.listen).toHaveBeenCalledWith('4321', expect.any(Function));
  });

  it('starts under PM2 when it is not the main module', () => {
    process.env['pm_id'] = '0';
    isMainModuleMock.mockReturnValue(false);

    const app = createServerApp('file:///workspace/dist/server/server.mjs');

    expect(app.listen).toHaveBeenCalledWith(4000, expect.any(Function));
  });

  it('writes rendered Angular responses to Node', async () => {
    isMainModuleMock.mockReturnValue(false);
    const app = createServerApp('file:///workspace/dist/server/server.mjs');
    const request = { url: '/' };
    const response = {};
    const next = jest.fn();
    const renderedResponse = {};
    angularApp().handle.mockResolvedValue(renderedResponse);

    await getRequestMiddleware(app)(request, response, next);

    expect(writeResponseToNodeResponse).toHaveBeenCalledWith(
      renderedResponse,
      response
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('delegates requests Angular does not handle', async () => {
    isMainModuleMock.mockReturnValue(false);
    const app = createServerApp('file:///workspace/dist/server/server.mjs');
    const next = jest.fn();
    angularApp().handle.mockResolvedValue(null);

    await getRequestMiddleware(app)({}, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(writeResponseToNodeResponse).not.toHaveBeenCalled();
  });

  it('delegates Angular rendering errors to Express', async () => {
    isMainModuleMock.mockReturnValue(false);
    const app = createServerApp('file:///workspace/dist/server/server.mjs');
    const error = new Error('SSR failed');
    const next = jest.fn();
    angularApp().handle.mockRejectedValue(error);

    await getRequestMiddleware(app)({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(writeResponseToNodeResponse).not.toHaveBeenCalled();
  });
});
