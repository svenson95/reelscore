import { Redis } from '@upstash/redis';

let redis: ReturnType<typeof Redis.fromEnv> | undefined;

export const getRedis = () => (redis ??= Redis.fromEnv());
