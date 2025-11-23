import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/gql/pubsub.provider';
import { RedisModule } from 'src/redis/redis.module';
import { v2SwapProviders } from './v2swap.providers';
import { V2SwapsListenerService } from './v2swapListener.service';
import { V2SwapService } from './v2swap.service';

@Module({
  imports: [DatabaseModule, RedisModule, PubSubModule],
  providers: [...v2SwapProviders, V2SwapService, V2SwapsListenerService],
  exports: [V2SwapService],
})
export class V2SwapModule {}
