import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Arbitrage } from 'src/arbitrage/arbitrage.model';
import { ArbitrageService } from 'src/arbitrage/arbitrage.service';

@Resolver()
export class GQLArbitrageResolver {
  constructor(private readonly arbitrageService: ArbitrageService) { }

  @Query(() => [Arbitrage])
  async on_chain_arbitrages(
    @Args('chainId', { type: () => Int, nullable: false })
    chainID: number,
  ): Promise<Arbitrage[]> {
    return this.arbitrageService.GetOnChainArbs(chainID);
  }
}
