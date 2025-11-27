import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Token } from 'src/tokens/token.model';
import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';

@InputType()
export class V2PairWhere {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  chainId?: number;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  token0Address?: string;

  @Field({ nullable: true })
  token1Address?: string;

  @Field({ nullable: true })
  token0Symbol?: string;

  @Field({ nullable: true })
  token1Symbol?: string;
}

@ObjectType()
@Index('uniswap_v2_pairs_pkey', ['address'], { unique: true })
@Entity('uniswap_v2_pairs', { schema: 'public' })
export class V2Pair {
  @Field(() => String)
  @Column('character varying', { primary: true, name: 'address' })
  address: string;

  @Field(() => String)
  @Column('character varying', { name: 'token0_address', nullable: true })
  token0Address: string | null;

  @Field(() => Token)
  @ManyToOne(() => Token)
  @JoinColumn({ name: 'token0_address' })
  token0: Promise<Token>;

  @Field(() => String)
  @Column('character varying', { name: 'token1_address', nullable: true })
  token1Address: string | null;

  @Field(() => Token)
  @ManyToOne(() => Token)
  @JoinColumn({ name: 'token1_address' })
  token1: Promise<Token>;

  @Field(() => String)
  @Column('numeric', { name: 'amount0' })
  amount0: string;

  @Field(() => String)
  @Column('numeric', { name: 'amount1' })
  amount1: string;

  @Field(() => Int)
  @Column('integer', { name: 'chain_id', nullable: true })
  chainId: number | null;

  @Field(() => Boolean)
  @Column('boolean', { name: 'is_dusty', nullable: true })
  isDusty: boolean | null;

  @Field(() => Int)
  @Column('integer', { name: 'fee_tier', nullable: true })
  feeTier: number | null;

  @Field(() => String)
  @Column('character varying', { name: 'exchange_name', nullable: true })
  exchangeName: string | null;

  @Field(() => Int)
  @Column('integer', { name: 'block_number', nullable: true })
  blockNumber: number | null;

  @Field(() => String)
  @Column('numeric', {
    name: 'zfo_10usd_rate',
    nullable: true,
    default: () => '0',
  })
  zfo_10usdRate: string | null;

  @Field(() => String)
  @Column('numeric', {
    name: 'non_zfo_10usd_rate',
    nullable: true,
    default: () => '0',
  })
  nonZfo_10usdRate: string | null;
}
