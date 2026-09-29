import { handle } from '@upstash/realtime';
import type { Request, Response } from 'express';
import { once } from 'node:events';

import { getRealtime } from './livestream.helper';

type RealtimeHandler = ReturnType<typeof handle>;

const createRealtimeHandler = (): RealtimeHandler =>
  handle({
    realtime: getRealtime(),
  });

let realtimeHandler: RealtimeHandler | null = null;

const getRealtimeHandler = (): RealtimeHandler => {
  realtimeHandler ??= createRealtimeHandler();

  return realtimeHandler;
};

const appendRequestHeader = (
  headers: Headers,
  key: string,
  value: string | string[] | undefined
): void => {
  if (typeof value === 'string') {
    headers.set(key, value);
    return;
  }

  if (!value) {
    return;
  }

  for (const item of value) {
    headers.append(key, item);
  }
};

const createRequestHeaders = (req: Request): Headers => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    appendRequestHeader(headers, key, value);
  }

  return headers;
};

const createWebRequest = (
  req: Request,
  signal: AbortSignal
): globalThis.Request => {
  const protocol = req.get('x-forwarded-proto') ?? req.protocol;
  const host = req.get('x-forwarded-host') ?? req.get('host');

  if (!host) {
    throw new Error('Missing host header');
  }

  const url = new URL(req.originalUrl, `${protocol}://${host}`);

  return new globalThis.Request(url, {
    method: 'GET',
    headers: createRequestHeaders(req),
    signal,
  });
};

const applyWebResponseHeaders = (
  webResponse: globalThis.Response,
  res: Response
): void => {
  webResponse.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  res.status(webResponse.status);
  res.flushHeaders();
};

const pipeResponseBody = async (
  body: ReadableStream<Uint8Array>,
  res: Response,
  signal: AbortSignal
): Promise<void> => {
  const reader = body.getReader();
  const cancel = (): void => {
    void reader.cancel().catch(() => undefined);
  };
  signal.addEventListener('abort', cancel, { once: true });

  try {
    if (signal.aborted) {
      cancel();
      return;
    }
    while (!signal.aborted) {
      const result = await reader.read();
      if (result.done || signal.aborted) {
        break;
      }
      if (!res.write(Buffer.from(result.value))) {
        await once(res, 'drain', { signal });
      }
    }
  } catch (error) {
    if (!signal.aborted) {
      throw error;
    }
  } finally {
    signal.removeEventListener('abort', cancel);
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
    if (!res.writableEnded && !res.destroyed) {
      res.end();
    }
  }
};

const isRealtimeEnabled = (): boolean =>
  process.env['VERCEL_ENV'] !== 'production' &&
  process.env['ENABLE_REALTIME'] === 'true';

export const handleRealtimeRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!isRealtimeEnabled()) {
    res.status(204).end();
    return;
  }

  const realtimeHandler = getRealtimeHandler();

  const abortController = new AbortController();

  const onClose = (): void => abortController.abort();
  res.once('close', onClose);

  try {
    const request = createWebRequest(req, abortController.signal);
    const response = await realtimeHandler(request);

    if (abortController.signal.aborted || res.destroyed) {
      if (response) {
        await response.body?.cancel();
      }
      return;
    }
    if (!response) {
      res.status(204).end();
      return;
    }
    applyWebResponseHeaders(response, res);
    if (!response.body) {
      res.end();
      return;
    }
    await pipeResponseBody(response.body, res, abortController.signal);
  } catch (error) {
    if (!abortController.signal.aborted) {
      throw error;
    }
  } finally {
    res.off('close', onClose);
    abortController.abort();
  }
};
