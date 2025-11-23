import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/gql/pubsub.provider';
import { RedisModule } from 'src/redis/redis.module';
import { CandlesService } from './candles.service';
import { V3PoolModule } from 'src/v3pools/v3pool.module';
import { V3SwapModule } from 'src/v3swaps/v3swap.module';
import { V2PairModule } from 'src/v2pairs/v2pair.module';
import { V2SwapModule } from 'src/v2swaps/v2swap.module';

@Module({
  imports: [
    V3PoolModule,
    V3SwapModule,
    V2PairModule,
    V2SwapModule,
    RedisModule,
    PubSubModule,
  ],
  providers: [CandlesService],
  exports: [CandlesService],
})
export class CandlesModule {}
