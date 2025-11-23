import { Inject } from '@nestjs/common';
import { Args, Int, Query, Resolver, Subscription } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './pubsub.provider';
import { getV2SwapTrigger } from 'src/common/graphql/graphql.utils';
import { OnEvent } from '@nestjs/event-emitter';
import { SWAP_EVENTS } from 'src/common/events/swap.events';
import { V2SwapService } from 'src/v2swaps/v2swap.service';
import { V2Swap, V2SwapWhere } from 'src/v2swaps/v2swap.model';

@Resolver()
export class GQLV2SwapResolver {
  constructor(
    private readonly v2SwapService: V2SwapService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Query(() => [V2Swap])
  async v2swaps(
    @Args('fromHead', { type: () => Boolean, nullable: true })
    fromHead: boolean = true,
    @Args('where', { type: () => V2SwapWhere, nullable: true })
    where?: V2SwapWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 100,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<V2Swap[]> {
    if (first > 100) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return this.v2SwapService.find({
      first,
      skip,
      fromHead,
      where,
    });
  }

  @OnEvent(SWAP_EVENTS.V2SwapAdded)
  async hanleSwapEvent(swap: V2Swap) {
    await this.pubSub.publish(
      getV2SwapTrigger(swap.pairAddress, swap.chainId),
      {
        v2SwapAdded: swap,
      },
    );
  }
  @Subscription(() => V2Swap, {})
  v2SwapAdded(
    @Args('pairAddress', { type: () => String })
    pairAddress: string,
    @Args('chainId', { type: () => Int })
    chainId: number,
  ) {
    return this.pubSub.asyncIterableIterator(
      getV2SwapTrigger(pairAddress, chainId),
    );
  }
}
