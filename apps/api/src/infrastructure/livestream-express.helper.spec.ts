import type { Request, Response } from 'express';
import { EventEmitter } from 'node:events';

const handler = jest.fn();
jest.mock('@upstash/realtime', () => ({ handle: () => handler }));
jest.mock('./livestream.helper', () => ({ getRealtime: jest.fn() }));

import { handleRealtimeRequest } from './livestream-express.helper';

class TestResponse extends EventEmitter {
  destroyed = false;
  writableEnded = false;
  status = jest.fn(() => this);
  end = jest.fn(() => {
    this.writableEnded = true;
  });
  setHeader = jest.fn();
  flushHeaders = jest.fn();
  write = jest.fn(() => false);
}

const request = {
  headers: {},
  protocol: 'http',
  originalUrl: '/livestream',
  get: (name: string): string | undefined =>
    name === 'host' ? 'localhost' : undefined,
} as Request;

describe('handleRealtimeRequest', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ENABLE_REALTIME: 'true',
      VERCEL_ENV: 'preview',
    };
    handler.mockReset();
  });
  afterEach(() => {
    process.env = originalEnv;
  });

  it('disables production streams even when the feature flag is enabled', async () => {
    process.env['VERCEL_ENV'] = 'production';
    const res = new TestResponse();
    await handleRealtimeRequest(request, res as unknown as Response);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(handler).not.toHaveBeenCalled();
  });

  it('cancels a stream when the client closes during backpressure', async () => {
    const cancel = jest.fn();
    const body = new ReadableStream<Uint8Array>({
      start(controller): void {
        controller.enqueue(new Uint8Array([1]));
      },
      cancel,
    });
    handler.mockResolvedValue(new globalThis.Response(body));
    const res = new TestResponse();
    const pending = handleRealtimeRequest(request, res as unknown as Response);
    await new Promise<void>((resolve) => setImmediate(resolve));
    expect(res.write).toHaveBeenCalledTimes(1);
    res.destroyed = true;
    res.emit('close');
    await pending;
    expect(cancel).toHaveBeenCalled();
    expect(res.listenerCount('drain')).toBe(0);
    expect(res.listenerCount('close')).toBe(0);
  });

  it('aborts while waiting for upstream response and cancels its late body', async () => {
    let resolveResponse!: (response: globalThis.Response) => void;
    handler.mockImplementation(
      () =>
        new Promise<globalThis.Response>((resolve) => {
          resolveResponse = resolve;
        })
    );
    const res = new TestResponse();
    const pending = handleRealtimeRequest(request, res as unknown as Response);
    res.destroyed = true;
    res.emit('close');
    expect(
      (handler.mock.calls[0][0] as globalThis.Request).signal.aborted
    ).toBe(true);
    const cancel = jest.fn();
    resolveResponse(new globalThis.Response(new ReadableStream({ cancel })));
    await pending;
    expect(cancel).toHaveBeenCalled();
    expect(res.flushHeaders).not.toHaveBeenCalled();
  });
});
