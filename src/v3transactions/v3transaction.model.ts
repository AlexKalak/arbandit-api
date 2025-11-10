import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { V3Pool } from 'src/v3pools/v3pool.model';
// import { V3Pool } from 'src/v3pools/v3pool.model';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  // ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@InputType()
export class V3TransactionWhere {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  chainId?: number;

  @Field({ nullable: true })
  txHash?: string;

  @Field({ nullable: true })
  blockNumber?: number;

  @Field({ nullable: true })
  poolAddress?: string;
}

@ObjectType()
@Index('v3_pool_transactions_pkey', ['id'], { unique: true })
@Entity('v3_pool_transactions', { schema: 'public' })
export class V3Transaction {
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
  @Column('character varying', { name: 'pool_address' })
  poolAddress: string;

  @Field(() => V3Pool, { nullable: true })
  @ManyToOne(() => V3Pool, { nullable: true })
  @JoinColumn({ name: 'pool_address' })
  pool: Promise<V3Pool> | null;
}
