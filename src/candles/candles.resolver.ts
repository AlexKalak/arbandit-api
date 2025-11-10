import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CandlesService } from './candles.service';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from 'src/gql/pubsub.provider';
import { PubSub } from 'graphql-subscriptions';
import { Candle } from './candle.model';

@Resolver()
export class GQLCandlesResolver {
  constructor(
    private readonly candlesService: CandlesService,
    @Inject(PUB_SUB) private pubSub: PubSub,
  ) {}

  @Query(() => [Candle])
  async candles(
    @Args('poolAddress', { type: () => String })
    poolAddress: string,
    @Args('chainId', { type: () => Int })
    chainID: number,
    @Args('chartForToken', { type: () => Int })
    chartForToken: number,
    @Args('timeSpacing', { type: () => Int })
    timeSpacing: number,
  ): Promise<Candle[]> {
    return this.candlesService.findForV3Pool({
      poolAddress,
      chainID,
      chartForToken,
      timeSpacing,
    });
  }

  // @OnEvent(TRANSACTION_EVENTS.TransactionAdded)
  // async hanleTransactionEvent(transaction: V3Transaction) {
  //   await this.pubSub.publish(
  //     getV3TransactionTrigger(transaction.poolAddress, transaction.chainId),
  //     {
  //       transactionAdded: transaction,
  //     },
  //   );
  // }
  // @Subscription(() => V3Transaction, {})
  // transactionAdded(
  //   @Args('poolAddress', { type: () => String })
  //   poolAddress: string,
  //   @Args('chainId', { type: () => Int })
  //   chainId: number,
  // ) {
  //   return this.pubSub.asyncIterableIterator(
  //     getV3TransactionTrigger(poolAddress, chainId),
  //   );
  // }
}
