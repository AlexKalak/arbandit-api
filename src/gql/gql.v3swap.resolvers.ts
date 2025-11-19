import { Inject } from '@nestjs/common';
import { Args, Int, Query, Resolver, Subscription } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { V3Swap, V3SwapWhere } from 'src/v3swaps/v3swap.model';
import { V3SwapService } from 'src/v3swaps/v3swap.service';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './pubsub.provider';
import { getV3SwapTrigger } from 'src/common/graphql/graphql.utils';
import { OnEvent } from '@nestjs/event-emitter';
import { SWAP_EVENTS } from 'src/common/events/swap.events';

@Resolver()
export class GQLV3SwapResolver {
  constructor(
    private readonly v3SwapService: V3SwapService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) { }

  @Query(() => [V3Swap])
  async v3swaps(
    @Args('fromHead', { type: () => Boolean, nullable: true })
    fromHead: boolean = true,
    @Args('where', { type: () => V3SwapWhere, nullable: true })
    where?: V3SwapWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 100,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<V3Swap[]> {
    if (first > 100) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }
    return this.v3SwapService.find({
      first,
      skip,
      fromHead,
      where,
    });
  }

  @OnEvent(SWAP_EVENTS.SwapAdded)
  async hanleSwapEvent(swap: V3Swap) {
    await this.pubSub.publish(
      getV3SwapTrigger(swap.poolAddress, swap.chainId),
      {
        swapAdded: swap,
      },
    );
  }
  @Subscription(() => V3Swap, {})
  swapAdded(
    @Args('poolAddress', { type: () => String })
    poolAddress: string,
    @Args('chainId', { type: () => Int })
    chainId: number,
  ) {
    return this.pubSub.asyncIterableIterator(
      getV3SwapTrigger(poolAddress, chainId),
    );
  }
}
