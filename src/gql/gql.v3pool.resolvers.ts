import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { V3Pool, V3PoolWhere } from 'src/v3pools/v3pool.model';
import { V3PoolService } from 'src/v3pools/v3pool.service';

@Resolver()
export class GQLV3PoolResolver {
  constructor(private readonly v3PoolService: V3PoolService) {}

  @Query(() => [V3Pool])
  async v3pools(
    @Args('where', { type: () => V3PoolWhere, nullable: true })
    where?: V3PoolWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 1000,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<V3Pool[]> {
    if (first > 1000) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return this.v3PoolService.findAll(first, skip, where);
  }
}
