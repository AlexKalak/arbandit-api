import { Inject } from '@nestjs/common';
import { Args, Int, Query, Resolver, Subscription } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import {
  V3Transaction,
  V3TransactionWhere,
} from 'src/v3transactions/v3transaction.model';
import { V3TransactionService } from 'src/v3transactions/v3transaction.service';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './pubsub.provider';
import { getV3TransactionTrigger } from 'src/common/graphql/graphql.utils';

@Resolver()
export class GQLV3TransactionResolver {
  constructor(
    private readonly v3TransactionService: V3TransactionService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Query(() => [V3Transaction])
  async v3transactions(
    @Args('fromHead', { type: () => Boolean, nullable: true })
    fromHead: boolean = true,
    @Args('where', { type: () => V3TransactionWhere, nullable: true })
    where?: V3TransactionWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 100,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<V3Transaction[]> {
    if (first > 100) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }
    return this.v3TransactionService.findAll(first, skip, fromHead, where);
  }

  @Subscription(() => V3Transaction, {})
  transactionAdded(
    @Args('poolAddress', { type: () => String })
    poolAddress: string,
    @Args('chainId', { type: () => Int })
    chainId: number,
  ) {
    return this.pubSub.asyncIterableIterator(
      getV3TransactionTrigger(poolAddress, chainId),
    );
  }
}
