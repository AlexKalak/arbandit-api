import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  RedisV2SwapsStreamSwap,
  RedisV2SwapsStreamSwapToModel,
} from 'src/database/entities/redis-entities';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.providers';
import { SWAP_EVENTS } from 'src/common/events/swap.events';

type XReadGroupResponse = [string, [string, string[]][]][] | null;

@Injectable()
export class V2SwapsListenerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT)
    private redisProvider: Redis,
    private eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(V2SwapsListenerService.name);

  private group = 'nest_group';
  private consumer = `consumer-${process.pid}`;

  private listeningSteams = {
    v2streams: {
      '1_v2swaps': true,
    },
  };

  onModuleInit() {
    for (const stream of Object.keys(this.listeningSteams.v2streams)) {
      this.listenToV2SwapsStream(stream);
    }
  }

  onModuleDestroy() {
    for (const stream of Object.keys(this.listeningSteams.v2streams)) {
      this.listeningSteams.v2streams[stream] = false;
    }
  }

  private async listenToV2SwapsStream(stream: string) {
    try {
      await this.redisProvider.xgroup('CREATE', stream, this.group, '0');
    } catch (e) {
      this.logger.error(e);
      // if (e.message.includes('BUSYGROUP')) throw e;
    }

    this.logger.log('Listening for new Redis stream messages...');

    while (this.listeningSteams.v2streams[stream]) {
      const response = (await this.redisProvider.xreadgroup(
        'GROUP',
        this.group,
        this.consumer,
        'COUNT',
        100,
        'BLOCK',
        300,
        'STREAMS',
        stream,
        '>',
      )) as XReadGroupResponse;

      if (response) {
        console.log('GOt response: ', response);
        for (const [streamName, messages] of response) {
          for (const [id, message] of messages) {
            const fields: Record<string, string> = {};
            for (let i = 0; i < message.length; i += 2) {
              fields[message[i]] = message[i + 1];
            }
            console.log(`${streamName} -> ${id}`, fields);
            try {
              const rawSwap: RedisV2SwapsStreamSwap = JSON.parse(
                fields.swap,
              ) as RedisV2SwapsStreamSwap;

              // console.log('raw swap: ', rawSwap);

              const swap = RedisV2SwapsStreamSwapToModel(rawSwap);

              console.log('new swap: ', swap.blockNumber);

              this.eventEmitter.emit(SWAP_EVENTS.V2SwapAdded, swap);

              console.log('Start awaiting');
              this.redisProvider.xack(stream, this.group, id);
              console.log('END awaiting');
            } catch {
              continue;
            }
          }
        }
      }
    }
  }
}
