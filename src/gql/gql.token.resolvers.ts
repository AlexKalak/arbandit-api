import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Token, TokenWhere } from 'src/tokens/token.model';
import { TokenService } from 'src/tokens/token.service';

@Resolver()
export class GQLTokenResolver {
  constructor(private readonly tokenService: TokenService) {}

  @Query(() => [Token])
  async tokens(
    @Args('where', { type: () => TokenWhere, nullable: true })
    where?: TokenWhere,
    @Args('first', { type: () => Int, nullable: true })
    first: number = 100,
    @Args('skip', { type: () => Int, nullable: true })
    skip: number = 0,
  ): Promise<Token[]> {
    if (first > 100) {
      throw new GraphQLError('Too many entities requested', {
        extensions: {
          code: 'TOO_MANY_ENTITIES',
          timestamp: new Date().toISOString(),
        },
      });
    }

    return this.tokenService.findAll(first, skip, where);
  }
}
