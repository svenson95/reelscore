import type { handle } from '@upstash/realtime';
import type { Request, Response } from 'express';

import { getRealtime } from './livestream.helper';

type RealtimeHandler = ReturnType<typeof handle>;

const createRealtimeHandler = async (): Promise<RealtimeHandler> => {
  const [{ handle }, realtime] = await Promise.all([
    import('@upstash/realtime'),
    getRealtime(),
  ]);

  return handle({
    realtime,
  });
};

let realtimeHandlerPromise: Promise<RealtimeHandler> | null = null;

const getRealtimeHandler = (): Promise<RealtimeHandler> => {
  realtimeHandlerPromise ??= createRealtimeHandler();

  return realtimeHandlerPromise;
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
  const host = req.get('host');

  if (!host) {
    throw new Error('Missing host header');
  }

  const url = new URL(req.originalUrl, `${req.protocol}://${host}`);

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

const readResponseBody = async (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  res: Response,
  isDisconnected: () => boolean
): Promise<void> => {
  while (!isDisconnected()) {
    const result = await reader.read();

    if (result.done) {
      return;
    }

    res.write(Buffer.from(result.value));
  }
};

const endResponse = (
  reader: ReadableStreamDefaultReader<Uint8Array>,
  res: Response
): void => {
  reader.releaseLock();

  if (!res.writableEnded) {
    res.end();
  }
};

const pipeResponseBody = async (
  body: ReadableStream<Uint8Array>,
  res: Response,
  abortController: AbortController
): Promise<void> => {
  const reader = body.getReader();

  let disconnected = false;

  res.on('close', () => {
    disconnected = true;
    abortController.abort();
  });

  try {
    await readResponseBody(reader, res, () => disconnected);
  } catch (error) {
    if (!disconnected) {
      throw error;
    }
  } finally {
    reader.releaseLock();

    if (!res.writableEnded) {
      res.end();
    }
  }
};

export const handleRealtimeRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const realtimeHandler = await getRealtimeHandler();

  const abortController = new AbortController();

  const request = createWebRequest(req, abortController.signal);

  const response = await realtimeHandler(request);

  if (!response) {
    res.status(204).end();
    return;
  }

  applyWebResponseHeaders(response, res);

  if (!response.body) {
    res.end();
    return;
  }

  await pipeResponseBody(response.body, res, abortController);
};
