import { Redis } from '@upstash/redis';

let redis: Redis | undefined;

export const getRedis = (): Redis => {
  redis ??= Redis.fromEnv();

  return redis;
};
