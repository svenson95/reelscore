import { Realtime } from '@upstash/realtime';
import { z } from 'zod';

import type {
  LiveFixtureEventsUpdateDTO,
  LiveFixtureUpdateDTO,
} from '@lib/models';

import { getRedis } from './redis.helper';

const realtimeSchema = {
  fixture: {
    updated: z.custom<LiveFixtureUpdateDTO>(),
    eventsUpdated: z.custom<LiveFixtureEventsUpdateDTO>(),
  },
};

const createRealtime = () =>
  new Realtime({
    redis: getRedis(),
    schema: realtimeSchema,
    maxDurationSecs: 300,
  });

type RealtimeInstance = ReturnType<typeof createRealtime>;

let realtime: RealtimeInstance | null = null;

export const getRealtime = (): RealtimeInstance => {
  realtime ??= createRealtime();

  return realtime;
};
