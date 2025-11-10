import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  RedisV3TransactionsStreamTransaction,
  RedisV3TransactionsStreamTransactionToModel,
} from 'src/database/entities/redis-entities';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.providers';
import { TRANSACTION_EVENTS } from 'src/common/events/transaction.events';

type XReadGroupResponse = [string, [string, string[]][]][] | null;

@Injectable()
export class V3TransactionsListenerService
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(REDIS_CLIENT)
    private redisProvider: Redis,
    private eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(V3TransactionsListenerService.name);
  private listening = true;

  onModuleInit() {
    this.listenToStream();
  }

  onModuleDestroy() {
    this.listening = false;
  }

  private async listenToStream() {
    const stream = '1_v3transactions';
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
              const rawTransaction: RedisV3TransactionsStreamTransaction =
                JSON.parse(
                  fields.transaction,
                ) as RedisV3TransactionsStreamTransaction;

              console.log('raw transaction: ', rawTransaction);

              const transaction =
                RedisV3TransactionsStreamTransactionToModel(rawTransaction);

              console.log('new transaction: ', transaction);

              this.eventEmitter.emit(
                TRANSACTION_EVENTS.TransactionAdded,
                transaction,
              );

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
