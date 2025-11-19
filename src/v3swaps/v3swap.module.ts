import { DatabaseModule } from 'src/database/database.module';
import { v3SwapProviders } from './v3swap.providers';
import { V3SwapService } from './v3swap.service';
import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/gql/pubsub.provider';
import { RedisModule } from 'src/redis/redis.module';
import { V3SwapsListenerService } from './v3swapListener.service';

@Module({
  imports: [DatabaseModule, RedisModule, PubSubModule],
  providers: [...v3SwapProviders, V3SwapService, V3SwapsListenerService],
  exports: [V3SwapService],
})
export class V3SwapModule {}
