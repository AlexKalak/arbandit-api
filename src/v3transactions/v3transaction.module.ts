import { DatabaseModule } from 'src/database/database.module';
import { v3TransactionProviders } from './v3transaction.providers';
import { V3TransactionService } from './v3transaction.service';
import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/gql/pubsub.provider';
import { V3TransactionsListenerService } from './v3transactionslistener.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [DatabaseModule, RedisModule, PubSubModule],
  providers: [
    ...v3TransactionProviders,
    V3TransactionService,
    V3TransactionsListenerService,
  ],
  exports: [V3TransactionService],
})
export class V3TransactionModule {}
