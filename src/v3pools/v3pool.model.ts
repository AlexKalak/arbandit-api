import { Token } from 'src/tokens/token.model';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

@Index('uniswap_v3_pools_pkey', ['address'], { unique: true })
@Entity('uniswap_v3_pools', { schema: 'public' })
export class V3Pool {
  @Column('character varying', { primary: true, name: 'address' })
  address: string;

  @Column('character varying', { name: 'token0_address', nullable: true })
  token0Address: string | null;
  @ManyToOne(() => Token)
  token0: Promise<Token>;

  @Column('character varying', { name: 'token1_address', nullable: true })
  token1Address: string | null;
  @ManyToOne(() => Token)
  token1: Promise<Token>;

  @Column('bigint', { name: 'amount0', nullable: true })
  amount0: string | null;

  @Column('bigint', { name: 'amount1', nullable: true })
  amount1: string | null;

  @Column('numeric', { name: 'sqrt_price_x96', nullable: true })
  sqrtPriceX96: string | null;

  @Column('numeric', { name: 'liquidity', nullable: true })
  liquidity: string | null;

  @Column('integer', { name: 'tick', nullable: true, default: () => '0' })
  tick: number | null;

  @Column('integer', { name: 'fee_tier', nullable: true })
  feeTier: number | null;

  @Column('integer', { name: 'chain_id', nullable: true })
  chainId: number | null;

  @Column('boolean', { name: 'is_dusty', nullable: true })
  isDusty: boolean | null;

  @Column('character varying', { name: 'exchange_name', nullable: true })
  exchangeName: string | null;

  @Column('integer', {
    name: 'block_number',
    nullable: true,
    default: () => '0',
  })
  blockNumber: number | null;

  @Column('integer', {
    name: 'tick_spacing',
    nullable: true,
    default: () => '0',
  })
  tickSpacing: number | null;

  @Column('integer', { name: 'tick_lower', nullable: true, default: () => '0' })
  tickLower: number | null;

  @Column('integer', { name: 'tick_upper', nullable: true, default: () => '0' })
  tickUpper: number | null;

  @Column('text', { name: 'near_ticks', nullable: true, default: () => "'[]'" })
  nearTicks: string | null;

  @Column('numeric', {
    name: 'zfo_10usd_rate',
    nullable: true,
    default: () => '0',
  })
  zfo_10usdRate: string | null;

  @Column('numeric', {
    name: 'non_zfo_10usd_rate',
    nullable: true,
    default: () => '0',
  })
  nonZfo_10usdRate: string | null;
}
