import { Module } from '@nestjs/common';
import { V3SwapModule } from 'src/v3swaps/v3swap.module';
import { GQLV3SwapResolver } from './gql.v3swap.resolvers';
import { GQLV3PoolResolver } from './gql.v3pool.resolvers';
import { V3PoolModule } from 'src/v3pools/v3pool.module';
import { PubSubModule } from './pubsub.provider';
import { GQLTokenResolver } from './token.gql.resolvers';
import { TokenModule } from 'src/tokens/token.module';
import { GQLCandlesResolver } from 'src/candles/candles.resolver';
import { CandlesModule } from 'src/candles/candles.module';
import { GQLArbitrageResolver } from './gql.arbitrage.resolver';
import { ArbitrageModule } from 'src/arbitrage/arbitrage.module';
import { V2SwapModule } from 'src/v2swaps/v2swap.module';
import { GQLV2SwapResolver } from './gql.v2swap.resolvers';
import { V2PairModule } from 'src/v2pairs/v2pair.module';

@Module({
  imports: [
    V3SwapModule,
    V2SwapModule,
    V3PoolModule,
    V2PairModule,
    PubSubModule,
    TokenModule,
    CandlesModule,
    ArbitrageModule,
  ],
  exports: [GQLV3SwapResolver],
  providers: [
    GQLV3SwapResolver,
    GQLV2SwapResolver,
    GQLV3PoolResolver,
    GQLTokenResolver,
    GQLCandlesResolver,
    GQLArbitrageResolver,
  ],
})
export class GQLModule {}
