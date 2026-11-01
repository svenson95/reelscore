type RequestHandler = (
  request: unknown,
  response: unknown
) => unknown | Promise<unknown>;

type AngularRequestHandlerFactory = (
  loadHandler?: () => Promise<RequestHandler>
) => (request: unknown, response: unknown) => Promise<unknown>;

type LoadAngularRequestHandler = (
  importServer?: () => Promise<{ reqHandler: RequestHandler }>
) => Promise<RequestHandler>;

const { createAngularRequestHandler, loadAngularRequestHandler } =
  require('./ssr-handler.cjs') as {
    createAngularRequestHandler: AngularRequestHandlerFactory;
    loadAngularRequestHandler: LoadAngularRequestHandler;
  };

describe('Vercel SSR request handler', () => {
  it('loads the Angular handler on demand and reuses it for later requests', async () => {
    const angularHandler = jest.fn().mockResolvedValue(undefined);
    const loadHandler = jest.fn().mockResolvedValue(angularHandler);
    const handleRequest = createAngularRequestHandler(loadHandler);
    const firstRequest = { url: '/' };
    const firstResponse = {};
    const secondRequest = { url: '/2026-11-01' };
    const secondResponse = {};

    await handleRequest(firstRequest, firstResponse);
    await handleRequest(secondRequest, secondResponse);

    expect(loadHandler).toHaveBeenCalledTimes(1);
    expect(angularHandler).toHaveBeenNthCalledWith(
      1,
      firstRequest,
      firstResponse
    );
    expect(angularHandler).toHaveBeenNthCalledWith(
      2,
      secondRequest,
      secondResponse
    );
  });

  it('propagates handler loading errors', async () => {
    const error = new Error('Angular server bundle could not be loaded');
    const handleRequest = createAngularRequestHandler(() =>
      Promise.reject(error)
    );

    await expect(handleRequest({}, {})).rejects.toBe(error);
  });

  it('resolves the request handler exported by the Angular server bundle', async () => {
    const angularHandler = jest.fn();
    const importServer = jest.fn().mockResolvedValue({
      reqHandler: angularHandler,
    });

    await expect(loadAngularRequestHandler(importServer)).resolves.toBe(
      angularHandler
    );
    expect(importServer).toHaveBeenCalledTimes(1);
  });

  it('reports when the built Angular server bundle is not present', async () => {
    await expect(loadAngularRequestHandler()).rejects.toThrow();
  });
});
