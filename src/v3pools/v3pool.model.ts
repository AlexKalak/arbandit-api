import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Token } from 'src/tokens/token.model';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@InputType()
export class V3PoolWhere {
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
  isDusty?: boolean;

  @Field({ nullable: true })
  liquidity?: string;

  @Field({ nullable: true })
  tick?: number;

  @Field({ nullable: true })
  tick_gt?: number;
  // @Field({ nullable: true })
  // tick?: number;
  // @Field({ nullable: true })
  // tick?: number;

  @Field({ nullable: true })
  token0Symbol?: string;

  @Field({ nullable: true })
  token1Symbol?: string;
}

@ObjectType()
@Index('uniswap_v3_pools_pkey', ['address'], { unique: true })
@Entity('uniswap_v3_pools', { schema: 'public' })
export class V3Pool {
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
  @Column('numeric', { name: 'sqrt_price_x96', nullable: true })
  sqrtPriceX96: string | null;

  @Field(() => String)
  @Column('numeric', { name: 'liquidity', nullable: true })
  liquidity: string | null;

  @Field(() => Int)
  @Column('integer', { name: 'tick', nullable: true, default: () => '0' })
  tick: number | null;

  @Field(() => Int)
  @Column('integer', { name: 'fee_tier', nullable: true })
  feeTier: number | null;

  @Field(() => Int)
  @Column('integer', { name: 'chain_id', nullable: true })
  chainId: number | null;

  @Field(() => Boolean)
  @Column('boolean', { name: 'is_dusty', nullable: true })
  isDusty: boolean | null;

  @Field(() => String)
  @Column('character varying', { name: 'exchange_name', nullable: true })
  exchangeName: string | null;

  @Field(() => Int)
  @Column('integer', {
    name: 'block_number',
    nullable: true,
    default: () => '0',
  })
  blockNumber: number | null;

  @Field(() => Int)
  @Column('integer', {
    name: 'tick_spacing',
    nullable: true,
    default: () => '0',
  })
  tickSpacing: number | null;

  @Field(() => Int)
  @Column('integer', { name: 'tick_lower', nullable: true, default: () => '0' })
  tickLower: number | null;

  @Field(() => Int)
  @Column('integer', { name: 'tick_upper', nullable: true, default: () => '0' })
  tickUpper: number | null;

  @Field(() => String)
  @Column('text', { name: 'near_ticks', nullable: true, default: () => "'[]'" })
  nearTicks: string | null;

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
