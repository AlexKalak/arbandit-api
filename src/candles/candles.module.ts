import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/gql/pubsub.provider';
import { RedisModule } from 'src/redis/redis.module';
import { CandlesService } from './candles.service';
import { V3PoolModule } from 'src/v3pools/v3pool.module';
import { V3TransactionModule } from 'src/v3transactions/v3transaction.module';

@Module({
  imports: [V3PoolModule, V3TransactionModule, RedisModule, PubSubModule],
  providers: [CandlesService],
  exports: [CandlesService],
})
export class CandlesModule {}
