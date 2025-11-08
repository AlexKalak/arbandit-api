import { Module } from '@nestjs/common';
import { V3TransactionModule } from 'src/v3transactions/v3transaction.module';
import { GQLV3TransactionResolver } from './gql.v3transaction.resolvers';
import { GQLV3PoolResolver } from './gql.v3pool.resolvers';
import { V3PoolModule } from 'src/v3pools/v3pool.module';
import { PubSubModule } from './pubsub.provider';
import { GQLTokenResolver } from './gql.token.resolvers';
import { TokenModule } from 'src/tokens/token.module';

@Module({
  imports: [V3TransactionModule, V3PoolModule, PubSubModule, TokenModule],
  exports: [GQLV3TransactionResolver],
  providers: [GQLV3TransactionResolver, GQLV3PoolResolver, GQLTokenResolver],
})
export class GQLModule {}
