import type { Realtime } from '@upstash/realtime';
import { z } from 'zod';

import type {
  LiveFixtureEventsUpdateDTO,
  LiveFixtureUpdateDTO,
} from '@lib/models';

import { redis } from './redis.helper';

const realtimeSchema = {
  fixture: {
    updated: z.custom<LiveFixtureUpdateDTO>(),
    eventsUpdated: z.custom<LiveFixtureEventsUpdateDTO>(),
  },
};

type RealtimeInstance = Realtime<{
  redis: typeof redis;
  schema: typeof realtimeSchema;
  maxDurationSecs: number;
}>;

let realtimePromise: Promise<RealtimeInstance> | null = null;

export const getRealtime = (): Promise<RealtimeInstance> => {
  realtimePromise ??= import('@upstash/realtime').then(({ Realtime }) => {
    return new Realtime({
      redis,
      schema: realtimeSchema,
      maxDurationSecs: 300,
    });
  });

  return realtimePromise;
};
