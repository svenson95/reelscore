import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

jest.mock('node:fs/promises', () => ({
  cp: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
  rm: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

const { buildVercelOutput, runBuild } =
  require('./build-vercel-output.cjs') as {
    buildVercelOutput: () => Promise<void>;
    runBuild: (isMainModule?: boolean) => Promise<void>;
  };

describe('buildVercelOutput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('copies the application bundles and writes the Vercel function and routes', async () => {
    await buildVercelOutput();

    expect(rm).toHaveBeenCalledTimes(1);
    expect(mkdir).toHaveBeenCalledTimes(1);
    expect(cp).toHaveBeenCalledTimes(4);
    expect(writeFile).toHaveBeenCalledTimes(2);

    const configWrite = jest
      .mocked(writeFile)
      .mock.calls.find(([path]) => String(path).endsWith('/config.json'));

    if (!configWrite) {
      throw new Error('Expected the Vercel routing config to be written');
    }

    const vercelConfig = JSON.parse(String(configWrite[1])) as {
      routes: Array<{
        handle?: string;
        src: string;
        dest?: string;
        headers?: Record<string, string>;
        continue?: boolean;
      }>;
    };

    expect(vercelConfig.routes).toContainEqual({
      src: '^/ngsw-worker\\.js$',
      headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
      continue: true,
    });
    expect(vercelConfig.routes).toContainEqual({
      src: '^/ngsw\\.json$',
      headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
      continue: true,
    });
    expect(vercelConfig.routes).toContainEqual({
      src: '^/manifest\\.webmanifest$',
      headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' },
      continue: true,
    });
    const rootSsrRouteIndex = vercelConfig.routes.findIndex(
      (route) => route.src === '^/$' && route.dest === '/ssr'
    );
    const filesystemRouteIndex = vercelConfig.routes.findIndex(
      (route) => route.handle === 'filesystem'
    );
    const fallbackSsrRouteIndex = vercelConfig.routes.findIndex(
      (route) => route.src === '/(.*)' && route.dest === '/ssr'
    );

    expect(rootSsrRouteIndex).toBeGreaterThanOrEqual(0);
    expect(filesystemRouteIndex).toBeGreaterThan(rootSsrRouteIndex);
    expect(fallbackSsrRouteIndex).toBeGreaterThan(filesystemRouteIndex);
    expect(vercelConfig.routes[fallbackSsrRouteIndex]).not.toHaveProperty(
      'check'
    );

    const functionConfigWrite = jest
      .mocked(writeFile)
      .mock.calls.find(([path]) => String(path).endsWith('/.vc-config.json'));

    if (!functionConfigWrite) {
      throw new Error('Expected the Vercel function config to be written');
    }

    expect(JSON.parse(String(functionConfigWrite[1]))).toEqual({
      runtime: 'nodejs24.x',
      handler: 'index.cjs',
      launcherType: 'Nodejs',
    });
  });

  it('propagates filesystem failures to the executable entry point', async () => {
    const error = new Error('Vercel output could not be cleared');
    jest.mocked(rm).mockRejectedValueOnce(error);

    await expect(buildVercelOutput()).rejects.toBe(error);
  });

  it('runs the builder only for the executable entry point', async () => {
    await runBuild(false);

    expect(rm).not.toHaveBeenCalled();

    await runBuild(true);

    expect(rm).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledTimes(2);
  });

  it('logs a build failure and exits with a failure status', async () => {
    const error = new Error('Vercel output could not be cleared');
    const errorLog = jest.spyOn(console, 'error').mockImplementation();
    const exit = jest
      .spyOn(process, 'exit')
      .mockImplementation((() => undefined) as never);
    jest.mocked(rm).mockRejectedValueOnce(error);

    await runBuild(true);

    expect(errorLog).toHaveBeenCalledWith(error);
    expect(exit).toHaveBeenCalledWith(1);
    jest.restoreAllMocks();
  });
});
