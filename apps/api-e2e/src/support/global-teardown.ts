import type { ChildProcess } from 'node:child_process';

declare global {
  // eslint-disable-next-line no-var
  var __API_PROCESS__: ChildProcess | undefined;
}

export default async function globalTeardown(): Promise<void> {
  console.log('\nStopping API...\n');

  const apiProcess = globalThis.__API_PROCESS__;

  if (!apiProcess || apiProcess.killed) {
    return;
  }

  apiProcess.kill('SIGTERM');
}
