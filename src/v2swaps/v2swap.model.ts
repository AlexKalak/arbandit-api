import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { V2Pair } from 'src/v2pairs/v2pair.model';

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@InputType()
export class V2SwapWhere {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  chainId?: number;

  @Field({ nullable: true })
  txHash?: string;

  @Field({ nullable: true })
  blockNumber?: number;

  @Field({ nullable: true })
  pairAddress?: string;
}

@ObjectType()
@Index('v2_pair_swaps_pkey', ['id'], { unique: true })
@Entity('v2_pair_swaps', { schema: 'public' })
export class V2Swap {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'tx_hash' })
  txHash: string;

  @Field(() => Int, { nullable: true })
  @Column('integer', { name: 'tx_timestamp' })
  txTimestamp: number;

  @Field(() => String, { nullable: true })
  @Column('integer', { name: 'block_number' })
  blockNumber: number;

  @Field(() => String, { nullable: true })
  @Column('numeric', { name: 'amount0' })
  amount0: number;

  @Field(() => String, { nullable: true })
  @Column('numeric', { name: 'amount1' })
  amount1: number;

  @Field(() => String, { nullable: true })
  @Column('numeric', { name: 'archive_token0_usd_price' })
  archiveToken0UsdPrice: number;

  @Field(() => String, { nullable: true })
  @Column('numeric', { name: 'archive_token1_usd_price' })
  archiveToken1UsdPrice: number;

  @Field(() => String, { nullable: true })
  @Column('integer', { name: 'chain_id' })
  chainId: number;

  @Field(() => String, { nullable: true })
  @Column('character varying', { name: 'pair_address' })
  pairAddress: string;

  @Field(() => V2Pair, { nullable: true })
  @ManyToOne(() => V2Pair, { nullable: true })
  @JoinColumn({ name: 'pair_address' })
  pair: Promise<V2Pair> | null;
}
