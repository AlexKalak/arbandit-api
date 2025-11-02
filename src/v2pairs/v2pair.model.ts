import { Column, Entity, Index } from 'typeorm';

@Index('uniswap_v2_pairs_pkey', ['address'], { unique: true })
@Entity('uniswap_v2_pairs', { schema: 'public' })
export class V2Pair {
  @Column('character varying', { primary: true, name: 'address' })
  address: string;

  @Column('character varying', { name: 'token0', nullable: true })
  token0: string | null;

  @Column('character varying', { name: 'token1', nullable: true })
  token1: string | null;

  @Column('numeric', { name: 'amount0' })
  amount0: string;

  @Column('numeric', { name: 'amount1' })
  amount1: string;

  @Column('integer', { name: 'chain_id', nullable: true })
  chainId: number | null;

  @Column('boolean', { name: 'is_dusty', nullable: true })
  isDusty: boolean | null;

  @Column('integer', { name: 'fee_tier', nullable: true })
  feeTier: number | null;

  @Column('character varying', { name: 'exchange_name', nullable: true })
  exchangeName: string | null;

  @Column('integer', { name: 'block_number', nullable: true })
  blockNumber: number | null;
}
