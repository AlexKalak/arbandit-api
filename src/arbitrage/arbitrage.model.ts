import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ArbitragePathUnit {
  @Field(() => String)
  poolAddress: string;
  @Field(() => String)
  tokenInAddress: string;
  @Field(() => String)
  tokenOutAddress: string;
  @Field(() => String)
  amountIn: string;
  @Field(() => String)
  amountOut: string;
}

@ObjectType()
export class Arbitrage {
  @Field(() => [ArbitragePathUnit])
  path: ArbitragePathUnit[];
}
