import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  RedisV3SwapsStreamSwap,
  RedisV3SwapsStreamSwapToModel,
} from 'src/database/entities/redis-entities';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.providers';
import { SWAP_EVENTS } from 'src/common/events/swap.events';

type XReadGroupResponse = [string, [string, string[]][]][] | null;

@Injectable()
export class V3SwapsListenerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT)
    private redisProvider: Redis,
    private eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(V3SwapsListenerService.name);
  private listening = true;

  onModuleInit() {
    this.listenToStream();
  }

  onModuleDestroy() {
    this.listening = false;
  }

  private async listenToStream() {
    const stream = '1_v3swaps';
    const group = 'nest_group';
    const consumer = `consumer-${process.pid}`;

    try {
      await this.redisProvider.xgroup('CREATE', stream, group, '0');
    } catch (e) {
      this.logger.error(e);
      // if (e.message.includes('BUSYGROUP')) throw e;
    }

    this.logger.log('Listening for new Redis stream messages...');

    while (this.listening) {
      this.logger.log('waitin');
      const response = (await this.redisProvider.xreadgroup(
        'GROUP',
        group,
        consumer,
        'COUNT',
        10,
        'BLOCK',
        5000,
        'STREAMS',
        stream,
        '>',
      )) as XReadGroupResponse;

      if (response) {
        for (const [streamName, messages] of response) {
          for (const [id, message] of messages) {
            const fields: Record<string, string> = {};
            for (let i = 0; i < message.length; i += 2) {
              fields[message[i]] = message[i + 1];
            }
            console.log(`${streamName} -> ${id}`, fields);
            try {
              const rawSwap: RedisV3SwapsStreamSwap = JSON.parse(
                fields.swap,
              ) as RedisV3SwapsStreamSwap;

              console.log('raw swap: ', rawSwap);

              const swap = RedisV3SwapsStreamSwapToModel(rawSwap);

              console.log('new swap: ', swap);

              this.eventEmitter.emit(SWAP_EVENTS.SwapAdded, swap);

              await this.redisProvider.xack(stream, group, id);
            } catch {
              continue;
            }
          }
        }
      }
    }
  }
}
