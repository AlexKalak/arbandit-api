import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';
export const redisProviders: Provider[] = [
  {
    provide: REDIS_CLIENT,
    useFactory: (): Redis => {
      const client = new Redis('localhost:6379');

      return client;
    },
  },
];
