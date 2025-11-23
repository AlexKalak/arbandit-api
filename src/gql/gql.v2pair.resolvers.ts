import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { V2Pair, V2PairWhere } from 'src/v2pairs/v2pair.model';
import { V2PairService } from 'src/v2pairs/v2pair.service';

@Resolver()
export class GQLV2PoolResolver {
  constructor(private readonly v2PairService: V2PairService) {}

  @Query(() => [V2Pair])
  async v3pools(
    @Args('where', { type: () => V2Pair, nullable: true })
    where?: V2PairWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 1000,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<V2Pair[]> {
    if (first > 1000) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return this.v2PairService.findAll(first, skip, where);
  }
}
