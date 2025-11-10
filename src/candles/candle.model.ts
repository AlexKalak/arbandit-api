import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Candle {
  @Field(() => String)
  uuid: string;

  @Field(() => String)
  open: number;

  @Field(() => String)
  close: number;

  @Field(() => String)
  low: number;

  @Field(() => String)
  high: number;

  @Field(() => Int)
  amountTransactions: number;

  @Field(() => Int)
  timestamp: number;
}
