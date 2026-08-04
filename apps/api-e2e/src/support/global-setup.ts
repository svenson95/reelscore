import { spawn, type ChildProcess } from 'node:child_process';

import { API_E2E_PORT, API_E2E_URL } from './test-environment';

declare global {
  // eslint-disable-next-line no-var
  var __API_PROCESS__: ChildProcess | undefined;
}

const STARTUP_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 250;

const waitForApi = async (): Promise<void> => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < STARTUP_TIMEOUT_MS) {
    try {
      const response = await fetch(API_E2E_URL);

      if (response.ok) {
        return;
      }
    } catch {
      // the API is not available yet
    }

    await new Promise<void>((resolve) => {
      setTimeout(resolve, POLL_INTERVAL_MS);
    });
  }

  throw new Error(
    `API did not become available at ${API_E2E_URL} within ${STARTUP_TIMEOUT_MS}ms`
  );
};

export default async function globalSetup(): Promise<void> {
  console.log('\nStarting API for E2E tests...\n');

  const apiProcess = spawn('npx', ['nx', 'serve', 'api'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(API_E2E_PORT),
    },
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  globalThis.__API_PROCESS__ = apiProcess;

  try {
    await waitForApi();
  } catch (error) {
    apiProcess.kill('SIGTERM');
    throw error;
  }

  console.log(`API is available at ${API_E2E_URL}\n`);
}
