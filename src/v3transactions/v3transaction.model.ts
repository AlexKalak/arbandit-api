import { V3Pool } from 'src/v3pools/v3pool.model';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('v3_pool_transactions_pkey', ['id'], { unique: true })
@Entity('v3_pool_transactions', { schema: 'public' })
export class V3Transaction {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column('character varying', { name: 'tx_hash' })
  txHash: string;

  @Column('integer', { name: 'block_number' })
  blockNumber: number;

  @Column('numeric', { name: 'amount0' })
  amount0: string;

  @Column('numeric', { name: 'amount1' })
  amount1: string;

  @Column('numeric', { name: 'archive_token0_usd_price' })
  archiveToken0UsdPrice: string;

  @Column('numeric', { name: 'archive_token1_usd_price' })
  archiveToken1UsdPrice: string;

  @Column('integer', { name: 'chain_id' })
  chainId: number;

  @Column('character varying', { name: 'pool_address' })
  poolAddress: string;
  @ManyToOne(() => V3Pool)
  pool: Promise<V3Pool>;
}
